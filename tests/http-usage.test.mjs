import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import { afterAll, beforeAll, beforeEach, expect, test, vi } from "vitest";

vi.mock("../src/utils/auth.ts", async (importOriginal) => ({
  ...(await importOriginal()),
  authenticateBearerToken: async (token) =>
    token.startsWith("oauth-")
      ? { kind: "oauth", token, userId: `user-${token.slice(6)}`, organizationId: "org-1", scopes: ["*"] }
      : { kind: "apiKey", token },
}));

const realFetch = globalThis.fetch;
const events = [];
const deliveries = [];
const upstreamRequests = [];
const meta = {
  "io.modelcontextprotocol/protocolVersion": "2026-07-28",
  "io.modelcontextprotocol/clientCapabilities": {},
  "io.modelcontextprotocol/clientInfo": { name: "claude-code", version: "2.1.3" },
};
let upstream;
let mcpUrl;
let upstreamStatus = 200;
let invalidOutput = false;

beforeAll(async () => {
  upstream = createHttpServer(async (req, res) => {
    for await (const _ of req) {
    }
    upstreamRequests.push(req.url);
    if (req.url === "/v1/chats") return;
    res.writeHead(upstreamStatus, { "content-type": "application/json" }).end(
      JSON.stringify(
        upstreamStatus !== 200
          ? { error: "private upstream error" }
          : invalidOutput
            ? {}
            : {
                imported: 1,
                updated: 0,
                skipped: 0,
                issues: [],
                organization: { id: "org-1", slug: "org", name: "Private Organization", logo: null },
              },
      ),
    );
  });
  upstream.listen(0, "127.0.0.1");
  await once(upstream, "listening");
  vi.stubEnv("PORT", "0");
  vi.stubEnv("NOTRA_API_BASE", `http://127.0.0.1:${upstream.address().port}`);
  vi.stubEnv("NOTRA_MCP_RESOURCE", "http://127.0.0.1");
  vi.stubEnv("WORKOS_AUTHKIT_DOMAIN", "auth.example.test");
  const listening = new Promise((resolve) => {
    vi.spyOn(console, "log").mockImplementation((message) => {
      const port = /listening on port (\d+)/.exec(String(message))?.[1];
      if (port) resolve(port);
    });
  });
  await import("../src/http.ts");
  mcpUrl = `http://127.0.0.1:${await listening}/mcp`;
});

beforeEach(() => {
  events.length = 0;
  deliveries.length = 0;
  upstreamRequests.length = 0;
  upstreamStatus = 200;
  invalidOutput = false;
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "test-project-token");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://posthog.example.test");
  vi.stubEnv("AXIOM_TOKEN", "test-ingest-token");
  vi.stubEnv("AXIOM_MCP_DATASET", "mcp-usage");
  vi.stubEnv("AXIOM_URL", "https://axiom.example.test");
  vi.spyOn(console, "log").mockImplementation((message) => events.push(JSON.parse(message)));
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input, options) => {
    const url = new URL(String(input));
    if (url.hostname.endsWith(".example.test")) {
      deliveries.push({ url: url.toString(), options, body: JSON.parse(options.body) });
      return Response.json({ ingested: 1 });
    }
    return realFetch(input, options);
  });
});

afterAll(async () => {
  const { flushMcpUsage } = await import("../src/utils/mcp-usage.ts");
  await flushMcpUsage();
  upstream.closeAllConnections();
  upstream.close();
});

async function post(body, headers = {}, signal) {
  const response = await realFetch(mcpUrl, {
    method: "POST",
    signal,
    headers: {
      authorization: "Bearer oauth-1",
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      ...headers,
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  const json = text.startsWith("{")
    ? text
    : text
        .split("\n")
        .find((line) => line.startsWith("data: "))
        ?.slice(6);
  return { status: response.status, headers: response.headers, body: json ? JSON.parse(json) : undefined };
}

function modern(
  name = "import_geo_prompts",
  args = { projectId: "p1", csv: "prompt\nprivate customer prompt" },
  options = {},
) {
  return post(
    { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args, _meta: meta } },
    { "mcp-protocol-version": "2026-07-28", "mcp-method": "tools/call", "mcp-name": name, ...options.headers },
    options.signal,
  );
}

test("modern tool calls emit one safe event and deliver it to both configured sinks", async () => {
  const result = await modern();
  expect(result.status).toBe(200);
  expect(result.body.result.isError).toBeUndefined();
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({
    event: "mcp_tool_called",
    transport: "http",
    tool_name: "import_geo_prompts",
    auth_kind: "oauth",
    organization_id: "org-1",
    user_id: "user-1",
    client_name: "claude-code",
    client_version: "2.1.3",
    protocol_version: "2026-07-28",
    outcome: "success",
  });
  expect(events[0].duration_ms).toBeGreaterThanOrEqual(0);
  expect(events[0].server_version).toBe("1.2.0");
  expect(Number.isNaN(Date.parse(events[0].timestamp))).toBe(false);
  expect(deliveries).toHaveLength(2);
  expect(deliveries[0].url).toBe("https://posthog.example.test/i/v0/e/");
  expect(deliveries[1].url).toBe("https://axiom.example.test/v1/datasets/mcp-usage/ingest");
  expect(deliveries[1].options.headers.Authorization).toBe("Bearer test-ingest-token");
  expect(deliveries[0].body).toMatchObject({
    event: "mcp_tool_called",
    distinct_id: "mcp:user:user-1",
    properties: { $groups: { organization: "org-1" }, $geoip_disable: true },
  });
  expect(deliveries[1].body[0]).toEqual({ _time: events[0].timestamp, ...events[0] });
  const serialized = JSON.stringify({ events, bodies: deliveries.map(({ body }) => body) });
  for (const secret of ["oauth-1", "private customer prompt", "Private Organization", "Authorization", "arguments"]) {
    expect(serialized).not.toContain(secret);
  }
});

test("legacy sessions retain initialized client identity and track calls, not initialization or discovery", async () => {
  const initialized = await post({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "Cursor", version: "1.2.3" } },
  });
  const headers = {
    "mcp-session-id": initialized.headers.get("mcp-session-id"),
    "mcp-protocol-version": "2025-03-26",
  };
  await post({ jsonrpc: "2.0", method: "notifications/initialized" }, headers);
  await post({ jsonrpc: "2.0", id: 2, method: "tools/list" }, headers);
  expect(events).toHaveLength(0);
  const result = await post(
    {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "import_geo_prompts", arguments: { projectId: "p1", csv: "prompt\nhello" } },
    },
    headers,
  );
  expect(result.body.result.isError).toBeUndefined();
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({ client_name: "cursor", client_version: "1.2.3", protocol_version: "2025-03-26" });
  await realFetch(mcpUrl, { method: "DELETE", headers: { authorization: "Bearer oauth-1", ...headers } });
});

test.each(["upstream", "input", "output", "unknown"])("%s errors are counted despite HTTP 200", async (failure) => {
  upstreamStatus = failure === "upstream" ? 500 : 200;
  invalidOutput = failure === "output";
  const result = await modern(
    failure === "unknown" ? "private-unknown-tool-name" : undefined,
    failure === "input" ? { projectId: "p1", csv: 42 } : undefined,
  );
  expect(result.status).toBe(200);
  expect(result.body.result?.isError || result.body.error).toBeTruthy();
  expect(events).toHaveLength(1);
  expect(events[0].outcome).toBe("error");
  expect(events[0].tool_name).toBe(failure === "unknown" ? "unknown" : "import_geo_prompts");
  expect(JSON.stringify(events)).not.toContain("private upstream error");
  expect(JSON.stringify(events)).not.toContain("private-unknown-tool-name");
});

test("API keys are never recorded or treated as identifiable users or workspaces", async () => {
  await modern(undefined, undefined, { headers: { authorization: "Bearer private-api-key" } });
  expect(events[0].auth_kind).toBe("apiKey");
  expect(events[0].user_id).toBeUndefined();
  expect(events[0].organization_id).toBeUndefined();
  expect(deliveries[0].body.distinct_id).toBe("mcp:api-key");
  expect(JSON.stringify(deliveries.map(({ body }) => body))).not.toContain("private-api-key");
});

test("client disconnects are recorded as cancelled calls", async () => {
  const controller = new AbortController();
  const call = modern("create_chat", { message: "private chat" }, { signal: controller.signal });
  await vi.waitFor(() => expect(upstreamRequests).toContain("/v1/chats"));
  controller.abort();
  await expect(call).rejects.toThrow();
  await vi.waitFor(() => expect(events).toHaveLength(1));
  expect(events[0]).toMatchObject({ tool_name: "create_chat", outcome: "cancelled" });
});

test("concurrent callers keep their own identity and emit exactly one event each", async () => {
  await Promise.all([modern(), modern(undefined, undefined, { headers: { authorization: "Bearer oauth-2" } })]);
  expect(events).toHaveLength(2);
  expect(events.map(({ user_id }) => user_id).sort()).toEqual(["user-1", "user-2"]);
});

test("unauthenticated requests are rejected without recording tool usage", async () => {
  const result = await modern(undefined, undefined, { headers: { authorization: "" } });
  expect(result.status).toBe(401);
  expect(events).toHaveLength(0);
  expect(deliveries).toHaveLength(0);
});
