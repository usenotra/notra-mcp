import { beforeEach, expect, test, vi } from "vitest";
import { McpServer } from "@modelcontextprotocol/server";
import { USAGE_MAX_PENDING_DELIVERIES } from "../src/constants/usage.ts";
import { createServer } from "../src/server.ts";
import { flushMcpUsage, instrumentMcpUsage } from "../src/utils/mcp-usage.ts";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "");
  vi.stubEnv("AXIOM_TOKEN", "");
  vi.stubEnv("AXIOM_MCP_DATASET", "");
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

function harness(client = { name: "claude-code", version: "2.1.3" }) {
  const handlers = new Map();
  const protocol = {
    setRequestHandler: (method, handler) => handlers.set(method, handler),
    getClientVersion: () => client,
    getNegotiatedProtocolVersion: () => "2026-07-28",
  };
  instrumentMcpUsage(
    { server: protocol },
    { kind: "apiKey", token: "private-token" },
    "1.2.0",
    (name) => name === "known",
  );
  protocol.setRequestHandler("tools/call", async () => ({ content: [] }));
  return () =>
    handlers.get("tools/call")({ params: { name: "known" } }, { mcpReq: { signal: new AbortController().signal } });
}

test("without sink credentials only a structured hosted log is emitted", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  await harness()();
  expect(fetch).not.toHaveBeenCalled();
  expect(console.log).toHaveBeenCalledOnce();
  expect(JSON.parse(console.log.mock.calls[0][0])).toMatchObject({ event: "mcp_tool_called", outcome: "success" });
});

test("stdio servers do not install usage tracking even when collector credentials exist", async () => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "test-token");
  const registrations = vi.spyOn(McpServer.prototype, "registerTool");
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(Response.json({ error: "private error" }, { status: 500 }));
  const server = createServer("private-api-key");
  const handler = registrations.mock.calls.find(([name]) => name === "list_posts")[2];
  await handler({});
  expect(fetch).toHaveBeenCalledOnce();
  expect(console.log).not.toHaveBeenCalled();
  await server.close();
});

test("client-provided strings are bucketed rather than copied into events", async () => {
  await harness({ name: "private customer name", version: "private-token" })();
  const event = JSON.parse(console.log.mock.calls[0][0]);
  expect(event.client_name).toBe("other");
  expect(event.client_version).toBeUndefined();
  expect(JSON.stringify(event)).not.toContain("private");
});

test.each(["https://posthog.example.test", "http://posthog.example.test", "https://secret@posthog.example.test"])(
  "collector failures and invalid destinations cannot fail a tool call (%s)",
  async (host) => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "test-token");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", host);
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("private credentials and response"));
    await expect(harness()()).resolves.toEqual({ content: [] });
    await flushMcpUsage();
    expect(console.warn).toHaveBeenCalledWith("MCP usage PostHog delivery failed");
    expect(JSON.stringify(console.warn.mock.calls)).not.toContain("private");
    expect(fetch).toHaveBeenCalledTimes(host === "https://posthog.example.test" ? 1 : 0);
  },
);

test("collector HTTP errors report only their status", async () => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "test-token");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("private failure", { status: 503 }));
  await harness()();
  await flushMcpUsage();
  expect(console.warn).toHaveBeenCalledWith("MCP usage PostHog delivery failed: HTTP 503");
});

test("Axiom ingestion failures with HTTP 200 are reported without response contents", async () => {
  vi.stubEnv("AXIOM_TOKEN", "test-token");
  vi.stubEnv("AXIOM_MCP_DATASET", "mcp-usage");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json({ ingested: 0, failed: 1, failures: [{ error: "private ingestion details" }] }),
  );
  await harness()();
  await flushMcpUsage();
  expect(console.warn).toHaveBeenCalledWith("MCP usage Axiom delivery rejected event");
  expect(JSON.stringify(console.warn.mock.calls)).not.toContain("private");
});

test("slow collectors do not block tool results and pending requests stay bounded", async () => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "test-token");
  let release;
  const blocked = new Promise((resolve) => {
    release = resolve;
  });
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(() => blocked);
  const call = harness();
  try {
    await Promise.all(Array.from({ length: USAGE_MAX_PENDING_DELIVERIES + 2 }, () => call()));
    expect(fetch).toHaveBeenCalledTimes(USAGE_MAX_PENDING_DELIVERIES);
    expect(fetch.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
    expect(fetch.mock.calls[0][1].redirect).toBe("error");
    expect(console.warn).toHaveBeenCalledWith("MCP usage PostHog delivery dropped: pending delivery limit reached");
  } finally {
    release(new Response(null));
    await flushMcpUsage();
  }
});
