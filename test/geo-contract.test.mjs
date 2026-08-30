import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { NotraClient } from "../build/notra-client.js";
import { geoCompetitorImportSchema, geoPromptImportSchema } from "../build/schemas/geo-import.js";
import { createServer } from "../build/server.js";
import { handleError } from "../build/utils/mcp.js";
import { appendQueryParams } from "../build/utils/query-params.js";

const GEO_TOOL_NAMES = [
  "list_projects",
  "get_project",
  "create_project",
  "update_project",
  "delete_project",
  "get_geo_settings",
  "update_geo_settings",
  "list_geo_prompts",
  "create_geo_prompt",
  "update_geo_prompt",
  "delete_geo_prompt",
  "import_geo_prompts",
  "list_geo_sequences",
  "create_geo_sequence",
  "update_geo_sequence",
  "delete_geo_sequence",
  "run_geo_sequence",
  "list_geo_competitors",
  "upsert_geo_competitor",
  "suggest_geo_competitors",
  "delete_geo_competitor",
  "import_geo_competitors",
  "create_geo_scan",
  "list_geo_scans",
  "get_geo_scan",
  "get_geo_visibility_overview",
  "get_geo_visibility_timeseries",
  "get_geo_prompt_results",
  "get_geo_competitor_share",
  "get_geo_language_share",
  "get_geo_competitor_detail",
  "list_geo_content_gaps",
  "list_geo_content_briefs",
  "plan_geo_content_brief",
  "get_geo_content_brief",
  "approve_geo_content_brief",
  "get_geo_agent_readiness",
  "start_geo_agent_readiness_scan",
  "get_geo_traffic_overview",
  "get_geo_traffic_log",
  "list_geo_traffic_journeys",
  "get_geo_traffic_journey",
  "list_geo_traffic_pages",
  "get_geo_ingest_setup",
  "issue_geo_ingest_token",
  "rotate_geo_ingest_token",
];

describe("GEO MCP contract", () => {
  it("registers every GEO tool alongside the existing tools", async () => {
    const server = createServer("test-token");

    assert.ok(server.toolInputSchemaJson("list_posts"), "existing tools remain registered");
    for (const name of GEO_TOOL_NAMES) {
      assert.ok(server.toolInputSchemaJson(name), `${name} is not registered`);
    }

    await server.close();
  });

  it("keeps important input limits aligned with the public API", async () => {
    const server = createServer("test-token");
    const settings = server.toolInputSchemaJson("update_geo_settings").properties;
    const promptImport = server.toolInputSchemaJson("import_geo_prompts").properties;
    const competitorImport = server.toolInputSchemaJson("import_geo_competitors").properties;
    const sequence = server.toolInputSchemaJson("create_geo_sequence").properties;
    const brief = server.toolInputSchemaJson("plan_geo_content_brief").properties;

    assert.deepEqual(settings.scanIntervalHours.enum, [24, 48, 72, 168, 336, 720]);
    assert.equal(settings.aliases.maxItems, 10);
    assert.equal(settings.languages.minItems, 1);
    assert.equal(settings.languages.maxItems, 4);
    assert.equal(settings.engines.maxItems, 64);
    assert.equal(promptImport.rows.maxItems, 500);
    assert.equal(promptImport.csv.maxLength, 1024 * 1024);
    assert.equal(competitorImport.rows.maxItems, 25);
    assert.equal(competitorImport.rows.items.properties.synonyms.maxItems, 8);
    assert.equal(sequence.steps.minItems, 1);
    assert.equal(sequence.steps.maxItems, 5);
    assert.equal(brief.brandVoiceIds.maxItems, 8);
    assert.equal(brief.competitorIds.maxItems, 25);

    const projectId = server.toolInputSchemaJson("get_project").properties.projectId;
    assert.equal(projectId.pattern, "^[A-Za-z0-9_-]{1,100}$");

    await server.close();
  });

  it("returns machine-readable structured content with the text fallback", async () => {
    const result = await handleError(async () => ({ projects: [{ id: "project_1" }] }));

    assert.deepEqual(result.structuredContent, { projects: [{ id: "project_1" }] });
    assert.match(result.content[0].text, /project_1/);
  });

  it("requires exactly one source for bulk imports", () => {
    const cases = [
      [
        geoPromptImportSchema,
        { projectId: "project_1", rows: [{ prompt: "Which tools help writers?" }] },
        { projectId: "project_1", csv: "prompt\\nWhich tools help writers?" },
      ],
      [
        geoCompetitorImportSchema,
        { projectId: "project_1", rows: [{ name: "Acme" }] },
        { projectId: "project_1", csv: "name\\nAcme" },
      ],
    ];

    for (const [schema, rowsInput, csvInput] of cases) {
      assert.equal(schema.safeParse(rowsInput).success, true);
      assert.equal(schema.safeParse(csvInput).success, true);
      assert.equal(schema.safeParse({ ...rowsInput, ...csvInput }).success, false);
      assert.equal(schema.safeParse({ projectId: "project_1" }).success, false);
    }
  });

  it("rejects unsupported query parameter values at the request boundary", () => {
    const url = new URL("https://api.example.test");

    assert.throws(() => appendQueryParams(url, { nested: { value: "unsupported" } }), /nested/);
  });
});

describe("NotraClient GEO routes", () => {
  const originalFetch = globalThis.fetch;
  let requests;

  beforeEach(() => {
    requests = [];
    globalThis.fetch = async (input, init = {}) => {
      const rawUrl = typeof input === "string" || input instanceof URL ? input : input.url;
      requests.push({ url: new URL(rawUrl), init });
      return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
    };
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("maps every GEO client method to the canonical v1 route", async () => {
    const client = new NotraClient("test-token", "https://api.example.test");
    const projectId = "project_1";
    const window = { days: 30, from: "2026-08-01", to: "2026-08-30" };
    const cases = [
      ["GET", "/v1/projects", {}, undefined, () => client.listProjects()],
      ["POST", "/v1/projects", {}, { name: "Demo" }, () => client.createProject({ name: "Demo" })],
      ["GET", `/v1/projects/${projectId}`, {}, undefined, () => client.getProject(projectId)],
      [
        "PATCH",
        `/v1/projects/${projectId}`,
        {},
        { name: "Renamed" },
        () => client.updateProject(projectId, { name: "Renamed" }),
      ],
      ["DELETE", `/v1/projects/${projectId}`, {}, undefined, () => client.deleteProject(projectId)],
      ["GET", `/v1/projects/${projectId}/geo/settings`, {}, undefined, () => client.getGeoSettings(projectId)],
      [
        "PATCH",
        `/v1/projects/${projectId}/geo/settings`,
        {},
        {
          companyName: "Notra",
          aliases: [],
          languages: ["English"],
          engines: ["engine_1"],
          enforceZdr: false,
          nonZdrApprovedEngines: [],
          enabled: true,
          scanIntervalHours: 24,
        },
        () =>
          client.updateGeoSettings(projectId, {
            companyName: "Notra",
            aliases: [],
            languages: ["English"],
            engines: ["engine_1"],
            enforceZdr: false,
            nonZdrApprovedEngines: [],
            enabled: true,
            scanIntervalHours: 24,
          }),
      ],
      ["GET", `/v1/projects/${projectId}/geo/prompts`, {}, undefined, () => client.listGeoPrompts(projectId)],
      [
        "POST",
        `/v1/projects/${projectId}/geo/prompts`,
        {},
        { prompt: "Which tools help writers?" },
        () => client.createGeoPrompt(projectId, "Which tools help writers?"),
      ],
      [
        "PATCH",
        `/v1/projects/${projectId}/geo/prompts/prompt_1`,
        {},
        { enabled: false },
        () => client.updateGeoPrompt(projectId, "prompt_1", false),
      ],
      [
        "DELETE",
        `/v1/projects/${projectId}/geo/prompts/prompt_1`,
        {},
        undefined,
        () => client.deleteGeoPrompt(projectId, "prompt_1"),
      ],
      [
        "POST",
        `/v1/projects/${projectId}/geo/prompts/import`,
        {},
        { rows: [{ prompt: "Which tools help writers?" }] },
        () => client.importGeoPrompts(projectId, { rows: [{ prompt: "Which tools help writers?" }] }),
      ],
      ["GET", `/v1/projects/${projectId}/geo/sequences`, {}, undefined, () => client.listGeoSequences(projectId)],
      [
        "POST",
        `/v1/projects/${projectId}/geo/sequences`,
        {},
        { name: "Discovery", steps: ["Which tools help writers?"] },
        () => client.createGeoSequence(projectId, { name: "Discovery", steps: ["Which tools help writers?"] }),
      ],
      [
        "PATCH",
        `/v1/projects/${projectId}/geo/sequences/sequence_1`,
        {},
        { enabled: false },
        () => client.updateGeoSequence(projectId, "sequence_1", { enabled: false }),
      ],
      [
        "DELETE",
        `/v1/projects/${projectId}/geo/sequences/sequence_1`,
        {},
        undefined,
        () => client.deleteGeoSequence(projectId, "sequence_1"),
      ],
      [
        "POST",
        `/v1/projects/${projectId}/geo/sequences/sequence_1/run`,
        {},
        undefined,
        () => client.runGeoSequence(projectId, "sequence_1"),
      ],
      ["GET", `/v1/projects/${projectId}/geo/competitors`, {}, undefined, () => client.listGeoCompetitors(projectId)],
      [
        "PUT",
        `/v1/projects/${projectId}/geo/competitors`,
        {},
        { name: "Acme", domain: "acme.test" },
        () => client.upsertGeoCompetitor(projectId, { name: "Acme", domain: "acme.test" }),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/competitors/suggestions`,
        { domain: "example.test" },
        undefined,
        () => client.suggestGeoCompetitors(projectId, "example.test"),
      ],
      [
        "DELETE",
        `/v1/projects/${projectId}/geo/competitors/Acme`,
        {},
        undefined,
        () => client.deleteGeoCompetitor(projectId, "Acme"),
      ],
      [
        "POST",
        `/v1/projects/${projectId}/geo/competitors/import`,
        {},
        { rows: [{ name: "Acme" }] },
        () => client.importGeoCompetitors(projectId, { rows: [{ name: "Acme" }] }),
      ],
      ["POST", `/v1/projects/${projectId}/geo/scans`, {}, undefined, () => client.createGeoScan(projectId)],
      [
        "GET",
        `/v1/projects/${projectId}/geo/scans`,
        { limit: "10", page: "2" },
        undefined,
        () => client.listGeoScans(projectId, { limit: 10, page: 2 }),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/scans/scan_1`,
        {},
        undefined,
        () => client.getGeoScan(projectId, "scan_1"),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/visibility/overview`,
        window,
        undefined,
        () => client.getGeoVisibilityOverview(projectId, window),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/visibility/timeseries`,
        window,
        undefined,
        () => client.getGeoVisibilityTimeseries(projectId, window),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/visibility/prompt-results`,
        window,
        undefined,
        () => client.getGeoVisibilityPromptResults(projectId, window),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/visibility/competitor-share`,
        window,
        undefined,
        () => client.getGeoVisibilityCompetitorShare(projectId, window),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/visibility/language-share`,
        window,
        undefined,
        () => client.getGeoVisibilityLanguageShare(projectId, window),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/visibility/competitors/Acme`,
        window,
        undefined,
        () => client.getGeoVisibilityCompetitorDetail(projectId, "Acme", window),
      ],
      ["GET", `/v1/projects/${projectId}/geo/gaps`, {}, undefined, () => client.listGeoContentGaps(projectId)],
      ["GET", `/v1/projects/${projectId}/geo/briefs`, {}, undefined, () => client.listGeoContentBriefs(projectId)],
      [
        "POST",
        `/v1/projects/${projectId}/geo/briefs`,
        {},
        { topic: "AI writing tools" },
        () => client.planGeoContentBrief(projectId, { topic: "AI writing tools" }),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/briefs/brief_1`,
        {},
        undefined,
        () => client.getGeoContentBrief(projectId, "brief_1"),
      ],
      [
        "POST",
        `/v1/projects/${projectId}/geo/briefs/brief_1/approve`,
        {},
        undefined,
        () => client.approveGeoContentBrief(projectId, "brief_1"),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/agent-readiness`,
        {},
        undefined,
        () => client.getGeoAgentReadiness(projectId),
      ],
      [
        "POST",
        `/v1/projects/${projectId}/geo/agent-readiness/scan`,
        {},
        undefined,
        () => client.startGeoAgentReadinessScan(projectId),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/traffic/overview`,
        window,
        undefined,
        () => client.getGeoTrafficOverview(projectId, window),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/traffic/log`,
        { limit: "25", visitorTypes: "crawler,ai_referral", categories: "search-index" },
        undefined,
        () =>
          client.getGeoTrafficLog(projectId, {
            limit: 25,
            visitorTypes: ["crawler", "ai_referral"],
            categories: ["search-index"],
          }),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/traffic/journeys`,
        { ...window, limit: "5" },
        undefined,
        () => client.listGeoTrafficJourneys(projectId, { ...window, limit: 5 }),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/traffic/journeys/journey_1`,
        window,
        undefined,
        () => client.getGeoTrafficJourney(projectId, "journey_1", window),
      ],
      [
        "GET",
        `/v1/projects/${projectId}/geo/traffic/pages`,
        { ...window, limit: "20", visitorType: "crawler" },
        undefined,
        () => client.listGeoTrafficPages(projectId, { ...window, limit: 20, visitorType: "crawler" }),
      ],
      ["GET", "/v1/geo/ingest/setup", {}, undefined, () => client.getGeoIngestSetup()],
      ["POST", "/v1/geo/ingest/token", { projectId }, undefined, () => client.issueGeoIngestToken(projectId)],
      ["POST", "/v1/geo/ingest/rotate-token", { projectId }, undefined, () => client.rotateGeoIngestToken(projectId)],
    ];

    for (const [method, pathname, query, body, run] of cases) {
      requests.length = 0;
      await run();
      assert.equal(requests.length, 1);

      const request = requests[0];
      assert.equal(request.init.method, method, pathname);
      assert.equal(request.url.pathname, pathname);
      const expectedQuery = Object.fromEntries(Object.entries(query).map(([key, value]) => [key, String(value)]));
      assert.deepEqual(Object.fromEntries(request.url.searchParams), expectedQuery, pathname);
      assert.equal(request.init.headers.Authorization, "Bearer test-token");
      assert.deepEqual(request.init.body ? JSON.parse(request.init.body) : undefined, body, pathname);
    }
  });
});
