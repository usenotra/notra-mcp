import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import { after, before, test } from "node:test";

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
const bearer = "Bearer test-account-key";
const workspace = "workspace-test";
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
    };
    const [code, data] =
      req.headers.authorization === "Bearer test-read-only-key" && req.method === "POST"
        ? [403, { error: "Missing required scope: autopilot.write" }]
        : (routes[route] ?? [404, { error: "Not found" }]);
    res.writeHead(code, { "Content-Type": "application/json" }).end(JSON.stringify(data));
  }).listen(0, "127.0.0.1");
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

test("discovers the Autopilot tools and enforces toolset filtering", async () => {
  const names = ["get_autopilot_status", "run_autopilot", "run_autopilot_workflow", "stop_autopilot_run"];
  const defaults = await rpc("tools/list");
  const autopilot = await rpc("tools/list", undefined, { toolsets: "autopilot" });
  const geo = await rpc("tools/list", undefined, { toolsets: "geo" });

  for (const result of [defaults, autopilot]) {
    const tools = result.result.tools.filter((tool) => tool.name.includes("autopilot"));
    assert.deepEqual(tools.map((tool) => tool.name).sort(), names);
    for (const tool of tools) {
      const readOnly = tool.name === "get_autopilot_status";
      assert.equal(tool.annotations.readOnlyHint, readOnly);
      assert.equal(tool.outputSchema.type, "object");
      if (!readOnly) assert.match(tool.description, /explicit user confirmation/i);
    }
  }
  assert.ok(autopilot.result.tools.some((tool) => tool.name === "whoami"));
  assert.ok(!autopilot.result.tools.some((tool) => tool.name === "list_posts"));
  assert.ok(!geo.result.tools.some((tool) => tool.name.includes("autopilot")));
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

test("rejects invalid inputs before calling the API and reports an API permission denial", async () => {
  const requestCount = requests.length;
  for (const [name, args] of [
    ["get_autopilot_status", { organizationId: "other" }],
    ["run_autopilot", { kind: "bad-kind" }],
    ["stop_autopilot_run", { runId: "../escape" }],
    ["run_autopilot_workflow", {}],
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
