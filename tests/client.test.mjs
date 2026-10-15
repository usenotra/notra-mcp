import assert from "node:assert/strict";
import { expect, test, vi } from "vitest";
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
    await assert.rejects(client.runGeoSequence("project", "sequence"), /timed out after 300s/);
  }
  const networkError = new Error("connection reset");
  vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
    throw networkError;
  });
  await assert.rejects(client.listPosts(), (error) => error === networkError);
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

test("account API keys send the selected workspace on every request", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json({ posts: [] }));
  const accountClient = new NotraClient(
    { kind: "apiKey", token: "account-key", organizationId: "org_b" },
    "https://api.example.test",
  );
  await accountClient.listPosts();
  await accountClient.listSkills();
  expect(fetch.mock.calls.map(([, options]) => options.headers["X-Notra-Organization-Id"])).toEqual(["org_b", "org_b"]);
});

test("no workspace header is sent without a selection or for OAuth tokens", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json({ posts: [] }));
  await client.listPosts();
  await new NotraClient(
    { kind: "oauth", token: "jwt", userId: "user-1", organizationId: "org_a", scopes: [] },
    "https://api.example.test",
  ).listPosts();
  for (const [, options] of fetch.mock.calls) {
    expect(options.headers).not.toHaveProperty("X-Notra-Organization-Id");
  }
});

test("workspace selection errors for account API keys explain how to pick a workspace", async () => {
  const selectionRequired =
    "Organization selection required: send X-Notra-Organization-Id for the workspace this request should act on";
  vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    Response.json({ error: selectionRequired }, { status: 403 }),
  );
  await assert.rejects(client.listPosts(), /list_workspaces.*NOTRA_ORGANIZATION_ID.*X-Notra-Organization-Id/);
  await assert.rejects(client.listSkills(), /list_workspaces/);

  vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    Response.json({ error: "Workspace access revoked" }, { status: 403 }),
  );
  await assert.rejects(client.listPosts(), { message: "Workspace access revoked" });
  const selected = new NotraClient(
    { kind: "apiKey", token: "account-key", organizationId: "org_gone" },
    "https://api.example.test",
  );
  await assert.rejects(selected.listPosts(), /workspace "org_gone".*not a member/);
});
