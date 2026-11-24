import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import { after, before, test } from "node:test";
import { exportJWK, generateKeyPair, SignJWT } from "jose";

const status = {
  canManage: true,
  settings: {
    enabled: true,
    dailyBrief: false,
    briefHour: 9,
    timezone: "UTC",
    jobs: { links: true },
    repository: "example/docs",
    slackChannelName: null,
    reviewers: ["reviewer"],
    lastRunAt: null,
  },
  activeRuns: [
    { runId: "run-1", type: "autopilot", trigger: "manual", workflowKey: null, startedAt: "2026-11-20T09:00:00Z" },
    { runId: "workflow-run-1", type: "custom_workflow", workflowId: "workflow-1", status: "queued" },
  ],
  openFindings: [{ id: "finding-1", kind: "links", title: "Broken link", status: "suggested", pullRequestUrl: null }],
  workflows: [{ id: "workflow-1", name: "Check docs", enabled: true, schedule: null, lastRunAt: null }],
  rules: [{ id: "rule-1", text: "Prefer canonical URLs." }],
};
const finding = {
  id: "finding-1",
  kind: "links",
  status: "proposed",
  title: "Broken link",
  pullRequestUrl: "https://github.com/example/docs/pull/1",
  publishAt: null,
  createdAt: "2026-11-20T09:00:00.000Z",
  updatedAt: "2026-11-20T09:00:00.000Z",
  summary: "A docs link 404s",
  repository: "example/docs",
  pullRequestNumber: 1,
  branch: "notra/autopilot/links",
  headSha: "abc1234",
  postId: null,
  runId: "run-1",
  error: null,
  publishHoldReason: null,
  sourceUrl: null,
  keyword: null,
  competitors: [],
  confidence: null,
  openedAt: "2026-11-20T09:00:00.000Z",
  mergedAt: null,
  dismissedAt: null,
};
const run = {
  id: "run-1",
  trigger: "cron",
  status: "completed",
  workflowKey: null,
  headline: null,
  outcome: null,
  findings: 1,
  proposed: 1,
  failed: 0,
  insights: [],
  error: null,
  startedAt: "2026-11-20T09:00:00.000Z",
  finishedAt: "2026-11-20T09:05:00.000Z",
};
const pitch = {
  id: "pitch-1",
  status: "draft",
  stage: "drafted",
  page: { url: "https://example.com/best", domain: "example.com", title: "Best tools", publisher: "Example" },
  recipient: { name: "Liz", email: "liz@example.com" },
  subject: "your tools list",
  problem: null,
  sentAt: null,
  scheduledAt: null,
  followUpAt: null,
  followUpDue: false,
  lastActivityAt: "2026-11-20T09:00:00.000Z",
  replyCount: 0,
  later: false,
  deal: null,
  body: "Hi Liz",
  from: null,
  reason: "Cited without the brand",
  citedFor: [],
  competitorsListed: [],
  contactRoutes: [],
  suggestedSendAt: null,
  optedOut: false,
  thread: [],
};
const ruleId = `autopilot-rule-${"a".repeat(64)}`;
const findingAction = { status: "proposed" };
const manageRoutes = {
  "PATCH /v1/autopilot/settings": { success: true },
  "GET /v1/autopilot/findings?status=proposed&limit=5": { findings: [] },
  "GET /v1/autopilot/findings/finding-1": { finding },
  "POST /v1/autopilot/findings/finding-1/write": { status: "writing", runId: "run-2" },
  "POST /v1/autopilot/findings/finding-1/dismiss": { status: "dismissed", rule: "Never link to old docs" },
  "POST /v1/autopilot/findings/finding-1/merge": { status: "merged", pullRequestUrl: finding.pullRequestUrl },
  "POST /v1/autopilot/findings/finding-1/hold": findingAction,
  "POST /v1/autopilot/findings/finding-1/request-changes": findingAction,
  "POST /v1/autopilot/rules": { status: "added", ruleId },
  [`DELETE /v1/autopilot/rules/${ruleId}`]: { success: true },
  "PATCH /v1/autopilot/workflows/workflow-1": { enabled: false, warning: null },
  "DELETE /v1/autopilot/workflows/workflow-1": { deleted: true },
  "GET /v1/autopilot/runs?limit=3": { runs: [run] },
  "GET /v1/autopilot/runs/run-1": { run, events: [] },
  "GET /v1/autopilot/brief": { brief: null },
  "GET /v1/autopilot/outreach/pitches?status=draft&followUpDue=true": { pitches: [] },
  "GET /v1/autopilot/outreach/pitches/pitch-1": { pitch },
  "PATCH /v1/autopilot/outreach/pitches/pitch-1": { pitch },
  "POST /v1/autopilot/outreach/pitches/pitch-1/send": { pitch, scheduledAt: null },
  "POST /v1/autopilot/outreach/pitches/pitch-1/cancel": { pitch },
  "POST /v1/autopilot/outreach/pitches/pitch-1/mark-sent": { pitch },
  "POST /v1/autopilot/outreach/pitches/pitch-1/mark-listed": { pitch },
  "POST /v1/autopilot/outreach/pitches/pitch-1/later": { pitch },
  "DELETE /v1/autopilot/outreach/pitches/pitch-1/later": { pitch },
  "PATCH /v1/autopilot/outreach/pitches/pitch-1/details": { pitch },
  "DELETE /v1/autopilot/outreach/pitches/pitch-1": { deleted: true },
  "GET /v1/autopilot/outreach/mailbox": { mailbox: null, connectUrl: "https://app.example/connect" },
  "DELETE /v1/autopilot/outreach/mailbox": { disconnected: true },
};
const bearer = "Bearer test-account-key";
const workspace = "workspace-test";
const authkitDomain = "autopilot-test.authkit.example";
const resource = "https://notra-mcp.example/mcp";
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
    requests.push({
      route,
      authorization: req.headers.authorization,
      workspace: req.headers["x-notra-organization-id"],
      body: body ? JSON.parse(body) : undefined,
    });
    const routes = {
      "GET /v1/autopilot/status": [200, status],
      "POST /v1/autopilot/runs": [202, { runId: "run-1", alreadyRunning: false }],
      "POST /v1/autopilot/runs/run-1/stop": [200, { stopped: "autopilot" }],
      "POST /v1/autopilot/workflows/workflow-1/run": [202, { runId: "workflow-run-1" }],
      ...Object.fromEntries(Object.entries(manageRoutes).map(([key, data]) => [key, [200, data]])),
    };
    const [code, data] =
      req.headers.authorization === "Bearer test-read-only-key" && req.method !== "GET"
        ? [403, { error: "Missing required scope: autopilot.write" }]
        : (routes[route] ?? [404, { error: "Not found" }]);
    res.writeHead(code, { "Content-Type": "application/json" }).end(JSON.stringify(data));
  }).listen(0, "127.0.0.1");
  await once(upstream, "listening");
  process.env.NOTRA_API_BASE = `http://127.0.0.1:${upstream.address().port}`;
  delete process.env.NOTRA_MCP_TOOLSETS;
  process.env.WORKOS_AUTHKIT_DOMAIN = authkitDomain;
  process.env.NOTRA_MCP_RESOURCE = resource;

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

async function rpc(method, params, { toolsets, authorization = bearer } = {}) {
  const endpoint = new URL(url);
  if (toolsets) endpoint.searchParams.set("toolsets", toolsets);
  const id = nextId++;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "X-Notra-Organization-Id": workspace,
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

function callTool(name, args = {}, options) {
  return rpc("tools/call", { name, arguments: args }, options);
}

const READ_ONLY_TOOLS = [
  "get_autopilot_brief",
  "get_autopilot_finding",
  "get_autopilot_run",
  "get_autopilot_status",
  "get_outreach_mailbox",
  "get_outreach_pitch",
  "list_autopilot_findings",
  "list_autopilot_runs",
  "list_outreach_pitches",
];
const WRITE_TOOLS = [
  "add_autopilot_rule",
  "cancel_outreach_pitch",
  "delete_autopilot_rule",
  "delete_autopilot_workflow",
  "delete_outreach_pitch",
  "disconnect_outreach_mailbox",
  "dismiss_autopilot_finding",
  "edit_outreach_pitch",
  "hold_autopilot_finding",
  "mark_outreach_pitch_listed",
  "mark_outreach_pitch_sent",
  "merge_autopilot_finding",
  "request_autopilot_changes",
  "run_autopilot",
  "run_autopilot_workflow",
  "send_outreach_pitch",
  "set_autopilot_workflow_enabled",
  "set_outreach_pitch_later",
  "stop_autopilot_run",
  "update_autopilot_settings",
  "update_outreach_pitch_details",
  "write_autopilot_finding",
];
const isAutopilotTool = (name) => READ_ONLY_TOOLS.includes(name) || WRITE_TOOLS.includes(name);

test("discovers the Autopilot tools and enforces toolset filtering", async () => {
  const names = [...READ_ONLY_TOOLS, ...WRITE_TOOLS].sort();
  const defaults = await rpc("tools/list");
  const autopilot = await rpc("tools/list", undefined, { toolsets: "autopilot" });
  const geo = await rpc("tools/list", undefined, { toolsets: "geo" });

  for (const result of [defaults, autopilot]) {
    const tools = result.result.tools.filter((tool) => isAutopilotTool(tool.name));
    assert.deepEqual(tools.map((tool) => tool.name).sort(), names);
    for (const tool of tools) {
      assert.equal(tool.annotations.readOnlyHint, READ_ONLY_TOOLS.includes(tool.name), tool.name);
      assert.equal(tool.outputSchema.type, "object", tool.name);
      if (tool.annotations.destructiveHint) assert.match(tool.description, /explicit user confirmation/i, tool.name);
    }
  }
  assert.ok(autopilot.result.tools.some((tool) => tool.name === "whoami"));
  assert.ok(!autopilot.result.tools.some((tool) => tool.name === "list_posts"));
  assert.ok(!geo.result.tools.some((tool) => isAutopilotTool(tool.name)));
  const hidden = await callTool("get_autopilot_status", {}, { toolsets: "geo" });
  assert.equal(hidden.result.isError, true);
  assert.equal(requests.length, 0);
});

test("forwards status and run controls with the request's workspace and account key", async () => {
  const calls = [
    ["get_autopilot_status", {}, "GET /v1/autopilot/status", undefined, status],
    ["run_autopilot", {}, "POST /v1/autopilot/runs", {}, { runId: "run-1", alreadyRunning: false }],
    [
      "run_autopilot",
      { kind: "links" },
      "POST /v1/autopilot/runs",
      { kind: "links" },
      { runId: "run-1", alreadyRunning: false },
    ],
    [
      "stop_autopilot_run",
      { runId: "run-1" },
      "POST /v1/autopilot/runs/run-1/stop",
      undefined,
      { stopped: "autopilot" },
    ],
    [
      "run_autopilot_workflow",
      { workflowId: "workflow-1" },
      "POST /v1/autopilot/workflows/workflow-1/run",
      undefined,
      { runId: "workflow-run-1" },
    ],
  ];
  for (const [tool, args, route, body, expected] of calls) {
    const { result } = await callTool(tool, args);
    assert.deepEqual(result.structuredContent, expected, JSON.stringify(result));
    assert.deepEqual(JSON.parse(result.content[0].text), expected);
    assert.deepEqual(requests.at(-1), { route, body, authorization: bearer, workspace });
  }
});

test("forwards settings, findings, rules, workflows, runs, the brief and outreach", async () => {
  const calls = [
    [
      "update_autopilot_settings",
      { approvals: { posts: "auto" }, jobs: { refresh: false }, releaseFilters: { repositories: [] } },
      "PATCH /v1/autopilot/settings",
      { approvals: { posts: "auto" }, jobs: { refresh: false }, releaseFilters: { repositories: [] } },
    ],
    ["list_autopilot_findings", { status: "proposed", limit: 5 }, "GET /v1/autopilot/findings?status=proposed&limit=5"],
    ["get_autopilot_finding", { findingId: "finding-1" }, "GET /v1/autopilot/findings/finding-1"],
    ["write_autopilot_finding", { findingId: "finding-1" }, "POST /v1/autopilot/findings/finding-1/write"],
    [
      "dismiss_autopilot_finding",
      { findingId: "finding-1", reason: "Old docs" },
      "POST /v1/autopilot/findings/finding-1/dismiss",
      { reason: "Old docs" },
    ],
    [
      "merge_autopilot_finding",
      { findingId: "finding-1", headSha: "abc1234" },
      "POST /v1/autopilot/findings/finding-1/merge",
      { headSha: "abc1234" },
    ],
    ["hold_autopilot_finding", { findingId: "finding-1" }, "POST /v1/autopilot/findings/finding-1/hold"],
    [
      "request_autopilot_changes",
      { findingId: "finding-1", instruction: "Shorter intro" },
      "POST /v1/autopilot/findings/finding-1/request-changes",
      { instruction: "Shorter intro" },
    ],
    [
      "add_autopilot_rule",
      { text: "Never link old docs" },
      "POST /v1/autopilot/rules",
      { text: "Never link old docs" },
    ],
    ["delete_autopilot_rule", { ruleId }, `DELETE /v1/autopilot/rules/${ruleId}`],
    [
      "set_autopilot_workflow_enabled",
      { workflowId: "workflow-1", enabled: false },
      "PATCH /v1/autopilot/workflows/workflow-1",
      { enabled: false },
    ],
    ["delete_autopilot_workflow", { workflowId: "workflow-1" }, "DELETE /v1/autopilot/workflows/workflow-1"],
    ["list_autopilot_runs", { limit: 3 }, "GET /v1/autopilot/runs?limit=3"],
    ["get_autopilot_run", { runId: "run-1" }, "GET /v1/autopilot/runs/run-1"],
    ["get_autopilot_brief", {}, "GET /v1/autopilot/brief"],
    [
      "list_outreach_pitches",
      { status: "draft", followUpDue: true },
      "GET /v1/autopilot/outreach/pitches?status=draft&followUpDue=true",
    ],
    ["get_outreach_pitch", { pitchId: "pitch-1" }, "GET /v1/autopilot/outreach/pitches/pitch-1"],
    [
      "edit_outreach_pitch",
      { pitchId: "pitch-1", subject: "your list" },
      "PATCH /v1/autopilot/outreach/pitches/pitch-1",
      { subject: "your list" },
    ],
    [
      "send_outreach_pitch",
      { pitchId: "pitch-1", sendAt: "suggested" },
      "POST /v1/autopilot/outreach/pitches/pitch-1/send",
      { sendAt: "suggested" },
    ],
    ["cancel_outreach_pitch", { pitchId: "pitch-1" }, "POST /v1/autopilot/outreach/pitches/pitch-1/cancel"],
    ["mark_outreach_pitch_sent", { pitchId: "pitch-1" }, "POST /v1/autopilot/outreach/pitches/pitch-1/mark-sent"],
    ["mark_outreach_pitch_listed", { pitchId: "pitch-1" }, "POST /v1/autopilot/outreach/pitches/pitch-1/mark-listed"],
    [
      "set_outreach_pitch_later",
      { pitchId: "pitch-1", later: true },
      "POST /v1/autopilot/outreach/pitches/pitch-1/later",
    ],
    [
      "set_outreach_pitch_later",
      { pitchId: "pitch-1", later: false },
      "DELETE /v1/autopilot/outreach/pitches/pitch-1/later",
    ],
    [
      "update_outreach_pitch_details",
      { pitchId: "pitch-1", stage: "negotiating", followUpAt: null },
      "PATCH /v1/autopilot/outreach/pitches/pitch-1/details",
      { stage: "negotiating", followUpAt: null },
    ],
    ["delete_outreach_pitch", { pitchId: "pitch-1" }, "DELETE /v1/autopilot/outreach/pitches/pitch-1"],
    ["get_outreach_mailbox", {}, "GET /v1/autopilot/outreach/mailbox"],
    ["disconnect_outreach_mailbox", {}, "DELETE /v1/autopilot/outreach/mailbox"],
  ];
  for (const [tool, args, route, body] of calls) {
    const { result } = await callTool(tool, args);
    assert.notEqual(result.isError, true, `${tool}: ${JSON.stringify(result)}`);
    assert.deepEqual(result.structuredContent, manageRoutes[route], tool);
    assert.deepEqual(requests.at(-1), { route, body, authorization: bearer, workspace }, tool);
  }
});

test("rejects invalid inputs before calling the API and reports an API permission denial", async () => {
  const requestCount = requests.length;
  for (const [name, args] of [
    ["get_autopilot_status", { organizationId: "other" }],
    ["run_autopilot", { kind: "bad-kind" }],
    ["stop_autopilot_run", { runId: "../escape" }],
    ["run_autopilot_workflow", {}],
    ["update_autopilot_settings", {}],
    ["update_autopilot_settings", { maxOpenPullRequests: 9 }],
    ["update_autopilot_settings", { jobs: { podcasts: true } }],
    ["update_autopilot_settings", { stalePullRequestDays: 3 }],
    ["list_autopilot_findings", { kind: "outreach" }],
    ["get_autopilot_finding", { findingId: "../escape" }],
    ["merge_autopilot_finding", { findingId: "finding-1", method: "fast-forward", headSha: "abc1234" }],
    ["merge_autopilot_finding", { findingId: "finding-1" }],
    ["update_autopilot_settings", { jobs: { competitors: false } }],
    ["request_autopilot_changes", { findingId: "finding-1", instruction: " " }],
    ["set_autopilot_workflow_enabled", { workflowId: "workflow-1" }],
    ["edit_outreach_pitch", { pitchId: "pitch-1", to: "liz at example" }],
    ["send_outreach_pitch", { pitchId: "pitch-1", sendAt: "tomorrow" }],
    ["update_outreach_pitch_details", { pitchId: "pitch-1", stage: "won" }],
  ]) {
    const reply = await callTool(name, args);
    assert.ok(reply.error || reply.result?.isError, JSON.stringify(reply));
  }
  assert.equal(requests.length, requestCount);

  const denied = await callTool("run_autopilot", {}, { authorization: "Bearer test-read-only-key" });
  assert.equal(denied.result.isError, true);
  assert.match(denied.result.content[0].text, /autopilot\.write.*HTTP 403/);
});

test("maps Autopilot OAuth consent without adding write to a read-only grant", async () => {
  const { extractScopes } = await import("../build/utils/auth.js");
  const workspaceClaim = { "urn:notra:workspace": workspace };
  const permission = "urn:notra:permission:autopilot";
  assert.deepEqual(extractScopes({ ...workspaceClaim, [permission]: "read" }), ["autopilot.read"]);
  assert.deepEqual(extractScopes({ ...workspaceClaim, [permission]: "write" }), ["autopilot.read", "autopilot.write"]);
  assert.deepEqual(extractScopes(workspaceClaim), []);
});

test("forwards an OAuth token without letting a workspace header override its consent", async (t) => {
  const issuer = `https://${authkitDomain}`;
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const key = await exportJWK(publicKey);
  const fetch = globalThis.fetch;
  t.mock.method(globalThis, "fetch", (input, options) => {
    if (String(input) === `${issuer}/oauth2/jwks`) {
      return Promise.resolve(Response.json({ keys: [key] }));
    }
    return fetch(input, options);
  });
  const token = await new SignJWT({
    "urn:notra:workspace": "oauth-workspace",
    "urn:notra:permission:autopilot": "read",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(issuer)
    .setAudience(resource)
    .setSubject("test-user")
    .setExpirationTime("5m")
    .sign(privateKey);
  const authorization = `Bearer ${token}`;

  const { result } = await callTool("get_autopilot_status", {}, { authorization });
  assert.deepEqual(result.structuredContent, status);
  assert.deepEqual(requests.at(-1), {
    route: "GET /v1/autopilot/status",
    authorization,
    workspace: undefined,
    body: undefined,
  });
});
