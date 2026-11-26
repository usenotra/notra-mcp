import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { createInterface } from "node:readline";
import { after, before, test } from "node:test";

// Real API responses from a dev project, trimmed.
const FIXTURE = {
  summary: {
    configured: true,
    pending: 0,
    answers: 106,
    category: {
      picks: 495,
      reasons: [
        {
          reason: "features",
          count: 417,
          share: 0.8424242424242424,
        },
        {
          reason: "reviews",
          count: 35,
          share: 0.0707070707070707,
        },
        {
          reason: "integrations",
          count: 26,
          share: 0.052525252525252523,
        },
        {
          reason: "ease_of_use",
          count: 19,
          share: 0.03838383838383838,
        },
        {
          reason: "price",
          count: 19,
          share: 0.03838383838383838,
        },
        {
          reason: "performance",
          count: 16,
          share: 0.03232323232323232,
        },
        {
          reason: "security",
          count: 4,
          share: 0.00808080808080808,
        },
      ],
      engines: [
        {
          engine: "anthropic/claude-sonnet-5",
          picks: 147,
          reasons: [
            {
              reason: "features",
              count: 129,
              share: 0.8775510204081632,
            },
            {
              reason: "reviews",
              count: 14,
              share: 0.09523809523809523,
            },
            {
              reason: "price",
              count: 7,
              share: 0.047619047619047616,
            },
            {
              reason: "integrations",
              count: 1,
              share: 0.006802721088435374,
            },
          ],
        },
        {
          engine: "openai/gpt-5.6-sol",
          picks: 139,
          reasons: [
            {
              reason: "features",
              count: 116,
              share: 0.8345323741007195,
            },
            {
              reason: "ease_of_use",
              count: 8,
              share: 0.05755395683453238,
            },
            {
              reason: "price",
              count: 8,
              share: 0.05755395683453238,
            },
            {
              reason: "reviews",
              count: 5,
              share: 0.03597122302158273,
            },
            {
              reason: "integrations",
              count: 4,
              share: 0.02877697841726619,
            },
          ],
        },
      ],
    },
    brands: [
      {
        brand: "Notra",
        own: true,
        picks: 31,
        reasons: [
          {
            reason: "features",
            count: 23,
            share: 0.7419354838709677,
          },
          {
            reason: "ease_of_use",
            count: 8,
            share: 0.25806451612903225,
          },
          {
            reason: "performance",
            count: 8,
            share: 0.25806451612903225,
          },
        ],
        engines: [
          {
            engine: "opencode/gpt-5.6-sol-medium",
            picks: 23,
            reasons: [
              {
                reason: "features",
                count: 23,
                share: 1,
              },
            ],
          },
          {
            engine: "sample/demo-a",
            picks: 5,
            reasons: [
              {
                reason: "ease_of_use",
                count: 5,
                share: 1,
              },
              {
                reason: "performance",
                count: 5,
                share: 1,
              },
            ],
          },
        ],
      },
      {
        brand: "Jasper",
        own: false,
        picks: 41,
        reasons: [
          {
            reason: "features",
            count: 37,
            share: 0.9024390243902439,
          },
        ],
        engines: [
          {
            engine: "opencode/gpt-5.6-sol-medium",
            picks: 23,
            reasons: [
              {
                reason: "features",
                count: 19,
                share: 0.8260869565217391,
              },
            ],
          },
          {
            engine: "anthropic/claude-sonnet-5",
            picks: 6,
            reasons: [
              {
                reason: "features",
                count: 6,
                share: 1,
              },
            ],
          },
        ],
      },
    ],
    organization: {
      id: "org_alpha",
      slug: "alpha",
      name: "Alpha",
      logo: null,
    },
  },
  evidence: {
    evidence: [
      {
        checkId: "020fef2e-eac2-4973-a257-5993cbb2fc6f",
        scanId: "0dd75def-1e3c-4207-8d70-07ae656ab159",
        brand: "Profound",
        promptId: "custom-99b69110-e62d-43ee-8eae-04c2806e9125",
        prompt: "which platforms let me monitor my brand across multiple ai engines at once",
        engine: "anthropic/claude-sonnet-5",
        capturedAt: "2026-09-03T19:30:28.483Z",
        pick: "recommended",
        quote:
          "Tracks brand mentions, sentiment, and citations across ChatGPT, Perplexity, Gemini, and Copilot; popular with enterprise marketing teams",
      },
      {
        checkId: "27d3d39e-8e80-4147-912b-aa40e16cbb01",
        scanId: "0dd75def-1e3c-4207-8d70-07ae656ab159",
        brand: "Profound",
        promptId: "custom-01654f67-9c47-463f-9755-fa2f0850d2fd",
        prompt: "what tools help me find content gaps for ai search visibility",
        engine: "anthropic/claude-sonnet-5",
        capturedAt: "2026-09-03T19:29:56.289Z",
        pick: "recommended",
        quote:
          "Tracks how your brand appears in ChatGPT, Perplexity, and Google AI Overviews; identifies topics competitors get cited for that you don't",
      },
    ],
    organization: {
      id: "org_alpha",
      slug: "alpha",
      name: "Alpha",
      logo: null,
    },
  },
};

const REQUESTS = {
  configured: true,
  unlabeledPrompts: 0,
  overall: {
    request: "all",
    answers: 86,
    noSingleChoice: 73,
    brands: [
      {
        brand: "Otterly.AI",
        own: false,
        picks: 57,
        rate: 0.6627906976744186,
      },
      {
        brand: "Peec AI",
        own: false,
        picks: 56,
        rate: 0.6511627906976745,
      },
      {
        brand: "Profound",
        own: false,
        picks: 55,
        rate: 0.6395348837209303,
      },
    ],
  },
  requests: [
    {
      request: "none",
      answers: 54,
      noSingleChoice: 46,
      brands: [
        {
          brand: "Otterly.AI",
          own: false,
          picks: 39,
          rate: 0.7222222222222222,
        },
        {
          brand: "Peec AI",
          own: false,
          picks: 39,
          rate: 0.7222222222222222,
        },
        {
          brand: "Profound",
          own: false,
          picks: 39,
          rate: 0.7222222222222222,
        },
      ],
    },
    {
      request: "integrations",
      answers: 15,
      noSingleChoice: 14,
      brands: [
        {
          brand: "Otterly.AI",
          own: false,
          picks: 6,
          rate: 0.4,
        },
        {
          brand: "Peec AI",
          own: false,
          picks: 6,
          rate: 0.4,
        },
        {
          brand: "Profound",
          own: false,
          picks: 6,
          rate: 0.4,
        },
      ],
    },
  ],
  organization: {
    id: "org_alpha",
    slug: "alpha",
    name: "Alpha",
    logo: null,
  },
};

let api, mcp, endpoint;
const requests = [];

before(
  async () => {
    api = createServer((req, res) => {
      const url = new URL(req.url, "http://localhost");
      requests.push({ path: url.pathname, query: Object.fromEntries(url.searchParams) });
      let data;
      if (url.pathname.endsWith("/visibility/pick-reasons")) data = FIXTURE.summary;
      else if (url.pathname.endsWith("/visibility/pick-reasons/evidence")) data = FIXTURE.evidence;
      else if (url.pathname.endsWith("/visibility/pick-reasons/requests")) data = REQUESTS;
      if (!data) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify(data));
    }).listen(0, "127.0.0.1");
    await once(api, "listening");
    mcp = spawn(process.execPath, ["build/http.js"], {
      env: {
        PORT: "0",
        DOTENV_CONFIG_PATH: "/dev/null",
        WORKOS_AUTHKIT_DOMAIN: "127.0.0.1:1",
        NOTRA_API_BASE: `http://127.0.0.1:${api.address().port}`,
        MCP_USE_ANONYMIZED_TELEMETRY: "false",
      },
      stdio: ["ignore", "pipe", "inherit"],
    });
    for await (const line of createInterface({ input: mcp.stdout })) {
      const match = line.match(/Notra MCP HTTP server listening on port (\d+)/);
      if (match) {
        endpoint = `http://127.0.0.1:${match[1]}/mcp`;
        break;
      }
    }
    assert.ok(endpoint, "MCP server exited before listening");
  },
  { timeout: 15000 },
);

after(async () => {
  mcp?.kill();
  await new Promise((resolve) => api?.close(resolve));
});

async function rpc(method, params) {
  const res = await fetch(`${endpoint}?toolsets=geo`, {
    method: "POST",
    headers: {
      Authorization: "Bearer fixture-key",
      "X-Notra-Organization-Id": "alpha",
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2025-06-18",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(5000),
  });
  const text = await res.text();
  assert.equal(res.status, 200, text);
  const message = JSON.parse(
    text.startsWith("{")
      ? text
      : text
          .split("\n")
          .find((line) => line.startsWith("data:"))
          .slice(5),
  );
  return message;
}

async function call(name, args) {
  const message = await rpc("tools/call", { name, arguments: args });
  assert.ok(message.result && !message.result.isError, JSON.stringify(message));
  const { content, structuredContent } = message.result;
  assert.deepEqual(JSON.parse(content[0].text), structuredContent);
  return structuredContent;
}

test("pick reason tools are listed as read-only GEO tools", async () => {
  const { result } = await rpc("tools/list", {});
  for (const name of ["get_geo_pick_reasons", "list_geo_pick_reason_evidence", "get_geo_pick_requests"]) {
    const tool = result.tools.find((entry) => entry.name === name);
    assert.ok(tool, name);
    assert.equal(tool.annotations.readOnlyHint, true);
    assert.ok(tool.outputSchema, name);
  }
});

test("get_geo_pick_reasons forwards the filter and window and returns the brands", async () => {
  requests.length = 0;
  const result = await call("get_geo_pick_reasons", {
    projectId: "proj_1",
    brand: "Notra",
    limit: 2,
    from: "2026-09-01",
    to: "2026-09-20",
  });
  assert.deepEqual(requests, [
    {
      path: "/v1/projects/proj_1/geo/visibility/pick-reasons",
      query: { brand: "Notra", limit: "2", from: "2026-09-01", to: "2026-09-20" },
    },
  ]);
  assert.equal(result.brands[0].own, true);
  assert.equal(result.brands[0].reasons[0].reason, "features");
  assert.ok(result.category.picks >= result.brands[0].picks);
  assert.ok(result.answers > 0);
});

test("list_geo_pick_reason_evidence forwards brand, reason and engine", async () => {
  requests.length = 0;
  const result = await call("list_geo_pick_reason_evidence", {
    projectId: "proj_1",
    brand: "Profound",
    reason: "features",
    engine: "claude",
  });
  assert.deepEqual(requests, [
    {
      path: "/v1/projects/proj_1/geo/visibility/pick-reasons/evidence",
      query: { brand: "Profound", reason: "features", engine: "claude" },
    },
  ]);
  assert.ok(result.evidence.length > 0);
  assert.ok(result.evidence.every((row) => row.quote.length > 0));
});

test("list_geo_pick_reason_evidence rejects an unknown reason", async () => {
  const message = await rpc("tools/call", {
    name: "list_geo_pick_reason_evidence",
    arguments: { projectId: "proj_1", brand: "Profound", reason: "vibes" },
  });
  assert.ok(message.error || message.result?.isError, JSON.stringify(message));
});

test("get_geo_pick_requests returns the overall row and one row per kind of request", async () => {
  requests.length = 0;
  const result = await call("get_geo_pick_requests", { projectId: "proj_1", days: 30 });
  assert.deepEqual(requests, [
    { path: "/v1/projects/proj_1/geo/visibility/pick-reasons/requests", query: { days: "30" } },
  ]);
  assert.equal(result.overall.request, "all");
  assert.ok(result.requests.length > 0);
  assert.ok(result.requests.every((row) => row.answers <= result.overall.answers));
});
