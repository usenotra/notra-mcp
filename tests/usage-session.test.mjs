import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import { after, before, test } from "node:test";
import { flushMcpEvents } from "@usenotra/geo/mcp";
import { Hono } from "hono";
import { exportJWK, generateKeyPair, SignJWT } from "jose";

const INGEST_ORIGIN = "https://ingest.usenotra.com";
const AUTHKIT_DOMAIN = "usage-session-test.authkit.example";
const ISSUER = `https://${AUTHKIT_DOMAIN}`;
const RESOURCE = "https://notra-mcp.example/mcp";
const IDLE_MS = 30 * 60 * 1000;
const NOW = Date.UTC(2026, 10, 22, 14, 0);
const ingested = [];
const realFetch = globalThis.fetch;
let signingKey;
let upstream;
let server;
let url;
let nextId = 1;

function headers({ token = "test-account-key", agent = "claude-code/2.1.330", workspace, alias } = {}) {
  const result = new Headers({ authorization: `Bearer ${token}`, "user-agent": agent });
  if (workspace) result.set("x-notra-organization-id", workspace);
  if (alias) result.set("x-organization-id", alias);
  return result;
}

const apiKey = (token = "test-account-key") => ({ kind: "apiKey", token });
const oauth = (userId, organizationId = "workspace-a") => ({
  kind: "oauth",
  token: `token-${userId}-${organizationId}`,
  userId,
  organizationId,
  scopes: [],
});

function oauthToken(sub, workspace, { issuer = ISSUER, key = signingKey } = {}) {
  return new SignJWT({ "urn:notra:workspace": workspace })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(issuer)
    .setAudience(RESOURCE)
    .setSubject(sub)
    .setExpirationTime("5m")
    .sign(key);
}

async function sessions() {
  const { createUsageSessions } = await import("../build/utils/usage-session.js");
  return createUsageSessions(IDLE_MS, 100);
}

before(async () => {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  signingKey = privateKey;
  const jwk = await exportJWK(publicKey);
  // Capture what the SDK would send to Notra, serve the AuthKit keys, and leave every other request alone.
  globalThis.fetch = async (input, init) => {
    const target = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    if (target.href === `${ISSUER}/oauth2/jwks`) return Response.json({ keys: [jwk] });
    if (target.origin !== INGEST_ORIGIN) return realFetch(input, init);
    ingested.push(...JSON.parse(init.body).events);
    return new Response(null, { status: 202 });
  };

  upstream = createHttpServer((_req, res) => {
    res.writeHead(404, { "Content-Type": "application/json" }).end(JSON.stringify({ error: "Not found" }));
  }).listen(0, "127.0.0.1");
  await once(upstream, "listening");
  process.env.NOTRA_API_BASE = `http://127.0.0.1:${upstream.address().port}`;
  process.env.NOTRA_GEO_TOKEN = "test-geo-token";
  process.env.WORKOS_AUTHKIT_DOMAIN = AUTHKIT_DOMAIN;
  process.env.NOTRA_MCP_RESOURCE = RESOURCE;
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

async function initialize(app, requestHeaders) {
  const response = await app.request("/mcp", {
    method: "POST",
    headers: { ...Object.fromEntries(requestHeaders), "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "legacy", version: "1.0.0" } },
    }),
  });
  assert.equal(response.status, 200);
}

async function initializeApp() {
  const { trackInitialize } = await import("../build/utils/mcp-usage.js");
  const app = new Hono();
  app.use("/mcp", trackInitialize({ name: "notra", version: "test" }));
  app.post("/mcp", (c) => c.json({ jsonrpc: "2.0", id: 1, result: {} }));
  return app;
}

async function drain() {
  await flushMcpEvents();
  return ingested.splice(0);
}

test("keeps one caller's requests in one session until they go idle", async () => {
  const resolve = await sessions();
  const first = resolve(apiKey(), headers(), NOW);
  assert.match(first, /^[0-9a-f-]{36}$/);
  assert.equal(resolve(apiKey(), headers(), NOW + IDLE_MS), first);
  // Each request moves the idle deadline, so steady traffic stays in one session.
  assert.equal(resolve(apiKey(), headers(), NOW + 2 * IDLE_MS), first);
  assert.notEqual(resolve(apiKey(), headers(), NOW + 3 * IDLE_MS + 1), first);
});

test("separates callers and clients, and skips requests without verified auth", async () => {
  const resolve = await sessions();
  const ids = [
    resolve(apiKey(), headers(), NOW),
    resolve(apiKey("another-account-key"), headers(), NOW),
    resolve(apiKey(), headers({ agent: "Cursor/1.0.0" }), NOW),
    resolve(oauth("user_1"), headers(), NOW),
  ];
  assert.equal(new Set(ids).size, 4);
  assert.equal(resolve(undefined, headers(), NOW), undefined);
});

test("picks an API key's workspace from the scoped URL, the header or its alias", async () => {
  const { runInRequestScope } = await import("../build/utils/request-scope.js");
  const resolve = await sessions();
  const viaHeader = resolve(apiKey(), headers({ workspace: "acme" }), NOW);

  assert.equal(resolve(apiKey(), headers({ alias: "acme" }), NOW), viaHeader);
  assert.equal(
    await runInRequestScope({ organizationScope: "acme" }, () => resolve(apiKey(), headers(), NOW)),
    viaHeader,
  );
  assert.notEqual(resolve(apiKey(), headers({ alias: "beta" }), NOW), viaHeader);
  assert.notEqual(resolve(apiKey(), headers(), NOW), viaHeader);
});

test("groups OAuth callers by user and consent workspace, not by token", async () => {
  const resolve = await sessions();
  const first = resolve(oauth("user_1"), headers(), NOW);
  assert.equal(resolve({ ...oauth("user_1"), token: "refreshed" }, headers(), NOW + 1_000), first);
  // A workspace header can't move an OAuth caller, because its token is bound to the consent workspace.
  assert.equal(resolve(oauth("user_1"), headers({ workspace: "other" }), NOW + 2_000), first);
  assert.notEqual(resolve(oauth("user_1", "workspace-b"), headers(), NOW + 3_000), first);
  assert.notEqual(resolve(oauth("user_2"), headers(), NOW + 4_000), first);
});

test("forgets the least recently seen callers past the cap", async () => {
  const { createUsageSessions } = await import("../build/utils/usage-session.js");
  const resolve = createUsageSessions(IDLE_MS, 2);
  const a = resolve(apiKey("a"), headers(), NOW);
  const b = resolve(apiKey("b"), headers(), NOW);
  assert.equal(resolve(apiKey("a"), headers(), NOW + 1), a);
  resolve(apiKey("c"), headers(), NOW + 2);
  assert.equal(resolve(apiKey("a"), headers(), NOW + 3), a);
  assert.notEqual(resolve(apiKey("b"), headers(), NOW + 4), b);
});

test("reports a client's tool list and tool calls under one session id", async () => {
  await drain();
  await rpc("tools/list");
  await rpc("tools/call", { name: "whoami", arguments: {} });
  await rpc("tools/list", undefined, headers({ agent: "Cursor/1.0.0" }));
  await rpc("tools/list", undefined, headers({ alias: "beta" }));
  const events = await drain();

  assert.deepEqual(
    events.map((event) => event.method),
    ["tools/list", "tools/call", "tools/list", "tools/list"],
  );
  const [list, call, otherClient, otherWorkspace] = events.map((event) => event.sessionId);
  assert.ok(list);
  assert.equal(call, list);
  assert.equal(new Set([list, otherClient, otherWorkspace]).size, 3);
});

test("puts a 2025-era initialize in the same session as the requests after it", async () => {
  const app = await initializeApp();
  const requestHeaders = headers({ agent: "legacy-client/1.0.0" });

  await drain();
  await initialize(app, requestHeaders);
  await rpc("tools/list", undefined, requestHeaders);
  const events = await drain();

  assert.deepEqual(
    events.map((event) => event.method),
    ["initialize", "tools/list"],
  );
  assert.equal(events[0].sessionId, events[1].sessionId);
});

test("keeps a token with a borrowed subject out of that user's session", async () => {
  const app = await initializeApp();
  const agent = "oauth-client/1.0.0";
  const genuine = await oauthToken("user_1", "oauth-workspace");
  const { privateKey } = await generateKeyPair("RS256");
  const forged = await oauthToken("user_1", "oauth-workspace", { key: privateKey });
  const foreign = await oauthToken("user_1", "oauth-workspace", { issuer: "https://elsewhere.example" });

  await drain();
  await initialize(app, headers({ token: genuine, agent }));
  await rpc("tools/list", undefined, headers({ token: genuine, agent }));
  // A bad signature fails verification, so the request gets no session.
  await initialize(app, headers({ token: forged, agent }));
  // A JWT from another issuer is an API key to the server, so it gets that key's own session.
  await rpc("tools/list", undefined, headers({ token: foreign, agent }));
  const [first, second, bad, other] = await drain();

  assert.equal(second.sessionId, first.sessionId);
  assert.notEqual(bad.sessionId, first.sessionId);
  assert.notEqual(other.sessionId, first.sessionId);
});
