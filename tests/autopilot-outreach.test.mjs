import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer as createHttpServer } from "node:http";
import { after, before, test } from "node:test";
import * as z from "zod";

const summary = {
  id: "pitch-1",
  status: "draft",
  stage: "drafted",
  page: { url: "https://example.com/best-tools", domain: "example.com", title: "Best tools", publisher: "Example" },
  recipient: { name: "Sam Editor", email: "sam@example.com" },
  subject: "Adding Notra to your list",
  problem: null,
  sentAt: null,
  scheduledAt: null,
  followUpAt: null,
  followUpDue: false,
  lastActivityAt: "2026-11-20T09:00:00Z",
  replyCount: 0,
  later: false,
  deal: null,
};
const pitch = {
  ...summary,
  body: "Hi Sam,\n\nWould you consider adding Notra?",
  from: "team@notra.example",
  reason: "Cited for two tracked prompts and lists three competitors",
  citedFor: ["best changelog tools"],
  competitorsListed: ["Competitor"],
  contactRoutes: [{ type: "email", value: "sam@example.com", foundOn: "https://example.com/about" }],
  suggestedSendAt: "2026-11-24T09:00:00Z",
  optedOut: false,
  thread: [{ at: "2026-11-21T10:00:00Z", from: "sam@example.com", kind: "answer", text: "Sounds good." }],
};
const scheduled = { ...pitch, status: "scheduled", scheduledAt: "2026-11-24T09:00:00Z" };
const mailbox = {
  mailbox: { email: "team@notra.example", provider: "google", status: "active", lastSentAt: null },
  connectUrl: "https://app.usenotra.example/connect-mailbox",
};
const bearer = "Bearer test-account-key";
const workspace = "workspace-test";
const pitchPath = "/v1/autopilot/outreach/pitches/pitch-1";
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
    const { pathname } = new URL(req.url, "http://upstream");
    const routes = {
      "GET /v1/autopilot/outreach/pitches": [200, { pitches: [summary] }],
      [`GET ${pitchPath}`]: [200, { pitch }],
      [`PATCH ${pitchPath}`]: [200, { pitch }],
      [`DELETE ${pitchPath}`]: [200, { deleted: true }],
      [`POST ${pitchPath}/send`]: [200, { pitch: scheduled, scheduledAt: scheduled.scheduledAt }],
      [`POST ${pitchPath}/cancel`]: [200, { pitch }],
      [`POST ${pitchPath}/mark-sent`]: [200, { pitch: { ...pitch, status: "sent", stage: "sent" } }],
      [`POST ${pitchPath}/mark-listed`]: [200, { pitch: { ...pitch, status: "listed" } }],
      [`POST ${pitchPath}/later`]: [200, { pitch: { ...pitch, later: true } }],
      [`DELETE ${pitchPath}/later`]: [200, { pitch }],
      [`PATCH ${pitchPath}/details`]: [200, { pitch }],
      "GET /v1/autopilot/outreach/mailbox": [200, mailbox],
      "DELETE /v1/autopilot/outreach/mailbox": [200, { disconnected: true }],
    };
    const [code, data] =
      req.headers.authorization === "Bearer test-read-only-key" && req.method !== "GET"
        ? [403, { error: "Missing required scope: autopilot.write" }]
        : (routes[`${req.method} ${pathname}`] ?? [404, { error: "Not found" }]);
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

const READ_TOOLS = ["get_outreach_mailbox", "get_outreach_pitch", "list_outreach_pitches"];
const CONFIRM_TOOLS = ["delete_outreach_pitch", "disconnect_outreach_mailbox", "send_outreach_pitch"];
const TOOL_NAMES = [
  ...READ_TOOLS,
  ...CONFIRM_TOOLS,
  "cancel_outreach_pitch",
  "edit_outreach_pitch",
  "mark_outreach_pitch_listed",
  "mark_outreach_pitch_sent",
  "set_outreach_pitch_later",
  "update_outreach_pitch_details",
].sort();

test("lists the outreach tools under the autopilot toolset with the right annotations", async () => {
  const defaults = await rpc("tools/list");
  const autopilot = await rpc("tools/list", undefined, { toolsets: "autopilot" });
  const content = await rpc("tools/list", undefined, { toolsets: "content" });

  for (const result of [defaults, autopilot]) {
    const tools = result.result.tools.filter((tool) => tool.name.includes("outreach"));
    assert.deepEqual(tools.map((tool) => tool.name).sort(), TOOL_NAMES);
    for (const tool of tools) {
      const readOnly = READ_TOOLS.includes(tool.name);
      const confirm = CONFIRM_TOOLS.includes(tool.name);
      assert.equal(tool.annotations.readOnlyHint, readOnly, tool.name);
      assert.equal(tool.annotations.destructiveHint, confirm, tool.name);
      assert.equal(tool.annotations.openWorldHint, tool.name === "send_outreach_pitch", tool.name);
      assert.equal(tool.inputSchema.additionalProperties, false, tool.name);
      assert.equal(tool.outputSchema.type, "object", tool.name);
      if (confirm) assert.match(tool.description, /explicit user confirmation/i, tool.name);
      if (tool.name.includes("pitch") && tool.name !== "list_outreach_pitches") {
        assert.match(tool.inputSchema.properties.pitchId.description, /list_outreach_pitches/, tool.name);
      }
    }
    const send = tools.find((tool) => tool.name === "send_outreach_pitch");
    assert.match(send.description, /real person/);
    const mailboxTool = tools.find((tool) => tool.name === "get_outreach_mailbox");
    assert.match(mailboxTool.description, /connectUrl in a browser/);
  }
  assert.ok(!content.result.tools.some((tool) => tool.name.includes("outreach")));
  const hidden = await callTool("list_outreach_pitches", {}, { toolsets: "content" });
  assert.equal(hidden.result.isError, true);
  assert.equal(requests.length, 0);
});

test("forwards every outreach tool to the right route and body, and outputs match the schemas", async () => {
  const { tools } = (await rpc("tools/list", undefined, { toolsets: "autopilot" })).result;
  const outputSchemas = new Map(tools.map((tool) => [tool.name, z.fromJSONSchema(tool.outputSchema)]));
  const deal = {
    decision: "paid",
    amount: 150,
    currency: "USD",
    terms: "One year listing",
    placementUrl: "https://example.com/best-tools#notra",
  };
  const calls = [
    ["list_outreach_pitches", {}, "GET /v1/autopilot/outreach/pitches", undefined, { pitches: [summary] }],
    [
      "list_outreach_pitches",
      { status: "sent", stage: "no_reply", followUpDue: true, search: "example.com" },
      "GET /v1/autopilot/outreach/pitches?status=sent&stage=no_reply&followUpDue=true&search=example.com",
      undefined,
      { pitches: [summary] },
    ],
    [
      "list_outreach_pitches",
      { followUpDue: false },
      "GET /v1/autopilot/outreach/pitches?followUpDue=false",
      undefined,
      { pitches: [summary] },
    ],
    ["get_outreach_pitch", { pitchId: "pitch-1" }, `GET ${pitchPath}`, undefined, { pitch }],
    [
      "edit_outreach_pitch",
      { pitchId: "pitch-1", to: "", subject: "New subject", body: "New body" },
      `PATCH ${pitchPath}`,
      { to: "", subject: "New subject", body: "New body" },
      { pitch },
    ],
    [
      "send_outreach_pitch",
      { pitchId: "pitch-1" },
      `POST ${pitchPath}/send`,
      {},
      { pitch: scheduled, scheduledAt: scheduled.scheduledAt },
    ],
    [
      "send_outreach_pitch",
      { pitchId: "pitch-1", sendAt: "suggested" },
      `POST ${pitchPath}/send`,
      { sendAt: "suggested" },
      { pitch: scheduled, scheduledAt: scheduled.scheduledAt },
    ],
    [
      "send_outreach_pitch",
      { pitchId: "pitch-1", sendAt: "2026-11-24T09:00:00+01:00" },
      `POST ${pitchPath}/send`,
      { sendAt: "2026-11-24T09:00:00+01:00" },
      { pitch: scheduled, scheduledAt: scheduled.scheduledAt },
    ],
    ["cancel_outreach_pitch", { pitchId: "pitch-1" }, `POST ${pitchPath}/cancel`, undefined, { pitch }],
    [
      "mark_outreach_pitch_sent",
      { pitchId: "pitch-1" },
      `POST ${pitchPath}/mark-sent`,
      undefined,
      { pitch: { ...pitch, status: "sent", stage: "sent" } },
    ],
    [
      "mark_outreach_pitch_listed",
      { pitchId: "pitch-1" },
      `POST ${pitchPath}/mark-listed`,
      undefined,
      { pitch: { ...pitch, status: "listed" } },
    ],
    [
      "set_outreach_pitch_later",
      { pitchId: "pitch-1" },
      `POST ${pitchPath}/later`,
      undefined,
      { pitch: { ...pitch, later: true } },
    ],
    [
      "set_outreach_pitch_later",
      { pitchId: "pitch-1", later: false },
      `DELETE ${pitchPath}/later`,
      undefined,
      { pitch },
    ],
    [
      "update_outreach_pitch_details",
      { pitchId: "pitch-1", stage: "negotiating", followUpAt: "2026-11-27T09:00:00Z", deal },
      `PATCH ${pitchPath}/details`,
      { stage: "negotiating", followUpAt: "2026-11-27T09:00:00Z", deal },
      { pitch },
    ],
    [
      "update_outreach_pitch_details",
      { pitchId: "pitch-1", stage: null, followUpAt: "auto", deal: null },
      `PATCH ${pitchPath}/details`,
      { stage: null, followUpAt: "auto", deal: null },
      { pitch },
    ],
    ["delete_outreach_pitch", { pitchId: "pitch-1" }, `DELETE ${pitchPath}`, undefined, { deleted: true }],
    ["get_outreach_mailbox", {}, "GET /v1/autopilot/outreach/mailbox", undefined, mailbox],
    ["disconnect_outreach_mailbox", {}, "DELETE /v1/autopilot/outreach/mailbox", undefined, { disconnected: true }],
  ];
  const covered = new Set();
  for (const [tool, args, route, body, expected] of calls) {
    const { result } = await callTool(tool, args);
    assert.deepEqual(result.structuredContent, expected, JSON.stringify(result));
    assert.deepEqual(JSON.parse(result.content[0].text), expected);
    assert.deepEqual(requests.at(-1), { route, body, authorization: bearer, workspace });
    const parsed = outputSchemas.get(tool).safeParse(result.structuredContent);
    assert.ok(parsed.success, `${tool}: ${parsed.error?.message}`);
    covered.add(tool);
  }
  assert.deepEqual([...covered].sort(), TOOL_NAMES);
});

test("rejects invalid inputs before calling the API", async () => {
  const requestCount = requests.length;
  for (const [name, args] of [
    ["list_outreach_pitches", { status: "pending" }],
    ["list_outreach_pitches", { stage: "drafting" }],
    ["list_outreach_pitches", { followUpDue: "yes" }],
    ["list_outreach_pitches", { search: "x".repeat(201) }],
    ["list_outreach_pitches", { organizationId: "other" }],
    ["edit_outreach_pitch", { pitchId: "pitch-1", to: "abc" }],
    [
      "update_outreach_pitch_details",
      {
        pitchId: "pitch-1",
        deal: { decision: "paid", amount: 100, currency: "ZZZ", terms: null, placementUrl: null },
      },
    ],
    ["get_outreach_pitch", { pitchId: "../escape" }],
    ["get_outreach_pitch", {}],
    ["edit_outreach_pitch", { pitchId: "pitch-1" }],
    ["edit_outreach_pitch", { pitchId: "pitch-1", subject: "" }],
    ["edit_outreach_pitch", { pitchId: "pitch-1", body: "x".repeat(5001) }],
    ["edit_outreach_pitch", { pitchId: "pitch-1", subject: "Hi", cc: "a@example.com" }],
    ["send_outreach_pitch", { pitchId: "pitch-1", sendAt: "tomorrow" }],
    ["send_outreach_pitch", { pitchId: "pitch-1", sendAt: "2026-11-24T09:00:00" }],
    ["update_outreach_pitch_details", { pitchId: "pitch-1" }],
    ["update_outreach_pitch_details", { pitchId: "pitch-1", stage: "won" }],
    ["update_outreach_pitch_details", { pitchId: "pitch-1", followUpAt: "never" }],
    ["update_outreach_pitch_details", { pitchId: "pitch-1", deal: { decision: "paid" } }],
    [
      "update_outreach_pitch_details",
      {
        pitchId: "pitch-1",
        deal: { decision: "barter", amount: null, currency: null, terms: null, placementUrl: null },
      },
    ],
    [
      "update_outreach_pitch_details",
      {
        pitchId: "pitch-1",
        deal: { decision: "paid", amount: -1, currency: "usd", terms: null, placementUrl: "ftp://example.com" },
      },
    ],
    ["get_outreach_mailbox", { provider: "google" }],
    ["disconnect_outreach_mailbox", { force: true }],
  ]) {
    const reply = await callTool(name, args);
    assert.ok(reply.error || reply.result?.isError, `${name} ${JSON.stringify(args)}: ${JSON.stringify(reply)}`);
  }
  assert.equal(requests.length, requestCount);
});

test("a read-only key can read outreach but every write reports the API's 403", async () => {
  const authorization = "Bearer test-read-only-key";
  const read = await callTool("list_outreach_pitches", {}, { authorization });
  assert.deepEqual(read.result.structuredContent, { pitches: [summary] });

  for (const [name, args] of [
    ["edit_outreach_pitch", { pitchId: "pitch-1", subject: "New subject" }],
    ["send_outreach_pitch", { pitchId: "pitch-1" }],
    ["cancel_outreach_pitch", { pitchId: "pitch-1" }],
    ["mark_outreach_pitch_sent", { pitchId: "pitch-1" }],
    ["mark_outreach_pitch_listed", { pitchId: "pitch-1" }],
    ["set_outreach_pitch_later", { pitchId: "pitch-1" }],
    ["update_outreach_pitch_details", { pitchId: "pitch-1", followUpAt: null }],
    ["delete_outreach_pitch", { pitchId: "pitch-1" }],
    ["disconnect_outreach_mailbox", {}],
  ]) {
    const denied = await callTool(name, args, { authorization });
    assert.equal(denied.result.isError, true, name);
    assert.match(denied.result.content[0].text, /autopilot\.write.*HTTP 403/, name);
    assert.equal(requests.at(-1).authorization, authorization);
  }
});
