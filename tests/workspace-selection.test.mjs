import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import { after, before, test } from "node:test";

const SELECTION_REQUIRED =
  "Organization selection required: send X-Notra-Organization-Id for the workspace this request should act on";
const ACCOUNT_KEY = "account-key";
const ORGANIZATION_KEY = "organization-key";
const PERSONAL = { id: "ws_personal", slug: "personal", name: "Personal", logo: null };
const BREW = { id: "ws_brew", slug: "brew", name: "Brew", logo: null };
const HOPLITE = { id: "ws_hoplite", slug: "hoplite", name: "Hoplite", logo: null };

let upstream;
let server;
let url;
let nextId = 1;

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" }).end(JSON.stringify(body));
}

/** Mirrors how the Notra API picks the workspace an API key acts on. */
function serveNotraApi(req, res) {
  const target = new URL(req.url, "http://api.test");
  const token = req.headers.authorization?.replace(/^Bearer /, "");
  const requested = req.headers["x-notra-organization-id"];
  if (requested === "flaky") {
    return json(res, 503, { error: "Authentication service unavailable" });
  }
  const memberships = token === ORGANIZATION_KEY ? [BREW] : [PERSONAL, BREW];
  const selected = requested
    ? memberships.find((workspace) => workspace.id === requested || workspace.slug === requested)
    : undefined;
  if (requested && !selected) {
    return json(res, 403, {
      error:
        token === ORGANIZATION_KEY
          ? "This API key belongs to a different workspace than X-Notra-Organization-Id names"
          : "Workspace access revoked",
    });
  }

  if (target.pathname === "/v1/me/workspaces") {
    // Discovery is unscoped: without a selection it falls back to the oldest membership.
    const current = selected ?? memberships[0];
    const workspaces = memberships.map((workspace) => ({
      ...workspace,
      role: token === ORGANIZATION_KEY ? null : "admin",
      status: "active",
      isCurrent: workspace.id === current.id,
    }));
    if (token === ACCOUNT_KEY && target.searchParams.get("includePending") === "true") {
      workspaces.push({ ...HOPLITE, role: "member", status: "pending", isCurrent: false });
    }
    return json(res, 200, { currentWorkspace: current, workspaces, authentication: { type: "apiKey" } });
  }

  if (!selected && memberships.length > 1) {
    return json(res, 403, { error: SELECTION_REQUIRED });
  }
  return json(res, 404, { error: "Not found" });
}

before(async () => {
  upstream = createHttpServer(serveNotraApi).listen(0, "127.0.0.1");
  await once(upstream, "listening");
  process.env.NOTRA_API_BASE = `http://127.0.0.1:${upstream.address().port}`;
  delete process.env.NOTRA_MCP_TOOLSETS;

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

async function rpc(method, params, { token = ACCOUNT_KEY, workspace } = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(workspace ? { "X-Notra-Organization-Id": workspace } : {}),
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2025-06-18",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }),
    signal: AbortSignal.timeout(5_000),
  });
  const text = await response.text();
  assert.equal(response.status, 200, text);
  const payload = response.headers.get("content-type")?.includes("text/event-stream")
    ? text
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5))
        .join("")
    : text;
  return JSON.parse(payload).result;
}

const callTool = (name, options) => rpc("tools/call", { name, arguments: {} }, options);

test("whoami shows no workspace while an account key has selected none", async () => {
  const result = await callTool("whoami");
  assert.notEqual(result.isError, true);
  assert.deepEqual(result.structuredContent, {
    workspace: null,
    selectionRequired: true,
    authentication: { type: "apiKey" },
  });
});

test("whoami shows the workspace the header selects, by slug or id", async () => {
  for (const options of [{ workspace: "brew" }, { workspace: BREW.id }]) {
    const { structuredContent } = await callTool("whoami", options);
    assert.deepEqual(structuredContent.workspace, BREW);
    assert.equal(structuredContent.selectionRequired, false);
  }
});

test("organization keys never need a selection", async () => {
  const { structuredContent } = await callTool("whoami", { token: ORGANIZATION_KEY });
  assert.deepEqual(structuredContent.workspace, BREW);
  assert.equal(structuredContent.selectionRequired, false);
});

test("list_workspaces marks nothing current while no workspace is selected", async () => {
  const { structuredContent } = await callTool("list_workspaces");
  assert.equal(structuredContent.currentWorkspace, null);
  assert.equal(structuredContent.selectionRequired, true);
  assert.deepEqual(
    structuredContent.workspaces.map(({ slug, status, isCurrent }) => [slug, status, isCurrent]),
    [
      ["personal", "active", false],
      ["brew", "active", false],
      ["hoplite", "pending", false],
    ],
  );
});

test("list_workspaces marks the selected workspace current", async () => {
  const { structuredContent } = await callTool("list_workspaces", { workspace: "brew" });
  assert.deepEqual(structuredContent.currentWorkspace, BREW);
  assert.equal(structuredContent.selectionRequired, false);
  assert.deepEqual(
    structuredContent.workspaces.filter((workspace) => workspace.isCurrent).map((workspace) => workspace.slug),
    ["brew"],
  );
});

test("list_workspaces does not present the API's fallback as current for a stale selection", async () => {
  const { structuredContent } = await callTool("list_workspaces", { workspace: "gone" });
  assert.equal(structuredContent.currentWorkspace, null);
  assert.equal(structuredContent.selectionRequired, true);
  assert.ok(structuredContent.workspaces.every((workspace) => !workspace.isCurrent));
});

test("an organization key naming another workspace has no current workspace either", async () => {
  const { structuredContent } = await callTool("list_workspaces", { token: ORGANIZATION_KEY, workspace: "personal" });
  assert.equal(structuredContent.currentWorkspace, null);
  assert.equal(structuredContent.selectionRequired, true);
  assert.deepEqual(
    structuredContent.workspaces.map(({ slug, isCurrent }) => [slug, isCurrent]),
    [["brew", false]],
  );
});

test("a failure that says nothing about the selection is returned, not reported as a missing selection", async () => {
  const result = await callTool("list_workspaces", { workspace: "flaky" });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /Authentication service unavailable \(HTTP 503\)/);
});

test("a workspace tool without a selection names the workspaces and how to pick one", async () => {
  const result = await callTool("list_sites");
  assert.equal(result.isError, true);
  const [{ text }] = result.content;
  assert.match(text, /this account API key can act in 2 workspaces: Personal \(personal\), Brew \(brew\)\./);
  assert.match(text, /https:\/\/mcp\.usenotra\.com\/mcp\/<slug>/);
  assert.match(text, /X-Notra-Organization-Id/);
  assert.doesNotMatch(text, /hoplite/i, "pending invitations can't be selected");
});

test("the selection error caps the named workspaces and falls back to list_workspaces", async () => {
  const { describeOrganizationError } = await import("../build/utils/organization.js");
  const auth = { kind: "apiKey", token: ACCOUNT_KEY };
  const many = Array.from({ length: 12 }, (_, index) => ({
    id: `ws_${index}`,
    slug: `team-${index}`,
    name: `Team ${index}`,
    logo: null,
  }));

  const capped = describeOrganizationError(SELECTION_REQUIRED, auth, many);
  assert.match(capped, /can act in 12 workspaces: Team 0 \(team-0\),.*Team 9 \(team-9\) and 2 more/);
  assert.doesNotMatch(capped, /team-10/);

  const unknown = describeOrganizationError(SELECTION_REQUIRED, auth);
  assert.match(unknown, /more than one workspace\. Call `list_workspaces` for their slugs\./);

  const oauth = { kind: "oauth", token: "t", userId: "u", organizationId: "ws_personal", scopes: [] };
  assert.equal(describeOrganizationError(SELECTION_REQUIRED, oauth, many), SELECTION_REQUIRED);
});

test("create_post and update_post advertise the same limits", async () => {
  const { tools } = await rpc("tools/list", undefined, { workspace: "brew" });
  const schema = (name) => tools.find((tool) => tool.name === name).inputSchema.properties;
  const create = schema("create_post");
  const update = schema("update_post");

  assert.equal(create.title.maxLength, 120);
  assert.equal(create.title.maxLength, update.title.maxLength);
  assert.equal(create.markdown.maxLength, 100_000);
  assert.equal(create.markdown.maxLength, update.markdown.maxLength);
  // Both slugs are nullable, so the limit sits on the string branch.
  const slugMax = (property) => property.anyOf.find((branch) => branch.type === "string").maxLength;
  assert.equal(slugMax(create.slug), 160);
  assert.equal(slugMax(create.slug), slugMax(update.slug));
});

test("post schemas trim titles and reject what the API would reject", async () => {
  const { createPostSchema, updatePostSchema } = await import("../build/schemas/post.js");
  const base = { title: "Ship notes", contentType: "blog_post" };

  assert.ok(createPostSchema.safeParse({ ...base, title: "x".repeat(120) }).success);
  assert.ok(!createPostSchema.safeParse({ ...base, title: "x".repeat(121) }).success);
  assert.ok(!createPostSchema.safeParse({ ...base, markdown: "x".repeat(100_001) }).success);
  assert.ok(!createPostSchema.safeParse({ ...base, slug: "x".repeat(161) }).success);

  const update = updatePostSchema.parse({ postId: "post_1", title: `  ${"x".repeat(120)}  `, slug: " ship-notes " });
  assert.equal(update.title, "x".repeat(120));
  assert.equal(update.slug, "ship-notes");
  assert.ok(!updatePostSchema.safeParse({ postId: "post_1", title: "x".repeat(121) }).success);
});
