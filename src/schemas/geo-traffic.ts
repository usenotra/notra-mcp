import * as z from "zod";
import { GEO_TRAFFIC_CATEGORY_VALUES, GEO_TRAFFIC_VISITOR_TYPE_VALUES } from "../constants/geo.js";
import { GEO_ANALYTICS_PATH_MAX_LENGTH, GEO_TRAFFIC_SITES_VALUES } from "../constants/geo.js";
import { geoResourceIdSchema, geoShortTextSchema, geoWindowShape, projectIdSchema } from "./geo-fields.js";

/** The host, page and Notra Sites filters the dashboard's Analytics tab offers. */
const geoTrafficFilterShape = {
  host: geoShortTextSchema
    .optional()
    .describe("Only count this hostname, such as www.example.com. Subdomains are included."),
  path: z
    .string()
    .trim()
    .startsWith("/")
    .max(GEO_ANALYTICS_PATH_MAX_LENGTH)
    .optional()
    .describe("Only count this exact page path, such as /pricing"),
  sites: z
    .enum(GEO_TRAFFIC_SITES_VALUES)
    .optional()
    .describe("exclude leaves out traffic to sites hosted on Notra Sites"),
};

export const getGeoTrafficOverviewSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
  ...geoTrafficFilterShape,
});

export const getGeoTrafficLogSchema = z.object({
  projectId: projectIdSchema,
  limit: z.number().int().min(1).max(200).optional().describe("Maximum events to return (1-200)"),
  visitorTypes: z
    .array(z.enum(GEO_TRAFFIC_VISITOR_TYPE_VALUES))
    .max(3)
    .optional()
    .describe("Filter to crawler and/or ai_referral traffic"),
  categories: z.array(z.enum(GEO_TRAFFIC_CATEGORY_VALUES)).max(3).optional().describe("Filter by crawler category"),
});

export const listGeoTrafficJourneysSchema = z.object({
  projectId: projectIdSchema,
  limit: z.number().int().min(1).max(100).optional().describe("Maximum journeys to return (1-100)"),
  ...geoWindowShape,
});

export const getGeoTrafficJourneySchema = z.object({
  projectId: projectIdSchema,
  journeyId: z.string().min(1).max(128).describe("The journey ID from list_geo_traffic_journeys"),
  ...geoWindowShape,
});

export const listGeoTrafficPagesSchema = z.object({
  projectId: projectIdSchema,
  limit: z.number().int().min(1).max(500).optional().describe("Maximum pages to return (1-500)"),
  visitorType: z.enum(GEO_TRAFFIC_VISITOR_TYPE_VALUES).optional().describe("Filter to crawler or ai_referral traffic"),
  ...geoWindowShape,
});

export const getGeoIngestSetupSchema = z.object({
  projectId: projectIdSchema
    .optional()
    .describe("Return the notra.js web key for this project. Omit for the organization-wide key."),
});

export const getGeoWebAnalyticsSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
  ...geoTrafficFilterShape,
});

export const getGeoTrafficJourneyStatsSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const geoProjectOnlySchema = z.object({ projectId: projectIdSchema });

export const getGeoMcpAnalyticsSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoMcpToolAnalyticsSchema = z.object({
  projectId: projectIdSchema,
  toolName: geoShortTextSchema.describe("Tool name as your MCP server registers it (see get_geo_mcp_analytics)"),
  ...geoWindowShape,
});
