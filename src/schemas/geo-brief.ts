import * as z from "zod";
import { GEO_BRIEF_SOURCE_KIND_VALUES, GEO_CONTENT_SUBTYPE_VALUES, GEO_MAX_COMPETITORS } from "../constants/geo.js";
import { geoResourceIdSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoContentGapsSchema = z.object({
  projectId: projectIdSchema,
});

export const listGeoContentBriefsSchema = z.object({
  projectId: projectIdSchema,
});

export const planGeoContentBriefSchema = z.object({
  projectId: projectIdSchema,
  topic: z.string().trim().min(3).max(200).describe("Topic to research and brief (3-200 characters)"),
  autoApprove: z.boolean().optional().describe("Approve the brief immediately and start the writer (default false)"),
  contentSubtype: z.enum(GEO_CONTENT_SUBTYPE_VALUES).optional().describe("Article format to plan for"),
  brandVoiceIds: z
    .array(geoResourceIdSchema)
    .max(8)
    .optional()
    .describe("Brand voice IDs to write with; only the first is used"),
  competitorIds: z
    .array(geoResourceIdSchema)
    .max(GEO_MAX_COMPETITORS)
    .optional()
    .describe("Competitor IDs to position against"),
  sitemapId: geoResourceIdSchema.optional().describe("Sitemap ID to source internal links from"),
  sourceKind: z
    .enum(GEO_BRIEF_SOURCE_KIND_VALUES)
    .optional()
    .describe("What the brief was created from (e.g. a gap row from list_geo_content_gaps)"),
  sourceId: z.string().min(1).optional().describe("ID of the source row when sourceKind is gap/prompt/search_console"),
});

export const getGeoContentBriefSchema = z.object({
  projectId: projectIdSchema,
  briefId: geoResourceIdSchema.describe("The brief ID to retrieve"),
});

export const approveGeoContentBriefSchema = z.object({
  projectId: projectIdSchema,
  briefId: geoResourceIdSchema.describe("The brief ID to approve"),
});
