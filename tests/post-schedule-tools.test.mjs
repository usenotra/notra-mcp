import { beforeEach, expect, test, vi } from "vitest";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { NotraClient } from "../src/notra-client.ts";
import { createServer } from "../src/server.ts";
import { postScheduleParamsSchema, schedulePostSchema } from "../src/schemas/post-schedule.ts";
import { parseToolsets } from "../src/utils/toolsets.ts";

const organization = { id: "org-1", slug: "org", name: "Org", logo: null };
const schedule = {
  postId: "post-1",
  scheduledAt: "2026-11-01T09:00:00Z",
  timeZone: "Europe/Berlin",
  publications: [
    { destination: "notra" },
    { destination: "github", repositoryId: "repo-1", merge: false },
    { destination: "social", accountId: "account-1" },
  ].map((config) => ({
    id: `publication-${config.destination}`,
    destination: config.destination,
    config,
    status: "scheduled",
    scheduledAt: "2026-11-01T09:00:00Z",
    timeZone: "Europe/Berlin",
    attempts: 0,
    errorCode: null,
    lastError: null,
    resultUrl: null,
    publishedAt: null,
  })),
};
const meta = {
  "io.modelcontextprotocol/protocolVersion": "2026-07-28",
  "io.modelcontextprotocol/clientCapabilities": {},
};

beforeEach(() => {
  vi.stubEnv("POSTHOG_PROJECT_TOKEN", "");
});

async function call(name, args, options = { onlyTool: name }) {
  const handler = createMcpHandler(() => createServer("test-token", options), { legacy: "reject" });
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

test("publishing schedule tools route GET, POST and DELETE through the actual MCP dispatcher", async () => {
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async (_url, options) =>
      Response.json(
        options.method === "DELETE"
          ? { organization, canceled: 1, inProgress: true }
          : { organization, schedule: options.method === "POST" ? schedule : null },
      ),
    );
  const body = {
    scheduledAt: "2026-11-01T10:00:00+01:00",
    timeZone: "Europe/Berlin",
    destinations: [
      { destination: "github", repositoryId: "repo-1", merge: false },
      { destination: "social", accountId: "account-1" },
    ],
  };

  const read = await call("get_post_schedule", { postId: "post-1" });
  const write = await call("schedule_post", { postId: "post-1", ...body });
  const cancel = await call("cancel_post_schedule", { postId: "post-1" });

  expect(read.result.structuredContent).toEqual({ organization, schedule: null });
  expect(write.result.structuredContent).toEqual({ organization, schedule });
  expect(cancel.result.structuredContent).toEqual({ organization, canceled: 1, inProgress: true });
  expect(fetch.mock.calls.map(([url, options]) => [new URL(url).pathname, options.method])).toEqual([
    ["/v1/posts/post-1/schedule", "GET"],
    ["/v1/posts/post-1/schedule", "POST"],
    ["/v1/posts/post-1/schedule", "DELETE"],
  ]);
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual(body);
  expect(fetch.mock.calls[0][1].body).toBeUndefined();
  expect(fetch.mock.calls[2][1].body).toBeUndefined();
  expect(fetch.mock.calls.every(([, options]) => options.headers.Authorization === "Bearer test-token")).toBe(true);
});

test("Notra-only scheduling omits external destinations and leaves defaults to the API", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ organization, schedule }));
  const result = await call("schedule_post", { postId: "post-1", scheduledAt: schedule.scheduledAt });
  expect(result.result.isError).toBeUndefined();
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ scheduledAt: schedule.scheduledAt });
});

test("invalid timestamps and destination configurations are rejected before reaching the API", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");
  const valid = { postId: "post-1", scheduledAt: schedule.scheduledAt };
  for (const invalid of [
    { ...valid, scheduledAt: "next week" },
    { ...valid, scheduledAt: "2026-11-01T09:00:00" },
    { ...valid, postId: "post/../../other" },
    { ...valid, destinations: [{ destination: "github" }] },
    { ...valid, destinations: [{ destination: "social" }] },
    { ...valid, destinations: [{ destination: "notra" }] },
    { ...valid, destinations: Array.from({ length: 3 }, () => ({ destination: "social", accountId: "account-1" })) },
  ]) {
    expect(schedulePostSchema.safeParse(invalid).success).toBe(false);
    const result = await call("schedule_post", invalid);
    expect(result.result.isError).toBe(true);
  }
  expect(postScheduleParamsSchema.safeParse({ postId: "" }).success).toBe(false);
  expect(fetch).not.toHaveBeenCalled();
});

test("upstream publishing conflicts stay MCP tool errors and GEO-only servers do not expose scheduling", async () => {
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(() => Promise.resolve(Response.json({ error: "Post is already publishing" }, { status: 409 })));
  const result = await call("schedule_post", { postId: "post-1", scheduledAt: schedule.scheduledAt });
  expect(result.result.isError).toBe(true);
  expect(result.result.content[0].text).toBe("Post is already publishing");
  const filtered = await call("get_post_schedule", { postId: "post-1" }, { toolsets: parseToolsets("geo") });
  expect(filtered.error.code).toBe(-32602);
  expect(fetch).toHaveBeenCalledOnce();
});

test("client scheduling methods encode post IDs independently of tool validation", async () => {
  const fetch = vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(() => Promise.resolve(Response.json({ organization, schedule: null })));
  const client = new NotraClient("test-token", "https://api.example.test");
  await client.getPostSchedule("post/with space");
  expect(new URL(fetch.mock.calls[0][0]).pathname).toBe("/v1/posts/post%2Fwith%20space/schedule");
});
