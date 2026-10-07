import { beforeEach, expect, test, vi } from "vitest";
import { McpServer } from "@modelcontextprotocol/server";
import { USAGE_MAX_PENDING_DELIVERIES } from "../src/constants/usage.ts";
import { createServer } from "../src/server.ts";
import { flushMcpUsage, instrumentMcpUsage } from "../src/utils/mcp-usage.ts";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "");
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

test("without a PostHog project token tracking is disabled with no usage-log fallback", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  await harness()();
  expect(fetch).not.toHaveBeenCalled();
  expect(console.log).not.toHaveBeenCalled();
});

test("stdio servers do not install usage tracking even when a PostHog token exists", async () => {
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
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "test-token");
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null));
  await harness({ name: "private customer name", version: "private-token" })();
  await flushMcpUsage();
  const event = JSON.parse(fetch.mock.calls[0][1].body).properties;
  expect(event.client_name).toBe("other");
  expect(event.client_version).toBeUndefined();
  expect(JSON.stringify(event)).not.toContain("private");
});

test.each(["https://posthog.example.test", "http://posthog.example.test", "https://secret@posthog.example.test"])(
  "PostHog failures and invalid destinations cannot fail a tool call (%s)",
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

test("PostHog HTTP errors report only their status", async () => {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "test-token");
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("private failure", { status: 503 }));
  await harness()();
  await flushMcpUsage();
  expect(console.warn).toHaveBeenCalledWith("MCP usage PostHog delivery failed: HTTP 503");
});

test("slow PostHog requests do not block tool results and pending requests stay bounded", async () => {
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
