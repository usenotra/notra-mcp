import * as z from "zod";
import { GEO_TRAFFIC_CATEGORY_VALUES, GEO_TRAFFIC_VISITOR_TYPE_VALUES } from "../constants/geo.js";
import { geoResourceIdSchema, geoWindowShape, projectIdSchema } from "./geo-fields.js";

export const getGeoTrafficOverviewSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
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

export const getGeoIngestSetupSchema = z.object({});

export const issueGeoIngestTokenSchema = z.object({
  projectId: geoResourceIdSchema
    .optional()
    .describe("Bind the token to one project. Omit to track the whole organization."),
});

export const rotateGeoIngestTokenSchema = z.object({
  projectId: geoResourceIdSchema
    .optional()
    .describe("Bind the new token to one project. Omit to track the whole organization."),
});
