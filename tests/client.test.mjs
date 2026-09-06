import assert from "node:assert/strict";
import { test, vi } from "vitest";
import { NotraClient } from "../src/notra-client.ts";
import { appendQueryParams } from "../src/utils/query-params.ts";

const client = new NotraClient("test-token", "https://api.example.test");

test("requests encode IDs and filters, send bearer auth, and serialize mutation bodies", async () => {
  const requests = [];
  vi.spyOn(globalThis, "fetch").mockImplementation(async (url, options) => {
    requests.push({ url: new URL(url), ...options });
    return Response.json({ post: { id: "post-1" } });
  });
  await client.listPosts({ status: ["draft", "published"], page: 2 });
  assert.equal(requests[0].url.pathname, "/v1/posts");
  assert.equal(requests[0].url.searchParams.get("status"), "draft,published");
  assert.equal(requests[0].url.searchParams.get("page"), "2");
  assert.equal(requests[0].headers.Authorization, "Bearer test-token");
  assert.equal(requests[0].body, undefined);
  await client.updatePost("a/b ?", { title: "Updated", slug: null });
  assert.equal(requests[1].url.pathname, "/v1/posts/a%2Fb%20%3F");
  assert.equal(requests[1].method, "PATCH");
  assert.deepEqual(JSON.parse(requests[1].body), { title: "Updated", slug: null });
  await client.getGeoTrafficLog("project/1", { visitorTypes: ["crawler", "ai_referral"], limit: 10 });
  assert.equal(requests[2].url.pathname, "/v1/projects/project%2F1/geo/traffic/log");
  assert.equal(requests[2].url.searchParams.get("visitorTypes"), "crawler,ai_referral");
});

test("API errors preserve useful messages and handle invalid JSON", async () => {
  for (const [body, status, expected] of [
    [{ message: "quota exhausted", error: "fallback" }, 403, "quota exhausted"],
    [{ error: "not allowed" }, 403, "not allowed"],
    [{ message: 42, error: "fallback" }, 400, "fallback"],
    [{}, 502, "HTTP 502: Bad Gateway"],
    ["upstream down", 502, "HTTP 502: Bad Gateway"],
    ["not json", 200, "Invalid JSON response from API"],
  ]) {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(typeof body === "string" ? body : JSON.stringify(body), {
          status,
          statusText: status === 502 ? "Bad Gateway" : "",
        }),
    );
    await assert.rejects(client.listPosts(), { message: expected });
  }
});

test("timeouts are translated during both fetch and response-body reads", async () => {
  const timeout = new DOMException("aborted", "TimeoutError");
  for (const bodyPhase of [false, true]) {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      if (!bodyPhase) throw timeout;
      return {
        json: async () => {
          throw timeout;
        },
        text: async () => {
          throw timeout;
        },
      };
    });
    await assert.rejects(client.listPosts(), /timed out after 30s/);
    await assert.rejects(client.createChat({ message: "hello" }), /timed out after 180s/);
    await assert.rejects(client.runGeoSequence("project", "sequence"), /timed out after 300s/);
  }
  const networkError = new Error("connection reset");
  vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
    throw networkError;
  });
  await assert.rejects(client.listPosts(), (error) => error === networkError);
});

test("chat replies prefer stream metadata and fall back to response headers", async () => {
  vi.spyOn(globalThis, "fetch").mockImplementation(
    async () =>
      new Response('data: {"type":"text-delta","delta":"Hi"}\ndata: {"messageMetadata":{"chatId":"stream-id"}}', {
        headers: { "x-chat-id": "header-id" },
      }),
  );
  assert.deepEqual(await client.createChat({ message: "hello" }), { text: "Hi", chatId: "stream-id" });
  vi.spyOn(globalThis, "fetch").mockImplementation(
    async () => new Response("plain reply", { headers: { "x-chat-id": "header-id" } }),
  );
  assert.deepEqual(await client.postChatMessage("chat", { message: "hello" }), {
    text: "plain reply",
    chatId: "header-id",
  });
});

test("chat errors use JSON messages, raw text, or HTTP status", async () => {
  for (const [body, expected] of [
    [JSON.stringify({ message: "blocked" }), "blocked"],
    [JSON.stringify({ error: "denied" }), "denied"],
    ["upstream unavailable", "upstream unavailable"],
    ["", "HTTP 503: Unavailable"],
  ]) {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response(body, { status: 503, statusText: "Unavailable" }),
    );
    await assert.rejects(client.createChat({ message: "hello" }), { message: expected });
  }
});

test("missing single-resource payloads produce useful not-found errors", async () => {
  vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json({}));
  await assert.rejects(client.getPost("missing"), /Post not found: missing/);
  await assert.rejects(client.getBrandIdentity("missing"), /Brand identity not found: missing/);
});

test("query serialization preserves false and zero and rejects unsupported values", () => {
  const url = new URL("https://example.test");
  appendQueryParams(url, { enabled: false, page: 0, names: ["a b", "c"], missing: undefined });
  assert.deepEqual(Object.fromEntries(url.searchParams), { enabled: "false", page: "0", names: "a b,c" });
  for (const value of [null, {}, [1], ["a", false]]) {
    assert.throws(() => appendQueryParams(url, { bad: value }), /Unsupported query parameter: bad/);
  }
});
