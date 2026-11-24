import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import { after, before, test } from "node:test";

const organization = { id: "workspace-test", slug: "acme", name: "Acme", logo: null };
const thread = {
  id: "thread-1",
  quote: "A first draft is a guess",
  author: "Maya",
  body: "Could we open with an example?",
  leftOn: "preview",
  resolved: false,
  deleted: false,
  createdAt: "2026-11-22T09:00:00.000Z",
  replies: [],
};
const commented = {
  postId: "post-1",
  title: "Launch",
  openThreads: 1,
  lastCommentAt: "2026-11-22T09:00:00.000Z",
};
const preview = {
  previewKey: "post-post-1-abc",
  status: "queued",
  deleting: false,
  errorMessage: null,
  createdAt: "2026-11-22T09:01:00.000Z",
  live: false,
  latestLive: false,
  lifetime: "7d",
  expiresAt: "2026-11-29T09:01:00.000Z",
  hasPassword: false,
  siteVisibility: "protected",
  pagePath: "/blog/launch",
  url: "https://post-post-1-abc--acme.notra.site/blog/launch",
  reviewUrl: "https://app.usenotra.com/sites/preview-access?site=site-1&preview=post-post-1-abc&next=%2Fblog%2Flaunch",
};
const bearer = "Bearer test-account-key";
const requests = [];
let upstream;
let server;
let url;
let nextId = 1;

before(async () => {
  upstream = createHttpServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    const route = `${req.method} ${req.url}`;
    requests.push({ route, body: body ? JSON.parse(body) : undefined });
    const routes = {
      "GET /v1/post-comments": [200, { posts: [commented], hasMore: false, total: 1, organization }],
      "GET /v1/post-comments?page=2": [200, { posts: [], hasMore: false, total: 1, organization }],
      "GET /v1/post-comments?link=https%3A%2F%2Fpost-post-1-abc--acme.notra.site%2Fblog%2Flaunch": [
        200,
        { posts: [commented], hasMore: false, total: 1, organization },
      ],
      "GET /v1/posts/post-1/comments": [200, { threads: [thread], openThreads: 1, organization }],
      "GET /v1/posts/post-1/comments?status=all": [200, { threads: [thread], openThreads: 1, organization }],
      "POST /v1/posts/post-1/comments/thread-1/replies": [201, { id: "reply-1" }],
      "POST /v1/posts/post-1/comments/resolve": [200, { resolved: ["thread-1"], skipped: [] }],
      "POST /v1/sites/site-1/post-previews": [202, { preview, organization }],
    };
    const [code, data] = routes[route] ?? [404, { error: "Not found" }];
    res.writeHead(code, { "Content-Type": "application/json" }).end(JSON.stringify(data));
  }).listen(0, "127.0.0.1");
  await once(upstream, "listening");
  process.env.NOTRA_API_BASE = `http://127.0.0.1:${upstream.address().port}`;
  delete process.env.NOTRA_MCP_TOOLSETS;
  process.env.WORKOS_AUTHKIT_DOMAIN = "comments-test.authkit.example";
  process.env.NOTRA_MCP_RESOURCE = "https://notra-mcp.example/mcp";

  const { createServer } = await import("../build/server.js");
  server = createServer();
  ({ url } = await server.listen(0, { host: "127.0.0.1" }));
});

after(async () => {
  try {
    await server?.close();
  } finally {
    if (upstream) await new Promise((resolve) => upstream.close(resolve));
  }
});

async function rpc(method, params) {
  const id = nextId++;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: bearer,
      "X-Notra-Organization-Id": organization.id,
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2025-06-18",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
    signal: AbortSignal.timeout(5_000),
  });
  const body = await response.text();
  assert.equal(response.status, 200, body);
  const messages = response.headers.get("content-type")?.includes("text/event-stream")
    ? body
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => JSON.parse(line.slice(5)))
    : [JSON.parse(body)];
  const reply = messages.find((message) => message.id === id);
  assert.ok(reply, body);
  return reply;
}

const callTool = (name, args = {}) => rpc("tools/call", { name, arguments: args });

test("lists the comment tools as content tools with output schemas", async () => {
  const { result } = await rpc("tools/list");
  const tools = result.tools.filter((tool) => tool.name.includes("comment"));
  assert.deepEqual(tools.map((tool) => tool.name).sort(), [
    "list_commented_posts",
    "list_post_comments",
    "reply_to_post_comment",
    "resolve_post_comments",
  ]);
  for (const tool of tools) {
    assert.equal(tool.outputSchema.type, "object");
    assert.equal(tool.annotations.readOnlyHint, tool.name.startsWith("list_"));
  }
  const preview = result.tools.find((tool) => tool.name === "preview_post_on_site");
  assert.ok(preview.inputSchema.properties.password, "preview tool takes a password");
  assert.match(preview.description, /list_post_comments/);
});

test("walks the review loop: find the post, read, answer, resolve, rebuild", async () => {
  const link = "https://post-post-1-abc--acme.notra.site/blog/launch";
  const steps = [
    [
      "list_commented_posts",
      { link },
      "GET /v1/post-comments?link=https%3A%2F%2Fpost-post-1-abc--acme.notra.site%2Fblog%2Flaunch",
      undefined,
    ],
    ["list_commented_posts", {}, "GET /v1/post-comments", undefined],
    ["list_commented_posts", { link: "  " }, "GET /v1/post-comments", undefined],
    ["list_commented_posts", { page: 2 }, "GET /v1/post-comments?page=2", undefined],
    ["list_post_comments", { postId: "post-1" }, "GET /v1/posts/post-1/comments", undefined],
    ["list_post_comments", { postId: "post-1", status: "all" }, "GET /v1/posts/post-1/comments?status=all", undefined],
    [
      "reply_to_post_comment",
      { postId: "post-1", threadId: "thread-1", body: "Added an example." },
      "POST /v1/posts/post-1/comments/thread-1/replies",
      { body: "Added an example." },
    ],
    [
      "resolve_post_comments",
      { postId: "post-1", threadIds: ["thread-1"] },
      "POST /v1/posts/post-1/comments/resolve",
      { threadIds: ["thread-1"] },
    ],
    [
      "preview_post_on_site",
      { siteId: "site-1", postId: "post-1" },
      "POST /v1/sites/site-1/post-previews",
      { postId: "post-1" },
    ],
  ];
  for (const [tool, args, route, body] of steps) {
    const reply = await callTool(tool, args);
    assert.ok(!reply.result?.isError, JSON.stringify(reply));
    assert.deepEqual(requests.at(-1), { route, body }, tool);
  }
});

test("rejects invalid input before calling the API", async () => {
  const before = requests.length;
  for (const [name, args] of [
    ["list_post_comments", {}],
    ["list_post_comments", { postId: "post-1", status: "everything" }],
    ["reply_to_post_comment", { postId: "post-1", threadId: "thread-1", body: "   " }],
    ["resolve_post_comments", { postId: "post-1", threadIds: [] }],
    ["preview_post_on_site", { siteId: "site-1", postId: "post-1", password: "short" }],
  ]) {
    const reply = await callTool(name, args);
    assert.ok(reply.error || reply.result?.isError, `${name} ${JSON.stringify(reply)}`);
  }
  assert.equal(requests.length, before);
});

test("list_posts includes drafts unless a status is given", async () => {
  await callTool("list_posts", {});
  assert.equal(requests.at(-1).route, "GET /v1/posts?status=draft%2Cpublished");
  await callTool("list_posts", { status: ["published"] });
  assert.equal(requests.at(-1).route, "GET /v1/posts?status=published");
});
