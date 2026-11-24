import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { createInterface } from "node:readline";
import { after, before, test } from "node:test";

let api, mcp, endpoint;
const day = "2026-11-01";
const points = [
  ["crawler", 2],
  ["ai_referral", 1],
  ["human", 2],
  ["unknown", 15],
].map(([visitorType, visits]) => ({ day, visitorType, visits, source: visitorType }));
const totals = Object.fromEntries(
  ["requests", "toolCalls", "errors", "sessions", "users", "p95Ms"].flatMap((key) => [
    [key, 0],
    [`previous${key[0].toUpperCase()}${key.slice(1)}`, 0],
  ]),
);

before(
  async () => {
    api = createServer(async (req, res) => {
      const path = new URL(req.url, "http://localhost").pathname;
      const slug = req.headers["x-notra-organization-id"];
      const organization = { id: `org_${slug}`, slug, name: slug, logo: null };
      const configured = !path.includes("/disabled/");
      const active = path.includes("/active/");
      let data;
      if (path.endsWith("/settings")) {
        const settings = {
          id: "settings-id",
          organizationId: organization.id,
          projectId: "active",
          companyName: "Example",
          aliases: [],
          conversionPaths: [],
          domains: ["example.com"],
          competitors: ["Other", "Scrunch"],
          languages: ["English"],
          engines: ["google/ai-overview"],
          enforceZdr: false,
          nonZdrApprovedEngines: [],
          trackWithoutSearch: false,
          pausedAutoPromptIds: [],
          removedAutoPromptIds: [],
          enabled: false,
          scanIntervalHours: 24,
          nextScanAt: null,
          scanStartedAt: null,
          lastScanAt: null,
          isScanning: false,
          createdAt: day,
          updatedAt: day,
        };
        if (req.method === "PATCH") {
          const chunks = [];
          for await (const chunk of req) chunks.push(chunk);
          const { domains } = JSON.parse(Buffer.concat(chunks));
          if (domains) {
            settings.domains = [...new Set(domains.map((domain) => domain.replace(/^www\./, "")))];
          }
        }
        data = { configured, organization, settings };
      } else if (path.endsWith("/traffic/mcp")) {
        data = {
          configured,
          organization,
          server: null,
          totals: { ...totals, requests: active ? 2 : 0, previousRequests: path.includes("/quiet/") ? 5 : 0 },
          catalog: null,
          clients: [],
          daily: [],
          elicitations: [],
          errorRequests: [],
          intents: [],
          models: [],
          tools: [],
          uiRenders: [],
        };
      } else if (path.endsWith("/traffic/overview")) {
        data = {
          configured,
          organization,
          totals: { crawler: 2, cited: 0, aiReferral: 1, conversions: null },
          sources: [],
          points: active ? points : [],
          previousConversions: null,
        };
      } else if (path.endsWith("/visibility/overview")) {
        data = { configured, organization, engines: [] };
      } else {
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

async function rpc(method, params, workspace = "alpha", path = "") {
  const res = await fetch(`${endpoint}${path}?toolsets=geo`, {
    method: "POST",
    headers: {
      Authorization: "Bearer fixture-key",
      "X-Notra-Organization-Id": workspace,
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
  assert.ok(message.result && !message.result.isError, text);
  return message.result;
}

async function call(name, projectId, workspace, path) {
  const { content, structuredContent } = await rpc("tools/call", { name, arguments: { projectId } }, workspace, path);
  assert.deepEqual(JSON.parse(content[0].text), structuredContent);
  return structuredContent;
}

test("updating GEO domains explains when www hosts are saved without the prefix", async () => {
  const name = "update_geo_settings";
  const { tools } = await rpc("tools/list", {});
  assert.match(tools.find((tool) => tool.name === name).description, /drop the leading www\./);

  for (const [domains, expectWarning] of [
    [["example.com", "www.example.com"], true],
    [["www.example.com", "example.com"], true],
    [["www.example.com"], true],
    [["example.com"], false],
    [undefined, false],
  ]) {
    const { content, structuredContent } = await rpc("tools/call", {
      name,
      arguments: { projectId: "active", ...(domains ? { domains } : { enabled: false }) },
    });
    assert.deepEqual(JSON.parse(content[0].text), structuredContent);
    assert.deepEqual(structuredContent.settings.domains, ["example.com"]);
    if (expectWarning) {
      assert.match(structuredContent.warnings[0], /Traffic from www\. hosts is still covered/);
    } else {
      assert.equal(structuredContent.warnings, undefined);
    }
  }
});

test("a single MCP endpoint scopes parallel calls by header; a scoped URL wins", async () => {
  const workspaces = await Promise.all(
    ["alpha", "beta"].map((slug) => call("get_geo_traffic_overview", "active", slug)),
  );
  assert.deepEqual(
    workspaces.map((result) => result.organization.slug),
    ["alpha", "beta"],
  );
  const pinned = await call("get_geo_traffic_overview", "active", "alpha", "/beta");
  assert.equal(pinned.organization.slug, "beta");
  for (const [path, visible] of [
    ["", true],
    ["/beta", false],
  ]) {
    const { tools } = await rpc("tools/list", {}, "alpha", path);
    assert.equal(
      tools.some((tool) => tool.name === "list_workspaces"),
      visible,
    );
    for (const [name, field] of [
      ["get_geo_mcp_analytics", "reportingStatus"],
      ["get_geo_traffic_overview", "classification"],
    ]) {
      assert.ok(tools.find((tool) => tool.name === name).outputSchema.required.includes(field));
    }
  }
});

test("MCP reporting status distinguishes configuration and activity in the selected window", async () => {
  for (const [project, status] of [
    ["disabled", "not_configured"],
    ["empty", "no_requests_in_window"],
    ["quiet", "no_requests_in_window"],
    ["active", "reporting"],
  ]) {
    const result = await call("get_geo_mcp_analytics", project);
    assert.equal(result.reportingStatus, status);
  }
});

test("classification counts requests, including humans and unknowns, across the overview and snapshot", async () => {
  const expected = { totalRequests: 20, unknownRequests: 15, classifiedShare: 0.25 };
  assert.deepEqual((await call("get_geo_traffic_overview", "active")).classification, expected);
  assert.deepEqual((await call("get_geo_snapshot", "active")).traffic.classification, expected);
  assert.deepEqual((await call("get_geo_traffic_overview", "empty")).classification, {
    totalRequests: 0,
    unknownRequests: 0,
    classifiedShare: null,
  });
});
