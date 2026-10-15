import { createServer as createHttpServer } from "node:http";
import { once } from "node:events";
import { afterAll, beforeAll, expect, test, vi } from "vitest";
import { McpServer } from "@modelcontextprotocol/server";

const state = vi.hoisted(() => ({ serverCalls: [], upstream: { requests: [], disconnects: [] } }));

vi.mock("../src/server.ts", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    createServer: (auth, options) => {
      state.serverCalls.push({ auth, options });
      return original.createServer(auth, options);
    },
  };
});
vi.mock("../src/utils/auth.ts", async (importOriginal) => ({
  ...(await importOriginal()),
  authenticateBearerToken: async (token) =>
    token === "oauth-token"
      ? { kind: "oauth", token, userId: "user-1", organizationId: "org-1", scopes: ["posts.read"] }
      : { kind: "apiKey", token },
}));

const META = {
  "io.modelcontextprotocol/protocolVersion": "2026-07-28",
  "io.modelcontextprotocol/clientCapabilities": {},
};
let mcpUrl;
let upstream;

beforeAll(async () => {
  upstream = createHttpServer(async (req, res) => {
    const started = Date.now();
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    state.upstream.requests.push({
      url: req.url,
      bytes: body.length,
      body: body.length < 10_000 ? body.toString() : undefined,
      organizationId: req.headers["x-notra-organization-id"],
    });
    res.on("close", () => {
      if (!res.writableEnded) state.upstream.disconnects.push({ url: req.url, afterMs: Date.now() - started });
    });
    if (req.url === "/v1/posts/wait-for-disconnect") return; // Never answers; only a disconnect ends it.
    // Tools now advertise output schemas from the OpenAPI spec, so the mock must
    // answer the CSV import with a spec-conformant body or the SDK flags isError.
    if (req.url.endsWith("/prompts/import")) {
      res
        .writeHead(200, { "content-type": "application/json" })
        .end(
          '{"imported":1,"updated":0,"skipped":0,"issues":[],"organization":{"id":"org-1","slug":"org","name":"Org","logo":null}}',
        );
      return;
    }
    res.writeHead(200, { "content-type": "application/json" }).end('{"imported":1}');
  });
  upstream.listen(0, "127.0.0.1");
  await once(upstream, "listening");

  vi.stubEnv("PORT", "0");
  vi.stubEnv("NOTRA_API_BASE", `http://127.0.0.1:${upstream.address().port}`);
  vi.stubEnv("NOTRA_MCP_RESOURCE", "http://127.0.0.1");
  vi.stubEnv("WORKOS_AUTHKIT_DOMAIN", "auth.example.test");
  vi.spyOn(console, "warn").mockImplementation(() => {});
  const listening = new Promise((resolve) => {
    vi.spyOn(console, "log").mockImplementation((message) => {
      const port = /listening on port (\d+)/.exec(String(message))?.[1];
      if (port) resolve(port);
    });
  });
  await import("../src/http.ts");
  mcpUrl = `http://127.0.0.1:${await listening}/mcp`;
});

afterAll(() => {
  upstream.closeAllConnections();
  upstream.close();
});

async function modern(method, params = {}, { token = "api-key", query = "", signal, headers = {}, path = "" } = {}) {
  const response = await fetch(`${mcpUrl}${path}${query}`, {
    method: "POST",
    signal,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-protocol-version": "2026-07-28",
      "mcp-method": method,
      ...(params.name && { "mcp-name": params.name }),
      ...headers,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params: { ...params, _meta: META } }),
  });
  const text = await response.text();
  const json = text.startsWith("{")
    ? text
    : text
        .split("\n")
        .find((line) => line.startsWith("data: "))
        ?.slice(6);
  return { status: response.status, contentType: response.headers.get("content-type"), body: JSON.parse(json) };
}

async function registeredToolNames() {
  const { createServer } = await import("../src/server.ts");
  const names = [];
  const register = vi.spyOn(McpServer.prototype, "registerTool").mockImplementation((name) => names.push(name));
  createServer("key");
  register.mockRestore();
  return names;
}

const toolNames = (body) => body.result.tools.map((tool) => tool.name);

test("tools/list serves all tools without repeated $schema keys", async () => {
  const { body } = await modern("tools/list");
  expect(toolNames(body).sort()).toEqual((await registeredToolNames()).sort());
  expect(JSON.stringify(body)).not.toContain("$schema");
});

test("toolsets query parameter narrows tools/list", async () => {
  const content = await modern("tools/list", {}, { query: "?toolsets=content" });
  const geo = await modern("tools/list", {}, { query: "?toolsets=geo" });
  const all = await registeredToolNames();
  expect(new Set([...toolNames(content.body), ...toolNames(geo.body)])).toEqual(new Set(all));
  expect(content.body.result.tools.length).toBeLessThan(all.length);
  expect(geo.body.result.tools.length).toBeLessThan(all.length);
  expect(content.body.result.tools.map((tool) => tool.name)).not.toContain("get_geo_snapshot");
  const invalid = await modern("tools/list", {}, { query: "?toolsets=nope" });
  expect(invalid.status).toBe(400);
  expect(invalid.body.error.code).toBe(-32602);
});

test("modern requests build servers with the full OAuth auth context", async () => {
  state.serverCalls.length = 0;
  await modern("tools/list", {}, { token: "oauth-token" });
  expect(state.serverCalls[0].auth).toEqual({
    kind: "oauth",
    token: "oauth-token",
    userId: "user-1",
    organizationId: "org-1",
    scopes: ["posts.read"],
  });
});

test("a 1 MB CSV import reaches the API and oversized bodies get a JSON-RPC error", async () => {
  const csv = "prompt\n" + "what is the best changelog tool for startups\n".repeat(23_000);
  expect(csv.length).toBeGreaterThan(1_000_000);
  expect(csv.length).toBeLessThanOrEqual(1024 * 1024);
  const ok = await modern("tools/call", { name: "import_geo_prompts", arguments: { projectId: "p1", csv: csv } });
  expect(ok.status).toBe(200);
  expect(ok.body.result.isError).toBeUndefined();
  expect(state.upstream.requests.at(-1).bytes).toBeGreaterThan(1_000_000);

  const tooLarge = await modern("tools/call", {
    name: "import_geo_prompts",
    arguments: { projectId: "p1", csv: csv.repeat(4) },
  });
  expect(tooLarge.status).toBe(413);
  expect(tooLarge.contentType).toMatch(/application\/json/);
  expect(tooLarge.body.error).toEqual({ code: -32600, message: "Request body exceeds the 4 MB limit" });
});

test("a CSV at the character limit fits even when every character takes 3 bytes", async () => {
  const { GEO_CSV_IMPORT_MAX_LENGTH } = await import("../src/constants/geo.ts");
  const csv = "prompt\n" + "最".repeat(GEO_CSV_IMPORT_MAX_LENGTH - 7);
  expect(csv.length).toBe(GEO_CSV_IMPORT_MAX_LENGTH);
  expect(Buffer.byteLength(csv)).toBeGreaterThan(3_000_000);
  const result = await modern("tools/call", { name: "import_geo_prompts", arguments: { projectId: "p1", csv } });
  expect(result.status).toBe(200);
  expect(result.body.result.isError).toBeUndefined();
  expect(state.upstream.requests.at(-1).bytes).toBeGreaterThan(3_000_000);
});

test("an unknown tool on the modern path gets a clean not-found without touching upstream", async () => {
  const before = state.upstream.requests.length;
  const { status, body } = await modern("tools/call", { name: "does_not_exist", arguments: {} });
  expect(status).toBe(200);
  expect(body.error?.code).toBe(-32602);
  expect(body.error?.message).toContain("Tool does_not_exist not found");
  expect(state.upstream.requests.length).toBe(before);
});

test("an MCP client disconnect cancels the in-flight post request upstream", async () => {
  const controller = new AbortController();
  const call = modern(
    "tools/call",
    { name: "get_post", arguments: { postId: "wait-for-disconnect" } },
    { signal: controller.signal },
  );
  await vi.waitFor(() =>
    expect(state.upstream.requests.some((request) => request.url === "/v1/posts/wait-for-disconnect")).toBe(true),
  );
  controller.abort();
  await expect(call).rejects.toThrow();
  await vi.waitFor(() =>
    expect(state.upstream.disconnects.map((entry) => entry.url)).toContain("/v1/posts/wait-for-disconnect"),
  );
});

test("modern requests forward the selected workspace for API keys but not OAuth tokens", async () => {
  const call = (options) =>
    modern("tools/call", { name: "import_geo_prompts", arguments: { projectId: "p1", csv: "prompt" } }, options);
  await call({ headers: { "x-notra-organization-id": "org-b" } });
  expect(state.upstream.requests.at(-1).organizationId).toBe("org-b");
  await call({ headers: { "x-organization-id": "org-c" } });
  expect(state.upstream.requests.at(-1).organizationId).toBe("org-c");
  await call();
  expect(state.upstream.requests.at(-1).organizationId).toBeUndefined();
  await call({ token: "oauth-token", headers: { "x-notra-organization-id": "org-b" } });
  expect(state.upstream.requests.at(-1).organizationId).toBeUndefined();
});

test("the workspace-scoped URL forwards its workspace, wins over the header, and hides list_workspaces", async () => {
  await modern(
    "tools/call",
    { name: "import_geo_prompts", arguments: { projectId: "p1", csv: "prompt" } },
    { path: "/acme", headers: { "x-notra-organization-id": "org-b" } },
  );
  expect(state.upstream.requests.at(-1).organizationId).toBe("acme");

  const scoped = await modern("tools/list", {}, { path: "/acme" });
  expect(toolNames(scoped.body)).toContain("whoami");
  expect(toolNames(scoped.body)).not.toContain("list_workspaces");
  expect(toolNames((await modern("tools/list")).body)).toContain("list_workspaces");
  const hidden = await modern("tools/call", { name: "list_workspaces", arguments: {} }, { path: "/acme" });
  expect(hidden.body.error?.message).toContain("Tool list_workspaces not found");
  expect((await modern("tools/list", {}, { path: "/a%20b" })).status).toBe(404);
});

test("removed executors cannot reach the upstream API and credential fields are dropped", async () => {
  const before = state.upstream.requests.length;
  for (const name of [
    "list_chats",
    "get_chat",
    "get_chat_by_external_channel",
    "list_agent_chats",
    "create_chat",
    "post_chat_message",
    "respond_to_chat_approvals",
    "create_webhook_endpoint",
    "issue_geo_ingest_token",
    "rotate_geo_ingest_token",
  ]) {
    const { body } = await modern("tools/call", { name, arguments: {} });
    expect(body.error?.code).toBe(-32602);
  }
  const { body } = await modern("tools/call", {
    name: "create_github_integration",
    arguments: { owner: "example", repo: "public", token: "must-not-be-forwarded" },
  });
  expect(body.error).toBeUndefined();
  expect(state.upstream.requests.length).toBe(before + 1);
  expect(JSON.parse(state.upstream.requests.at(-1).body)).toEqual({ owner: "example", repo: "public" });
});
