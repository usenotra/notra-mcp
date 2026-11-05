import { beforeEach, expect, test, vi } from "vitest";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { createServer } from "../src/server.ts";
import { parseToolsets } from "../src/utils/toolsets.ts";

const organization = { id: "org-1", slug: "org", name: "Org", logo: null };
const meta = {
  "io.modelcontextprotocol/protocolVersion": "2026-07-28",
  "io.modelcontextprotocol/clientCapabilities": {},
};
const intent = { intent: "Bill the customer for October", tool: "create_invoice", calls: 4, errors: 1 };
const analytics = {
  configured: true,
  server: { name: "billing", version: "1.2.0", protocolVersion: "2025-11-25" },
  totals: {
    requests: 120,
    previousRequests: 80,
    toolCalls: 90,
    previousToolCalls: 60,
    errors: 6,
    previousErrors: 2,
    sessions: 14,
    previousSessions: 9,
    users: 5,
    previousUsers: 4,
    p95Ms: 900,
    previousP95Ms: 700,
  },
  daily: [{ day: "2026-11-03", toolsCall: 90, resourcesRead: 10, promptsGet: 0, other: 20, errors: 6 }],
  tools: [
    {
      name: "create_invoice",
      description: "Create an invoice",
      calls: 40,
      errors: 6,
      users: 3,
      avgResponseBytes: 512,
      p50Ms: 300,
      p95Ms: 900,
      uiResource: "",
    },
  ],
  clients: [{ name: "claude-code", sessions: 10, requests: 100, errors: 6, lastSeenAt: "2026-11-03T10:00:00.000Z" }],
  errorRequests: [
    {
      capturedAt: "2026-11-03T10:00:00.000Z",
      clientName: "claude-code",
      clientVersion: "2.1.0",
      method: "tools/call",
      target: "create_invoice",
      status: "tool_error",
      errorCode: 0,
      errorMessage: "Customer not found",
      durationMs: 812,
      model: "claude-opus-4-5",
    },
  ],
  models: [{ name: "claude-opus-4-5", sessions: 10, calls: 90, errors: 6 }],
  intents: [intent],
  elicitations: [],
  uiRenders: [],
  catalog: { listedAt: "2026-11-03T09:00:00.000Z", unusedTools: [{ name: "refund_invoice", description: "Refund" }] },
  organization,
};
const toolDetail = {
  before: [{ tool: "find_customer", calls: 30, afterFailure: 2 }],
  after: [{ tool: "send_invoice", calls: 25, afterFailure: 0 }],
  failures: [
    {
      message: "Customer not found",
      clientName: "claude-code",
      status: "tool_error",
      errorCode: 0,
      calls: 6,
      lastSeenAt: "2026-11-03T10:00:00.000Z",
    },
  ],
  intents: [intent],
  organization,
};

beforeEach(() => {
  vi.stubEnv("POSTHOG_PROJECT_TOKEN", "");
});

async function call(name, args) {
  const handler = createMcpHandler(() => createServer("test-token", { onlyTool: name }), { legacy: "reject" });
  const response = await handler.fetch(
    new Request("https://mcp.example.test/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "mcp-protocol-version": "2026-07-28",
        "mcp-method": "tools/call",
        "mcp-name": name,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: { name, arguments: args, _meta: meta },
      }),
    }),
  );
  const text = await response.text();
  const json = text.startsWith("{")
    ? text
    : text
        .split("\n")
        .find((line) => line.startsWith("data: "))
        ?.slice(6);
  expect(response.status).toBe(200);
  return JSON.parse(json);
}

test("get_geo_mcp_analytics reads the project's MCP analytics through the dispatcher", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json(analytics));

  const result = await call("get_geo_mcp_analytics", { projectId: "project-1", days: 7 });

  const url = new URL(fetch.mock.calls[0][0]);
  expect(fetch.mock.calls[0][1].method).toBe("GET");
  expect(url.pathname).toBe("/v1/projects/project-1/geo/traffic/mcp");
  expect(url.searchParams.get("days")).toBe("7");
  expect(result.result.isError).toBeUndefined();
  expect(result.result.structuredContent).toEqual(analytics);
});

test("get_geo_mcp_tool_analytics encodes the tool name into the path", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json(toolDetail));

  const result = await call("get_geo_mcp_tool_analytics", {
    projectId: "project-1",
    toolName: "billing/create invoice",
    from: "2026-10-01",
    to: "2026-10-31",
  });

  const url = new URL(fetch.mock.calls[0][0]);
  expect(url.pathname).toBe("/v1/projects/project-1/geo/traffic/mcp/tools/billing%2Fcreate%20invoice");
  expect(url.searchParams.get("from")).toBe("2026-10-01");
  expect(url.searchParams.get("to")).toBe("2026-10-31");
  expect(result.result.isError).toBeUndefined();
  expect(result.result.structuredContent).toEqual(toolDetail);
});

test("MCP analytics tools are read-only GEO tools", () => {
  const registered = new Map();
  vi.spyOn(McpServer.prototype, "registerTool").mockImplementation(function (name, config) {
    registered.set(name, config);
    return { enabled: true };
  });
  createServer("test-token", { toolsets: parseToolsets("geo") });
  const geo = new Set(registered.keys());
  registered.clear();
  createServer("test-token", { toolsets: parseToolsets("content") });

  for (const name of ["get_geo_mcp_analytics", "get_geo_mcp_tool_analytics"]) {
    expect(geo.has(name)).toBe(true);
    expect(registered.has(name)).toBe(false);
  }
});
