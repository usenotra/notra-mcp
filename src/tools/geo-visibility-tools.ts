import {
  getGeoVisibilityOverviewSchema,
  getGeoVisibilityTimeseriesSchema,
  getGeoPromptResultDetailSchema,
  getGeoCompetitorShareSchema,
  geoCompetitorShareOutputSchema,
  getGeoLanguageShareSchema,
  getGeoCompetitorDetailSchema,
  listGeoPromptResultSummariesSchema,
} from "../schemas/geo-visibility.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { summarizeCompetitorShare } from "../utils/geo-competitor-share.js";
import { handleError } from "../utils/mcp.js";
import { chartView } from "../utils/views.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoVisibilityTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "get_geo_visibility_overview",
      description:
        "Get GEO mention rates per answer engine for every engine the project tracks. Returns per engine: checks, mentions, mention rate, citations, visibility rate, average position and last check time.",
      annotations: {
        title: "Get GEO Visibility Overview",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoVisibilityOverviewSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoVisibilityOverview")),
      ...chartView(
        "geo-visibility-overview",
        "Mention rate per AI engine",
        "Loading engine visibility",
        "Engine visibility ready",
      ),
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoVisibilityOverview(projectId, params)),
  );

  server.tool(
    {
      name: "get_geo_visibility_timeseries",
      description:
        "Get daily GEO visibility per answer engine, one point per day and engine, with checks, mentions, citations, visibility and average position.",
      annotations: {
        title: "Get GEO Visibility Timeseries",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoVisibilityTimeseriesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoVisibilityTimeseries")),
      ...chartView(
        "geo-visibility-trend",
        "Daily AI mention trend across engines",
        "Loading visibility trend",
        "Visibility trend ready",
      ),
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoVisibilityTimeseries(projectId, params)),
  );

  server.tool(
    {
      name: "list_geo_prompt_result_summaries",
      description:
        "List filtered, paginated GEO prompt results without full answer text or sources. Use checkId with get_geo_prompt_result_detail.",
      annotations: {
        title: "List GEO Prompt Result Summaries",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoPromptResultSummariesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoPromptResultSummaries")),
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoPromptResultSummaries(projectId, params)),
  );

  server.tool(
    {
      name: "get_geo_prompt_result_detail",
      description:
        "Get the full record of one GEO check: prompt, engine, complete answer text, whether the brand was mentioned or an owned source cited, position, sentiment, competitors named, search queries the engine ran, grounding sources, and token counts with truncation info.",
      annotations: {
        title: "Get GEO Prompt Result Detail",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoPromptResultDetailSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoPromptResultDetail")),
    },
    ({ projectId, checkId }) => handleError(() => client.getGeoPromptResultDetail(projectId, checkId)),
  );

  server.tool(
    {
      name: "get_geo_competitor_share",
      description:
        "Get GEO share of voice: the top brands by mentions with their share of all mentions, plus a summary of the remaining brands. Filter with brands, cap with limit, and set includeTrends for daily trends of the returned brands.",
      annotations: {
        title: "Get GEO Competitor Share",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoCompetitorShareSchema),
      outputSchema: shareJsonSchema(geoCompetitorShareOutputSchema),
      ...chartView(
        "geo-share-of-voice",
        "Share of voice donut and brand trend",
        "Loading share of voice",
        "Share of voice ready",
      ),
    },
    ({ projectId, brands, limit, includeTrends, ...window }) =>
      handleError(async () =>
        summarizeCompetitorShare(await client.getGeoVisibilityCompetitorShare(projectId, window), {
          brands,
          limit,
          includeTrends,
        }),
      ),
  );

  server.tool(
    {
      name: "get_geo_language_share",
      description:
        "Get GEO visibility broken down by tracked language. Returns per language: checks, mentions, mention rate, citations, visibility rate, average position and a daily trend.",
      annotations: {
        title: "Get GEO Language Share",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoLanguageShareSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoVisibilityLanguageShare")),
      ...chartView("geo-language-share", "Mention rate per prompt language", "Loading languages", "Languages ready"),
    },
    ({ projectId, ...params }) => handleError(() => client.getGeoVisibilityLanguageShare(projectId, params)),
  );

  server.tool(
    {
      name: "get_geo_competitor_detail",
      description:
        "Get one competitor's GEO mention history. Returns daily mentions and checks plus the prompts that produced them, with engine, capture time, whether the competitor was mentioned and its position. Use the brand names reported by get_geo_competitor_share.",
      annotations: {
        title: "Get GEO Competitor Detail",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoCompetitorDetailSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoVisibilityCompetitorDetail")),
      ...chartView(
        "geo-competitor-detail",
        "Daily mentions and recent prompts for one brand",
        "Loading competitor",
        "Competitor ready",
      ),
    },
    ({ projectId, brand, ...params }) =>
      handleError(() => client.getGeoVisibilityCompetitorDetail(projectId, brand, params)),
  );
}
