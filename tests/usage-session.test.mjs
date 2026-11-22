import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import { after, before, test } from "node:test";
import { flushMcpEvents } from "@usenotra/geo/mcp";
import { Hono } from "hono";

const INGEST_ORIGIN = "https://ingest.usenotra.com";
const IDLE_MS = 30 * 60 * 1000;
const ingested = [];
const realFetch = globalThis.fetch;
let upstream;
let server;
let url;
let nextId = 1;

function headers({ token = "test-account-key", agent = "claude-code/2.1.330", workspace = "workspace-test" } = {}) {
  return new Headers({ authorization: `Bearer ${token}`, "user-agent": agent, "x-notra-organization-id": workspace });
}

before(async () => {
  // Capture what the SDK would send to Notra and leave every other request alone.
  globalThis.fetch = async (input, init) => {
    const target = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!target.startsWith(INGEST_ORIGIN)) return realFetch(input, init);
    ingested.push(...JSON.parse(init.body).events);
    return new Response(null, { status: 202 });
  };

  upstream = createHttpServer((_req, res) => {
    res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "Not found" }));
  }).listen(0, "127.0.0.1");
  await once(upstream, "listening");
  process.env.NOTRA_API_BASE = `http://127.0.0.1:${upstream.address().port}`;
  process.env.NOTRA_GEO_TOKEN = "test-geo-token";
  process.env.WORKOS_AUTHKIT_DOMAIN = "usage-session-test.authkit.example";
  process.env.NOTRA_MCP_RESOURCE = "https://notra-mcp.example/mcp";
  delete process.env.NOTRA_MCP_TOOLSETS;

  const { createServer } = await import("../build/server.js");
  server = createServer({ trackUsage: true });
  ({ url } = await server.listen(0, { host: "127.0.0.1" }));
});

after(async () => {
  globalThis.fetch = realFetch;
  delete process.env.NOTRA_GEO_TOKEN;
  try {
    await server?.close();
  } finally {
    if (upstream) await new Promise((resolve) => upstream.close(resolve));
  }
});

async function rpc(method, params, requestHeaders = headers()) {
  const id = nextId++;
  const response = await realFetch(url, {
    method: "POST",
    headers: {
      ...Object.fromEntries(requestHeaders),
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2025-06-18",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    signal: AbortSignal.timeout(5_000),
  });
  assert.equal(response.status, 200, await response.clone().text());
  await response.text();
}

async function drain() {
  await flushMcpEvents();
  return ingested.splice(0);
}

test("keeps one caller's requests in one session until they go idle", async () => {
  const { createUsageSessions } = await import("../build/utils/usage-session.js");
  const resolve = createUsageSessions(IDLE_MS, 100);
  const start = Date.UTC(2026, 10, 22, 14, 0);

  const first = resolve(headers(), start);
  assert.match(first, /^[0-9a-f-]{36}$/);
  assert.equal(resolve(headers(), start + IDLE_MS), first);
  // Each request moves the idle deadline, so steady traffic stays in one session.
  assert.equal(resolve(headers(), start + 2 * IDLE_MS), first);
  assert.notEqual(resolve(headers(), start + 3 * IDLE_MS + 1), first);
});

test("separates callers, workspaces and clients, and skips requests without a token", async () => {
  const { createUsageSessions } = await import("../build/utils/usage-session.js");
  const resolve = createUsageSessions(IDLE_MS, 100);
  const now = Date.UTC(2026, 10, 22, 14, 0);
  const base = resolve(headers(), now);

  const others = [
    headers({ token: "another-account-key" }),
    headers({ workspace: "another-workspace" }),
    headers({ agent: "Cursor/1.0.0" }),
  ].map((variant) => resolve(variant, now));
  assert.equal(new Set([base, ...others]).size, 4);
  assert.equal(resolve(new Headers({ "user-agent": "claude-code/2.1.330" }), now), undefined);
  assert.equal(resolve(undefined, now), undefined);
});

test("groups OAuth tokens by user so a refreshed token keeps the session", async () => {
  const { createUsageSessions } = await import("../build/utils/usage-session.js");
  const resolve = createUsageSessions(IDLE_MS, 100);
  const now = Date.UTC(2026, 10, 22, 14, 0);
  const jwt = (claims) =>
    [{ alg: "RS256", typ: "JWT" }, claims, "signature"]
      .map((part, index) => (index === 2 ? part : Buffer.from(JSON.stringify(part)).toString("base64url")))
      .join(".");

  const first = resolve(headers({ token: jwt({ sub: "user_1", exp: 1 }) }), now);
  assert.equal(resolve(headers({ token: jwt({ sub: "user_1", exp: 2 }) }), now + 1_000), first);
  assert.notEqual(resolve(headers({ token: jwt({ sub: "user_2", exp: 1 }) }), now + 1_000), first);
});

test("forgets the least recently seen callers past the cap", async () => {
  const { createUsageSessions } = await import("../build/utils/usage-session.js");
  const resolve = createUsageSessions(IDLE_MS, 2);
  const now = Date.UTC(2026, 10, 22, 14, 0);

  const a = resolve(headers({ token: "a" }), now);
  const b = resolve(headers({ token: "b" }), now);
  assert.equal(resolve(headers({ token: "a" }), now + 1), a);
  resolve(headers({ token: "c" }), now + 2);
  assert.equal(resolve(headers({ token: "a" }), now + 3), a);
  assert.notEqual(resolve(headers({ token: "b" }), now + 4), b);
});

test("reports a client's tool list and tool calls under one session id", async () => {
  await drain();
  await rpc("tools/list");
  await rpc("tools/call", { name: "whoami", arguments: {} });
  await rpc("tools/list", undefined, headers({ agent: "Cursor/1.0.0" }));
  const events = await drain();

  assert.deepEqual(
    events.map((event) => event.method),
    ["tools/list", "tools/call", "tools/list"],
  );
  const [list, call, otherClient] = events.map((event) => event.sessionId);
  assert.ok(list);
  assert.equal(call, list);
  assert.notEqual(otherClient, list);
});

test("puts a 2025-era initialize in the same session as the requests after it", async () => {
  const { trackInitialize } = await import("../build/utils/mcp-usage.js");
  const app = new Hono();
  app.use("/mcp", trackInitialize({ name: "notra", version: "test" }));
  app.post("/mcp", (c) => c.json({ jsonrpc: "2.0", id: 1, result: {} }));
  const agent = "legacy-client/1.0.0";

  await drain();
  const response = await app.request("/mcp", {
    method: "POST",
    headers: { ...Object.fromEntries(headers({ agent })), "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "legacy", version: "1.0.0" } },
    }),
  });
  assert.equal(response.status, 200);
  await rpc("tools/list", undefined, headers({ agent }));
  const events = await drain();

  assert.deepEqual(
    events.map((event) => event.method),
    ["initialize", "tools/list"],
  );
  assert.equal(events[0].sessionId, events[1].sessionId);
});
