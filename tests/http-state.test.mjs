import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { McpServer } from "@modelcontextprotocol/server";

const state = vi.hoisted(() => ({
  routes: new Map(),
  tools: new Map(),
  transports: [],
  middleware: [],
  appOptions: undefined,
}));

vi.mock("@modelcontextprotocol/express", () => ({
  createMcpExpressApp: (options) => {
    state.appOptions = options;
    return {
      get: (path, handler) => state.routes.set(`GET ${path}`, handler),
      post: (path, handler) => state.routes.set(`POST ${path}`, handler),
      delete: (path, handler) => state.routes.set(`DELETE ${path}`, handler),
      use: (handler) => state.middleware.push(handler),
      listen: () => ({ address: () => ({ port: 0 }) }),
    };
  },
}));
vi.mock("@modelcontextprotocol/node", () => ({
  NodeStreamableHTTPServerTransport: class {
    constructor(options) {
      this.options = options;
      this.handleRequest = vi.fn(async () => {
        if (!this.sessionId) {
          this.sessionId = options.sessionIdGenerator();
          options.onsessioninitialized(this.sessionId);
        }
      });
      this.close = vi.fn(async () => this.onclose?.());
      state.transports.push(this);
    }
  },
  toWebRequest: vi.fn(async (req) => req),
  toNodeHandler: vi.fn(),
}));
vi.mock("@modelcontextprotocol/server", async (importOriginal) => ({
  ...(await importOriginal()),
  isLegacyRequest: vi.fn(async () => true),
}));
vi.mock("../src/utils/auth.ts", async (importOriginal) => ({
  ...(await importOriginal()),
  authenticateBearerToken: vi.fn(),
}));

let authenticateBearerToken;

beforeEach(async () => {
  vi.resetModules();
  state.routes.clear();
  state.tools.clear();
  state.transports.length = 0;
  state.middleware.length = 0;
  vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
  vi.setSystemTime(new Date("2026-09-05T12:00:00Z"));
  vi.stubEnv("NOTRA_MCP_RESOURCE", "https://mcp.example.test");
  vi.stubEnv("WORKOS_AUTHKIT_DOMAIN", "auth.example.test");
  vi.spyOn(McpServer.prototype, "connect").mockResolvedValue(undefined);
  vi.spyOn(McpServer.prototype, "registerTool").mockImplementation((name, _config, handler) => {
    state.tools.set(name, handler);
  });
  vi.stubEnv("NOTRA_MCP_MAX_SESSIONS", "3");
  vi.stubEnv("NOTRA_MCP_MAX_SESSIONS_PER_PRINCIPAL", "2");
  ({ authenticateBearerToken } = await import("../src/utils/auth.ts"));
  authenticateBearerToken.mockReset();
  await import("../src/http.ts");
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

function response() {
  const res = { headersSent: false, setHeader: vi.fn(), on: vi.fn() };
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
}

function oauthIdentity(userId = "user-1") {
  return { kind: "oauth", token: "original", userId, organizationId: "org-1", scopes: ["posts.read"] };
}

async function postInitialize({ query = {}, userId } = {}) {
  authenticateBearerToken.mockResolvedValueOnce(oauthIdentity(userId));
  const res = response();
  await state.routes.get("POST /mcp")(
    {
      headers: { authorization: "Bearer original" },
      query,
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "1" } },
      },
    },
    res,
  );
  return res;
}

async function initializeSession(options) {
  const before = state.transports.length;
  await postInitialize(options);
  expect(state.transports).toHaveLength(before + 1);
  const transport = state.transports[before];
  transport.userId = options?.userId ?? "user-1";
  return transport;
}

async function sessionStatus(transport) {
  authenticateBearerToken.mockResolvedValueOnce(oauthIdentity(transport.userId));
  const res = response();
  await state.routes.get("GET /mcp")(
    { headers: { authorization: "Bearer original", "mcp-session-id": transport.sessionId } },
    res,
  );
  return res.status.mock.calls[0]?.[0] ?? 200;
}

test("OAuth refresh updates credentials used by subsequent JSON and chat requests", async () => {
  const transport = await initializeSession();
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json({ posts: [] }));
  await state.tools.get("list_posts")({});
  expect(fetch.mock.calls[0][1].headers.Authorization).toBe("Bearer original");
  authenticateBearerToken.mockResolvedValueOnce({
    kind: "oauth",
    token: "refreshed",
    userId: "user-1",
    organizationId: "org-1",
    scopes: ["posts.read", "chats.write"],
  });
  const res = response();
  await state.routes.get("POST /mcp")(
    { headers: { authorization: "Bearer refreshed", "mcp-session-id": transport.sessionId }, body: {} },
    res,
  );
  expect(res.status).not.toHaveBeenCalled();
  await state.tools.get("list_posts")({});
  await state.tools.get("create_chat")({ message: "Hello" });
  expect(fetch.mock.calls.slice(1).map(([, options]) => options.headers.Authorization)).toEqual([
    "Bearer refreshed",
    "Bearer refreshed",
  ]);
});

test.each([{ userId: "other-user" }, { organizationId: "other-org" }, { kind: "apiKey" }])(
  "OAuth refresh invalidates sessions when identity changes: %j",
  async (changed) => {
    const transport = await initializeSession();
    authenticateBearerToken.mockResolvedValueOnce({
      kind: "oauth",
      token: "changed",
      userId: "user-1",
      organizationId: "org-1",
      scopes: [],
      ...changed,
    });
    const res = response();
    await state.routes.get("POST /mcp")(
      { headers: { authorization: "Bearer changed", "mcp-session-id": transport.sessionId }, body: {} },
      res,
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(transport.handleRequest).toHaveBeenCalledTimes(1);
    // Invalidation must close the transport, not just drop it from the map.
    expect(transport.close).toHaveBeenCalled();
    const retry = response();
    await state.routes.get("GET /mcp")({ headers: { "mcp-session-id": transport.sessionId } }, retry);
    expect(retry.status).toHaveBeenCalledWith(401);
  },
);

test("failed token verification invalidates the session", async () => {
  const transport = await initializeSession();
  authenticateBearerToken.mockRejectedValueOnce(new Error("expired token"));
  const res = response();
  await state.routes.get("GET /mcp")(
    { headers: { authorization: "Bearer expired", "mcp-session-id": transport.sessionId } },
    res,
  );
  expect(res.status).toHaveBeenCalledWith(401);
  expect(transport.close).toHaveBeenCalled();
  const retry = response();
  await state.routes.get("GET /mcp")({ headers: { "mcp-session-id": transport.sessionId } }, retry);
  expect(retry.status).toHaveBeenCalledWith(401);
});

test("both protected resource discovery routes request only Connect-supported OAuth scopes", async () => {
  const scopes = ["openid", "offline_access"];
  for (const suffix of ["", "/mcp"]) {
    const res = response();
    await state.routes.get(`GET /.well-known/oauth-protected-resource${suffix}`)({}, res);
    expect(res.json).toHaveBeenCalledWith({
      resource: `https://mcp.example.test${suffix}`,
      authorization_servers: ["https://auth.example.test"],
      bearer_methods_supported: ["header"],
      scopes_supported: scopes,
    });
  }
});

test("discovery caches successful metadata and refreshes it after five minutes", async () => {
  const first = { issuer: "https://auth.example.test", authorization_endpoint: "https://auth.example.test/authorize" };
  const next = { ...first, authorization_endpoint: "https://auth.example.test/authorize-v2" };
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(Response.json(first))
    .mockResolvedValueOnce(Response.json(next));
  const handler = state.routes.get("GET /.well-known/oauth-authorization-server");
  const res = response();
  await handler({}, res);
  vi.setSystemTime(Date.now() + 299_999);
  await state.routes.get("GET /.well-known/oauth-authorization-server/mcp")({}, res);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(res.json).toHaveBeenLastCalledWith(first);
  vi.setSystemTime(Date.now() + 1);
  await handler({}, res);
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(res.json).toHaveBeenLastCalledWith(next);
});

test.each(["network", "http", "json"])(
  "discovery serves stale metadata after a %s failure and retries later",
  async (failure) => {
    const metadata = { issuer: "https://auth.example.test" };
    const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(Response.json(metadata));
    const handler = state.routes.get("GET /.well-known/oauth-authorization-server");
    await handler({}, response());
    vi.setSystemTime(Date.now() + 300_000);
    if (failure === "network") fetch.mockRejectedValueOnce(new Error("offline"));
    else fetch.mockResolvedValueOnce(new Response("not json", { status: failure === "http" ? 503 : 200 }));
    const stale = response();
    await handler({}, stale);
    expect(stale.json).toHaveBeenCalledWith(metadata);
    expect(stale.status).not.toHaveBeenCalled();
    fetch.mockResolvedValueOnce(Response.json({ ...metadata, refreshed: true }));
    const recovered = response();
    await handler({}, recovered);
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(recovered.json).toHaveBeenCalledWith({ ...metadata, refreshed: true });
  },
);

test("discovery returns 502 when the first fetch fails and no cache exists", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
  const res = response();
  await state.routes.get("GET /.well-known/oauth-authorization-server")({}, res);
  expect(res.status).toHaveBeenCalledWith(502);
  expect(res.json).toHaveBeenCalledWith({ error: "authorization_server_metadata_unavailable" });
});

test("JSON body limit leaves room for 1 MB CSV imports", async () => {
  const { GEO_CSV_IMPORT_MAX_LENGTH } = await import("../src/constants/geo.ts");
  expect(Number(state.appOptions.jsonLimit)).toBeGreaterThanOrEqual(GEO_CSV_IMPORT_MAX_LENGTH * 2);
});

test("oversized and malformed bodies are answered as JSON-RPC errors", () => {
  const [errorHandler] = state.middleware;
  const tooLarge = response();
  errorHandler({ status: 413, type: "entity.too.large" }, {}, tooLarge, vi.fn());
  expect(tooLarge.status).toHaveBeenCalledWith(413);
  expect(tooLarge.json).toHaveBeenCalledWith({
    jsonrpc: "2.0",
    error: { code: -32600, message: "Request body exceeds the 4 MB limit" },
    id: null,
  });
  const malformed = response();
  errorHandler({ status: 400, type: "entity.parse.failed" }, {}, malformed, vi.fn());
  expect(malformed.json.mock.calls[0][0].error.code).toBe(-32700);
  const unsupported = response();
  errorHandler({ status: 415, type: "encoding.unsupported" }, {}, unsupported, vi.fn());
  expect(unsupported.json.mock.calls[0][0].error).toEqual({ code: -32600, message: "Invalid request body" });
  const next = vi.fn();
  const unexpected = new Error("boom");
  errorHandler(unexpected, {}, response(), next);
  expect(next).toHaveBeenCalledWith(unexpected);
});

test("a principal at its session quota evicts only its own least recently used session", async () => {
  const first = await initializeSession();
  const second = await initializeSession();
  // Touch the oldest session so the second one becomes least recently used.
  expect(await sessionStatus(first)).toBe(200);
  const third = await initializeSession();
  expect(second.close).toHaveBeenCalledTimes(1);
  expect(await sessionStatus(second)).toBe(401);
  for (const transport of [first, third]) {
    expect(transport.close).not.toHaveBeenCalled();
    expect(await sessionStatus(transport)).toBe(200);
  }
});

test("a failed initialization never evicts the principal's existing sessions", async () => {
  const first = await initializeSession();
  const second = await initializeSession();
  // The principal is at its quota, but the replacement fails to connect, so
  // both existing sessions must survive untouched.
  vi.mocked(McpServer.prototype.connect).mockRejectedValueOnce(new Error("connect failed"));
  const rejected = await postInitialize();
  expect(rejected.status).toHaveBeenCalledWith(500);
  for (const transport of [first, second]) {
    expect(transport.close).not.toHaveBeenCalled();
    expect(await sessionStatus(transport)).toBe(200);
  }
  // The next successful initialization still rotates out the LRU session.
  const third = await initializeSession();
  expect(first.close).toHaveBeenCalledTimes(1);
  expect(await sessionStatus(first)).toBe(401);
  for (const transport of [second, third]) {
    expect(transport.close).not.toHaveBeenCalled();
    expect(await sessionStatus(transport)).toBe(200);
  }
});

test("a full server rejects new sessions instead of evicting other principals", async () => {
  const victims = [await initializeSession(), await initializeSession(), await initializeSession({ userId: "user-2" })];
  const transports = state.transports.length;
  const rejected = await postInitialize({ userId: "attacker" });
  expect(rejected.status).toHaveBeenCalledWith(503);
  expect(rejected.setHeader).toHaveBeenCalledWith("Retry-After", "60");
  expect(rejected.json.mock.calls[0][0].error.message).toBe("Too many active sessions, try again later");
  expect(state.transports).toHaveLength(transports);
  for (const transport of victims) {
    expect(transport.close).not.toHaveBeenCalled();
    expect(await sessionStatus(transport)).toBe(200);
  }

  // A principal at its own quota can still rotate its sessions on a full server.
  const rotated = await initializeSession();
  expect(victims[0].close).toHaveBeenCalledTimes(1);
  expect(await sessionStatus(rotated)).toBe(200);
  expect(await sessionStatus(victims[2])).toBe(200);
});

test("an initialize that loses the global-cap race is closed instead of exceeding the cap", async () => {
  const first = await initializeSession();
  const second = await initializeSession();
  // A user-2 initialize passes admission with one free slot, but user-3 takes
  // that slot while user-2's server is still connecting.
  vi.mocked(McpServer.prototype.connect).mockImplementationOnce(async () => {
    await initializeSession({ userId: "user-3" });
  });
  const before = state.transports.length;
  await postInitialize({ userId: "user-2" });
  const raced = state.transports[before];
  // The raced session is closed instead of stored; the cap holds.
  expect(raced.close).toHaveBeenCalledTimes(1);
  for (const transport of [first, second, state.transports[before + 1]]) {
    expect(transport === raced).toBe(false);
    expect(await sessionStatus(transport)).toBe(200);
  }
  // A retry is now rejected cleanly at admission.
  const retry = await postInitialize({ userId: "user-2" });
  expect(retry.status).toHaveBeenCalledWith(503);
});

test("idle sessions are closed by a sweep that runs every minute", async () => {
  const transport = await initializeSession();
  vi.setSystemTime(Date.now() + 30 * 60 * 1000 + 1);
  vi.advanceTimersByTime(60 * 1000);
  expect(transport.close).toHaveBeenCalledTimes(1);
  expect(await sessionStatus(transport)).toBe(401);
});

test("unknown toolsets are rejected before a session is created", async () => {
  const res = response();
  await state.routes.get("POST /mcp")(
    {
      headers: { authorization: "Bearer original" },
      query: { toolsets: "content,nope" },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "1" } },
      },
    },
    res,
  );
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json.mock.calls[0][0].error.message).toMatch(/Unknown toolset: nope/);
  expect(state.transports).toHaveLength(0);
});

test("repeated toolsets query keys are combined and validated", async () => {
  await initializeSession({ query: { toolsets: ["content", "geo"] } });
  expect(state.tools.has("list_posts")).toBe(true);
  expect(state.tools.has("get_geo_snapshot")).toBe(true);
  const invalid = await postInitialize({ query: { toolsets: ["geo", "nope"] } });
  expect(invalid.status).toHaveBeenCalledWith(400);
  expect(invalid.json.mock.calls[0][0].error.message).toMatch(/Unknown toolset: nope/);
});

test("legacy sessions only register the requested toolsets", async () => {
  await initializeSession({ query: { toolsets: "content" } });
  expect(state.tools.has("list_posts")).toBe(true);
  expect(state.tools.has("get_geo_snapshot")).toBe(false);
  expect(state.tools.has("list_projects")).toBe(false);
  expect(state.tools.has("whoami")).toBe(true);
});

async function reloadHttp(env) {
  vi.resetModules();
  state.routes.clear();
  state.middleware.length = 0;
  for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
  ({ authenticateBearerToken } = await import("../src/utils/auth.ts"));
  await import("../src/http.ts");
}

test("sessions below the principal quota are never evicted", async () => {
  await reloadHttp({ NOTRA_MCP_MAX_SESSIONS: "10", NOTRA_MCP_MAX_SESSIONS_PER_PRINCIPAL: "4" });
  const sessions = [await initializeSession(), await initializeSession(), await initializeSession()];
  for (const transport of sessions) {
    expect(transport.close).not.toHaveBeenCalled();
  }
});

test.each(["-1", "0", "abc"])("invalid session caps (%s) fall back to the defaults", async (value) => {
  await reloadHttp({ NOTRA_MCP_MAX_SESSIONS: value, NOTRA_MCP_MAX_SESSIONS_PER_PRINCIPAL: value });
  const sessions = [];
  for (let i = 0; i < 5; i++) sessions.push(await initializeSession());
  for (const transport of sessions) {
    expect(transport.close).not.toHaveBeenCalled();
    expect(await sessionStatus(transport)).toBe(200);
  }
});
