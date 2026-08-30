import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { geoShortTextSchema, geoWindowShape, projectIdSchema } from "../schemas/geo-fields.js";
import { handleError } from "../utils/mcp.js";

export function registerGeoVisibilityTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_geo_visibility_overview",
    {
      description:
        "Get GEO mention rates per answer engine: checks, mentions and average position for every engine the project tracks",
      annotations: { title: "Get GEO Visibility Overview", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        ...geoWindowShape,
      }),
    },
    async ({ projectId, ...params }) => {
      return handleError(() => client.getGeoVisibilityOverview(projectId, params));
    },
  );

  server.registerTool(
    "get_geo_visibility_timeseries",
    {
      description: "Get daily GEO mention counts per answer engine, one point per day and engine",
      annotations: { title: "Get GEO Visibility Timeseries", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        ...geoWindowShape,
      }),
    },
    async ({ projectId, ...params }) => {
      return handleError(() => client.getGeoVisibilityTimeseries(projectId, params));
    },
  );

  server.registerTool(
    "get_geo_prompt_results",
    {
      description:
        "Get the latest stored answer per tracked prompt and engine: answer text, mention position, sentiment and grounding sources",
      annotations: { title: "Get GEO Prompt Results", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        ...geoWindowShape,
      }),
    },
    async ({ projectId, ...params }) => {
      return handleError(() => client.getGeoVisibilityPromptResults(projectId, params));
    },
  );

  server.registerTool(
    "get_geo_competitor_share",
    {
      description:
        "Get GEO share of voice across tracked brands: mention counts per brand with per-brand trends and the daily timeseries behind them",
      annotations: { title: "Get GEO Competitor Share", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        ...geoWindowShape,
      }),
    },
    async ({ projectId, ...params }) => {
      return handleError(() => client.getGeoVisibilityCompetitorShare(projectId, params));
    },
  );

  server.registerTool(
    "get_geo_language_share",
    {
      description: "Get GEO mention rates broken down by tracked language",
      annotations: { title: "Get GEO Language Share", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        ...geoWindowShape,
      }),
    },
    async ({ projectId, ...params }) => {
      return handleError(() => client.getGeoVisibilityLanguageShare(projectId, params));
    },
  );

  server.registerTool(
    "get_geo_competitor_detail",
    {
      description:
        "Get one competitor's GEO mention history: daily mentions and the prompts that produced them. Use the brand names reported by get_geo_competitor_share.",
      annotations: { title: "Get GEO Competitor Detail", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        brand: geoShortTextSchema.describe("Competitor brand name as reported by get_geo_competitor_share"),
        ...geoWindowShape,
      }),
    },
    async ({ projectId, brand, ...params }) => {
      return handleError(() => client.getGeoVisibilityCompetitorDetail(projectId, brand, params));
    },
  );
}
