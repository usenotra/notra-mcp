import {
  getGeoVisibilityOverviewSchema,
  getGeoVisibilityTimeseriesSchema,
  getGeoPromptResultsSchema,
  getGeoPromptResultDetailSchema,
  getGeoCompetitorShareSchema,
  getGeoLanguageShareSchema,
  getGeoCompetitorDetailSchema,
  listGeoPromptResultSummariesSchema,
} from "../schemas/geo-visibility.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoVisibilityTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_geo_visibility_overview",
    {
      description:
        "Get GEO mention rates per answer engine: checks, mentions and average position for every engine the project tracks",
      annotations: { title: "Get GEO Visibility Overview", readOnlyHint: true },
      inputSchema: getGeoVisibilityOverviewSchema,
      outputSchema: apiOutputSchema("getGeoVisibilityOverview"),
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoVisibilityOverview(projectId, params)),
  );

  server.registerTool(
    "get_geo_visibility_timeseries",
    {
      description: "Get daily GEO mention counts per answer engine, one point per day and engine",
      annotations: { title: "Get GEO Visibility Timeseries", readOnlyHint: true },
      inputSchema: getGeoVisibilityTimeseriesSchema,
      outputSchema: apiOutputSchema("getGeoVisibilityTimeseries"),
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoVisibilityTimeseries(projectId, params)),
  );

  server.registerTool(
    "get_geo_prompt_results",
    {
      description:
        "Get every latest stored answer per tracked prompt and engine. This can be large; prefer list_geo_prompt_result_summaries and targeted detail.",
      annotations: { title: "Get GEO Prompt Results", readOnlyHint: true },
      inputSchema: getGeoPromptResultsSchema,
      outputSchema: apiOutputSchema("getGeoVisibilityPromptResults"),
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoVisibilityPromptResults(projectId, params)),
  );

  server.registerTool(
    "list_geo_prompt_result_summaries",
    {
      description:
        "List filtered, paginated GEO prompt results without full answer text or sources. Use checkId with get_geo_prompt_result_detail.",
      annotations: { title: "List GEO Prompt Result Summaries", readOnlyHint: true },
      inputSchema: listGeoPromptResultSummariesSchema,
      outputSchema: apiOutputSchema("listGeoPromptResultSummaries"),
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoPromptResultSummaries(projectId, params)),
  );

  server.registerTool(
    "get_geo_prompt_result_detail",
    {
      description: "Get the full answer, grounding sources and token metadata for one GEO check",
      annotations: { title: "Get GEO Prompt Result Detail", readOnlyHint: true },
      inputSchema: getGeoPromptResultDetailSchema,
      outputSchema: apiOutputSchema("getGeoPromptResultDetail"),
    },
    ({ projectId, checkId }) => handleError(() => client.getGeoPromptResultDetail(projectId, checkId)),
  );

  server.registerTool(
    "get_geo_competitor_share",
    {
      description:
        "Get GEO share of voice across tracked brands: mention counts per brand with per-brand trends and the daily timeseries behind them",
      annotations: { title: "Get GEO Competitor Share", readOnlyHint: true },
      inputSchema: getGeoCompetitorShareSchema,
      outputSchema: apiOutputSchema("getGeoVisibilityCompetitorShare"),
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoVisibilityCompetitorShare(projectId, params)),
  );

  server.registerTool(
    "get_geo_language_share",
    {
      description: "Get GEO mention rates broken down by tracked language",
      annotations: { title: "Get GEO Language Share", readOnlyHint: true },
      inputSchema: getGeoLanguageShareSchema,
      outputSchema: apiOutputSchema("getGeoVisibilityLanguageShare"),
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoVisibilityLanguageShare(projectId, params)),
  );

  server.registerTool(
    "get_geo_competitor_detail",
    {
      description:
        "Get one competitor's GEO mention history: daily mentions and the prompts that produced them. Use the brand names reported by get_geo_competitor_share.",
      annotations: { title: "Get GEO Competitor Detail", readOnlyHint: true },
      inputSchema: getGeoCompetitorDetailSchema,
      outputSchema: apiOutputSchema("getGeoVisibilityCompetitorDetail"),
    },
    ({ projectId, brand, ...params }) =>
      handleError(() => client.getGeoVisibilityCompetitorDetail(projectId, brand, params)),
  );
}
