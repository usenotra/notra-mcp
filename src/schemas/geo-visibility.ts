import * as z from "zod";
import { GEO_PICK_REASONS } from "../constants/geo-pick-reasons.js";
import {
  GEO_COMPETITOR_SHARE_DEFAULT_LIMIT,
  GEO_COMPETITOR_SHARE_MAX_LIMIT,
  GEO_MAX_COMPETITORS,
} from "../constants/geo.js";
import { apiResponsePropertySchema } from "../utils/output-schema.js";
import { geoResourceIdSchema, geoShortTextSchema, geoWindowShape, projectIdSchema } from "./geo-fields.js";

export const getGeoVisibilityOverviewSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoVisibilityTimeseriesSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const listGeoPromptResultSummariesSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
  cursor: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .describe("nextCursor from the previous list_geo_prompt_result_summaries response. Omit for the first page."),
  limit: z.number().int().min(1).max(100).default(20).describe("Number of prompt results per page"),
  engine: geoShortTextSchema
    .optional()
    .describe("Only results from this answer engine ID, as listed by list_geo_engines"),
  mentioned: z.boolean().optional().describe("true for answers that mention the brand, false for answers that do not"),
  query: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .optional()
    .describe("Only return results whose prompt text contains this phrase"),
});

export const getGeoPromptResultDetailSchema = z.object({
  projectId: projectIdSchema,
  checkId: geoResourceIdSchema.describe(
    "Check ID: a checkId from list_geo_prompt_result_summaries or a checks[].id from get_geo_prompt_history",
  ),
});

export const getGeoCompetitorShareSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
  brands: z
    .array(geoShortTextSchema)
    .min(1)
    .max(GEO_MAX_COMPETITORS)
    .optional()
    .describe("Only return these brands, matched case-insensitively"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(GEO_COMPETITOR_SHARE_MAX_LIMIT)
    .default(GEO_COMPETITOR_SHARE_DEFAULT_LIMIT)
    .describe("Maximum number of brands to return, ranked by mentions. The rest are summarized in otherBrands."),
  includeTrends: z
    .boolean()
    .default(false)
    .describe("Include per-brand daily trends and the daily timeseries for the returned brands"),
});

const geoBrandShareSchema = z.object({
  mentions: z.number().int(),
  share: z.number().describe("Fraction of all brand mentions in the window, 0 to 1"),
});

export const geoCompetitorShareOutputSchema = z.object({
  configured: z.boolean(),
  totalBrands: z.number().int().describe("Number of brands mentioned in the window"),
  totalMentions: z.number().int().describe("Mentions across all brands in the window"),
  points: z.array(
    geoBrandShareSchema.extend({
      brand: z.string(),
      trend: z.array(z.object({ day: z.string(), value: z.number() })).optional(),
    }),
  ),
  otherBrands: geoBrandShareSchema.extend({
    count: z.number().int().describe("Brands not returned in points"),
  }),
  timeseries: apiResponsePropertySchema("getGeoVisibilityCompetitorShare", "timeseries").optional(),
  organization: apiResponsePropertySchema("getGeoVisibilityCompetitorShare", "organization"),
});

export const getGeoLanguageShareSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoCompetitorDetailSchema = z.object({
  projectId: projectIdSchema,
  brand: geoShortTextSchema.describe("Competitor brand name as reported by get_geo_competitor_share"),
  ...geoWindowShape,
});

export const getGeoPickReasonsSchema = z.object({
  projectId: projectIdSchema,
  brand: geoShortTextSchema
    .optional()
    .describe(
      "Only this brand. Your company name returns your own brand; a competitor name also matches its synonyms and spellings that differ only in punctuation.",
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(200)
    .optional()
    .describe("Most brands to return, your own included. Defaults to 25."),
  ...geoWindowShape,
});

export const listGeoPickReasonEvidenceSchema = z.object({
  projectId: projectIdSchema,
  brand: geoShortTextSchema.describe(
    "Brand as reported by get_geo_pick_reasons; your company name reads your own brand.",
  ),
  reason: z.enum(GEO_PICK_REASONS).describe("Reason to show answers for."),
  engine: geoShortTextSchema
    .optional()
    .describe("Only answers from this engine ID or engine family, such as claude or chatgpt. Omit for all engines."),
  ...geoWindowShape,
});
