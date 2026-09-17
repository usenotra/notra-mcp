import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { McpServer } from "@modelcontextprotocol/server";

const state = vi.hoisted(() => ({ routes: new Map(), tools: new Map(), transports: [] }));

vi.mock("@modelcontextprotocol/express", () => ({
  createMcpExpressApp: () => ({
    get: (path, handler) => state.routes.set(`GET ${path}`, handler),
    post: (path, handler) => state.routes.set(`POST ${path}`, handler),
    delete: (path, handler) => state.routes.set(`DELETE ${path}`, handler),
    listen: () => ({ address: () => ({ port: 0 }) }),
  }),
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
  vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
  vi.setSystemTime(new Date("2026-09-05T12:00:00Z"));
  vi.stubEnv("NOTRA_MCP_RESOURCE", "https://mcp.example.test");
  vi.stubEnv("WORKOS_AUTHKIT_DOMAIN", "auth.example.test");
  vi.spyOn(McpServer.prototype, "connect").mockResolvedValue(undefined);
  vi.spyOn(McpServer.prototype, "registerTool").mockImplementation((name, _config, handler) => {
    state.tools.set(name, handler);
  });
  ({ authenticateBearerToken } = await import("../src/utils/auth.ts"));
  authenticateBearerToken.mockReset();
  await import("../src/http.ts");
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

function response() {
  const res = { headersSent: false, setHeader: vi.fn() };
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
}

async function initializeSession() {
  authenticateBearerToken.mockResolvedValueOnce({
    kind: "oauth",
    token: "original",
    userId: "user-1",
    organizationId: "org-1",
    scopes: ["posts.read"],
  });
  await state.routes.get("POST /mcp")(
    {
      headers: { authorization: "Bearer original" },
      body: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "test", version: "1" } },
      },
    },
    response(),
  );
  expect(state.transports).toHaveLength(1);
  return state.transports[0];
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
  const retry = response();
  await state.routes.get("GET /mcp")({ headers: { "mcp-session-id": transport.sessionId } }, retry);
  expect(retry.status).toHaveBeenCalledWith(401);
});

test("both protected resource discovery routes include content, feedback, and GEO scopes", async () => {
  const resources = [
    "posts",
    "brand-identities",
    "integrations",
    "schedules",
    "event-triggers",
    "chats",
    "skills",
    "feedback",
    "projects",
    "geo-settings",
    "prompts",
    "competitors",
    "scans",
    "visibility",
    "briefs",
    "agent-readiness",
    "traffic",
  ];
  const scopes = ["offline_access", ...resources.flatMap((resource) => [`${resource}.read`, `${resource}.write`])];
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
