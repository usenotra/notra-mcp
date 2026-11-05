import { beforeEach, expect, test, vi } from "vitest";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { createServer } from "../src/server.ts";
import { parseToolsets } from "../src/utils/toolsets.ts";

const organization = { id: "org-1", slug: "org", name: "Org", logo: null };
const meta = {
  "io.modelcontextprotocol/protocolVersion": "2026-07-28",
  "io.modelcontextprotocol/clientCapabilities": {},
};
const web = {
  configured: true,
  imported: null,
  hosts: [{ host: "www.acme.com", siteId: "", views: 120 }],
  totals: {
    views: 120,
    previousViews: 80,
    visitors: 40,
    previousVisitors: 30,
    sessions: 50,
    previousSessions: 35,
    engagedSessions: 20,
    aiVisitors: 4,
    previousAiVisitors: 2,
  },
  points: [{ day: "2026-11-02", views: 10, visitors: 4 }],
  organization,
};

const TOOLS = [
  "get_geo_web_analytics",
  "get_geo_web_analytics_breakdowns",
  "get_geo_traffic_journey_stats",
  "list_geo_analytics_imports",
];

beforeEach(() => {
  vi.stubEnv("POSTHOG_PROJECT_TOKEN", "");
  vi.restoreAllMocks();
});

async function call(name, args) {
  const handler = createMcpHandler(() => createServer("test-token", { onlyTool: name }), { legacy: "reject" });
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

test("get_geo_web_analytics passes the window and dashboard filters", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async () => Response.json(web));

  const result = await call("get_geo_web_analytics", {
    projectId: "project-1",
    from: "2026-10-01",
    to: "2026-10-31",
    host: "www.acme.com",
    path: "/pricing",
    sites: "exclude",
  });

  const url = new URL(fetch.mock.calls[0][0]);
  expect(fetch.mock.calls[0][1].method).toBe("GET");
  expect(url.pathname).toBe("/v1/projects/project-1/geo/traffic/web");
  expect(Object.fromEntries(url.searchParams)).toEqual({
    from: "2026-10-01",
    to: "2026-10-31",
    host: "www.acme.com",
    path: "/pricing",
    sites: "exclude",
  });
  expect(result.result.isError).toBeUndefined();
  expect(result.result.structuredContent).toEqual(web);
});

test("read tools reach their routes", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const { pathname } = new URL(input);
    if (pathname.endsWith("/breakdowns")) {
      return Response.json({
        configured: true,
        pages: [],
        sources: [],
        countries: [],
        devices: [],
        outcomes: [],
        outboundLinks: [],
        vitals: [],
        errors: [],
        languages: [],
        campaignTerms: [],
        campaignContents: [],
        organization,
      });
    }
    if (pathname.endsWith("/journey-stats")) {
      return Response.json({
        configured: true,
        sources: [],
        pages: [],
        totalPages: 0,
        previousTotalPages: 0,
        organization,
      });
    }
    return Response.json({ imports: [], organization });
  });

  for (const [name, args, path] of [
    ["get_geo_web_analytics_breakdowns", { projectId: "p1", days: 7 }, "/v1/projects/p1/geo/traffic/web/breakdowns"],
    ["get_geo_traffic_journey_stats", { projectId: "p1", days: 7 }, "/v1/projects/p1/geo/traffic/journey-stats"],
    ["list_geo_analytics_imports", { projectId: "p1" }, "/v1/projects/p1/geo/traffic/imports"],
  ]) {
    fetch.mockClear();
    const result = await call(name, args);
    expect(result.result.isError, name).toBeUndefined();
    expect(new URL(fetch.mock.calls[0][0]).pathname).toBe(path);
    expect(fetch.mock.calls[0][1].method).toBe("GET");
  }
});

test("invalid filters are rejected before the API is called", async () => {
  const fetch = vi.spyOn(globalThis, "fetch");

  const badPath = await call("get_geo_web_analytics", { projectId: "p1", path: "pricing" });

  expect(badPath.result?.isError ?? Boolean(badPath.error)).toBe(true);
  expect(fetch).not.toHaveBeenCalled();
});

test("get_geo_ingest_setup can ask for a project's web key", async () => {
  const fetch = vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    Response.json({
      ingestUrl: "https://app.usenotra.com/api/collect",
      snippet: "",
      snippets: { next: "", nuxt: "", netlify: "", tanstack: "", astro: "", sveltekit: "", reactRouter: "" },
      drainUrls: { vercel: "", cloudflare: "" },
      webKey: "nwk.org-1.p1.sig",
      webSnippet: "<script></script>",
      webScript: { url: "u", pinnedUrl: "p", integrity: "sha384-x" },
      webPlusScript: { url: "u", pinnedUrl: "p", integrity: "sha384-y" },
      organization,
    }),
  );

  const result = await call("get_geo_ingest_setup", { projectId: "p1" });

  const url = new URL(fetch.mock.calls[0][0]);
  expect(url.pathname).toBe("/v1/geo/ingest/setup");
  expect(url.searchParams.get("projectId")).toBe("p1");
  expect(result.result.structuredContent.webKey).toBe("nwk.org-1.p1.sig");
});

test("analytics tools are read-only GEO tools", () => {
  const registered = new Map();
  vi.spyOn(McpServer.prototype, "registerTool").mockImplementation(function (name, config) {
    registered.set(name, config);
    return { enabled: true };
  });
  createServer("test-token", { toolsets: parseToolsets("geo") });
  const geo = new Map(registered);
  registered.clear();
  createServer("test-token", { toolsets: parseToolsets("content") });

  for (const name of TOOLS) {
    expect(geo.has(name), name).toBe(true);
    expect(registered.has(name), name).toBe(false);
  }
  expect(TOOLS.filter((name) => !geo.get(name).annotations.readOnlyHint)).toEqual([]);
  expect([...geo.keys()]).not.toContain("rotate_geo_web_key");
  expect([...geo.keys()].filter((name) => name.includes("share") && name.includes("analytics"))).toEqual([]);
});
