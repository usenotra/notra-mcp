import * as z from "zod";
import { GEO_TRAFFIC_CATEGORY_VALUES, GEO_TRAFFIC_VISITOR_TYPE_VALUES } from "../constants/geo.js";
import { GEO_ANALYTICS_PATH_MAX_LENGTH, GEO_TRAFFIC_SITES_VALUES } from "../constants/geo.js";
import { geoResourceIdSchema, geoShortTextSchema, geoWindowShape, projectIdSchema } from "./geo-fields.js";

const geoTrafficWindowShape = {
  ...geoWindowShape,
  days: geoWindowShape.days.describe(
    "Rolling reporting window in days, ending today. Ignored when from is set. Omit days and from for the last 30 days.",
  ),
};

const geoMcpWindowShape = {
  ...geoWindowShape,
  days: geoWindowShape.days.describe(
    "Rolling reporting window in days, ending today. Ignored when from is set. Omit days and from for the last 14 days.",
  ),
};

/** The host, page and Notra Sites filters the dashboard's Analytics tab offers. */
const geoTrafficFilterShape = {
  host: geoShortTextSchema
    .optional()
    .describe("Only count this hostname, such as www.example.com. Subdomains are included. Omit for every host."),
  path: z
    .string()
    .trim()
    .startsWith("/")
    .max(GEO_ANALYTICS_PATH_MAX_LENGTH)
    .optional()
    .describe("Only count this exact page path, such as /pricing. Omit for every page."),
  sites: z
    .enum(GEO_TRAFFIC_SITES_VALUES)
    .optional()
    .describe("Leaves out traffic to sites hosted on Notra Sites. Omit to include that traffic."),
};

export const getGeoTrafficOverviewSchema = z.object({
  projectId: projectIdSchema,
  ...geoTrafficWindowShape,
  ...geoTrafficFilterShape,
});

export const getGeoTrafficLogSchema = z.object({
  projectId: projectIdSchema,
  limit: z
    .number()
    .int()
    .min(1)
    .max(200)
    .optional()
    .describe("Number of most recent events to return. Defaults to 50."),
  visitorTypes: z
    .array(z.enum(GEO_TRAFFIC_VISITOR_TYPE_VALUES))
    .max(3)
    .optional()
    .describe(
      "Visitor types to include: crawler for AI bots fetching pages, ai_referral for people who clicked through from an AI answer. Omit for both.",
    ),
  categories: z
    .array(z.enum(GEO_TRAFFIC_CATEGORY_VALUES))
    .max(3)
    .optional()
    .describe(
      "Crawler categories to include: training-crawler collects model training data, search-index builds an AI search index, assistant-browse fetches pages live while answering. Omit for all.",
    ),
});

export const listGeoTrafficJourneysSchema = z.object({
  projectId: projectIdSchema,
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("Number of journeys to return, most recent first. Defaults to 25."),
  ...geoTrafficWindowShape,
});

export const getGeoTrafficJourneySchema = z.object({
  projectId: projectIdSchema,
  journeyId: z
    .string()
    .min(1)
    .max(128)
    .describe("journeyId from list_geo_traffic_journeys or from a get_geo_traffic_log event"),
  ...geoTrafficWindowShape,
});

export const listGeoTrafficPagesSchema = z.object({
  projectId: projectIdSchema,
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe("Number of top pages to return, ranked by visits. Defaults to 20."),
  visitorType: z
    .enum(GEO_TRAFFIC_VISITOR_TYPE_VALUES)
    .optional()
    .describe(
      "Only count crawler (AI bots fetching pages) or ai_referral (people who clicked through from an AI answer) visits. Omit for both.",
    ),
  ...geoTrafficWindowShape,
});

export const getGeoIngestSetupSchema = z.object({
  projectId: projectIdSchema
    .optional()
    .describe(
      "Project whose notra.js web key to return, from list_projects. Omit for the organization's oldest project.",
    ),
});

export const getGeoWebAnalyticsSchema = z.object({
  projectId: projectIdSchema,
  ...geoTrafficWindowShape,
  ...geoTrafficFilterShape,
});

export const getGeoWebAnalyticsUtmSchema = z.object({
  projectId: projectIdSchema,
  dimension: z
    .enum(["source", "medium", "campaign", "term", "content"])
    .describe("UTM parameter to break sessions down by"),
  ...geoTrafficWindowShape,
  ...geoTrafficFilterShape,
});

export const getGeoTrafficJourneyStatsSchema = z.object({
  projectId: projectIdSchema,
  ...geoTrafficWindowShape,
});

export const geoProjectOnlySchema = z.object({ projectId: projectIdSchema });

export const getGeoMcpAnalyticsSchema = z.object({
  projectId: projectIdSchema,
  ...geoMcpWindowShape,
});

export const getGeoMcpToolAnalyticsSchema = z.object({
  projectId: projectIdSchema,
  toolName: geoShortTextSchema.describe("Tool name as your MCP server registers it (see get_geo_mcp_analytics)"),
  ...geoMcpWindowShape,
});
