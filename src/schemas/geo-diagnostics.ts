import * as z from "zod";
import { apiResponsePropertySchema } from "../utils/output-schema.js";
import { geoResourceIdSchema, geoWindowShape, projectIdSchema } from "./geo-fields.js";

export const getGeoSnapshotSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoChangesSchema = z.object({ projectId: projectIdSchema });

export const getGeoPromptHistorySchema = z.object({
  projectId: projectIdSchema,
  promptId: geoResourceIdSchema,
  scanId: geoResourceIdSchema.optional(),
});

export const getGeoSentimentSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoSentimentAnalysisSchema = getGeoSentimentSchema;

export const listGeoSentimentEvidenceSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
  cursor: z.string().min(1).max(4096).optional(),
});

export const listGeoShelfSourcesSchema = z.object({
  projectId: projectIdSchema,
  offset: z.number().int().min(0).max(100_000).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

const readinessReportStatusSchema = apiResponsePropertySchema("getGeoAgentReadiness", "report", "status");

export const geoSnapshotOutputSchema = z.object({
  generatedAt: z.string().describe("ISO 8601 timestamp of when the snapshot was assembled"),
  window: z.object(geoWindowShape),
  visibility: z.object({
    configured: z.boolean(),
    checks: z.number(),
    mentions: z.number(),
    mentionRate: z.number(),
    citations: z.number(),
    visibility: z.number(),
    visibilityRate: z.number(),
    avgPosition: z.number().nullable(),
    engines: apiResponsePropertySchema("getGeoVisibilityOverview", "engines"),
  }),
  sentiment: apiResponsePropertySchema("getGeoSentiment", "summary").nullable(),
  changes: apiResponsePropertySchema("listGeoChanges", "summary").nullable(),
  competitors: z
    .object({
      tracked: z.number(),
      leaders: apiResponsePropertySchema("getGeoVisibilityCompetitorShare", "points"),
    })
    .nullable(),
  contentGaps: z
    .object({
      hasScanData: z.boolean(),
      promptGapCount: z.number(),
      searchGapCount: z.number(),
      topPromptGaps: apiResponsePropertySchema("listGeoContentGaps", "promptGaps"),
      topSearchGaps: apiResponsePropertySchema("listGeoContentGaps", "searchGaps"),
    })
    .nullable(),
  shelf: z
    .object({
      returnedSources: z.number(),
      hasMore: z.boolean(),
      topSources: apiResponsePropertySchema("listGeoShelfSources", "sources"),
    })
    .nullable(),
  agentReadiness: z
    .object({
      targetUrl: z.string(),
      status: z.union([readinessReportStatusSchema, z.literal("not_scanned")]),
      score: z.number().nullable(),
      scoreLabel: z.string().nullable(),
      topIssues: apiResponsePropertySchema("getGeoAgentReadiness", "report", "issues"),
    })
    .nullable(),
  traffic: z
    .object({
      configured: z.boolean(),
      totals: apiResponsePropertySchema("getGeoTrafficOverview", "totals"),
      topSources: apiResponsePropertySchema("getGeoTrafficOverview", "sources"),
    })
    .nullable(),
  recommendedNextActions: z.array(
    z.object({
      priority: z.enum(["high", "medium", "low"]),
      action: z.string(),
      reason: z.string(),
    }),
  ),
  warnings: z.array(z.object({ section: z.string(), message: z.string() })),
  organization: apiResponsePropertySchema("getGeoVisibilityOverview", "organization"),
});
