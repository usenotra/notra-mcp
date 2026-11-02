import * as z from "zod";
import {
  GEO_CONVERSION_PATH_MAX_LENGTH,
  GEO_MAX_ALIASES,
  GEO_MAX_AUTO_PROMPT_IDS,
  GEO_MAX_CONVERSION_PATHS,
  GEO_MAX_DOMAINS,
  GEO_MAX_ENGINES,
  GEO_MAX_LANGUAGES,
  GEO_SCAN_HOURS_PER_DAY,
  GEO_SCAN_INTERVAL_HOURS,
  GEO_SCAN_MAX_INTERVAL_HOURS,
  GEO_SCAN_MIN_INTERVAL_HOURS,
} from "../constants/geo.js";
import { geoResourceIdSchema, geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const getGeoSettingsSchema = z.object({
  projectId: projectIdSchema,
});

export const listGeoEnginesSchema = z.object({
  projectId: projectIdSchema,
});

export const updateGeoSettingsSchema = z.object({
  projectId: projectIdSchema,
  companyName: geoShortTextSchema.optional().describe("Company or brand name to track in AI answers"),
  aliases: z
    .array(geoShortTextSchema)
    .max(GEO_MAX_ALIASES)
    .optional()
    .describe("Alternative names that also count as a brand mention. Replaces the whole list."),
  domains: z
    .array(geoShortTextSchema)
    .max(GEO_MAX_DOMAINS)
    .optional()
    .describe(
      "Extra hostnames that send AI traffic to this project, besides the brand website, e.g. docs.example.com. Replaces the whole list.",
    ),
  conversionPaths: z
    .array(z.string().trim().min(1).max(GEO_CONVERSION_PATH_MAX_LENGTH).startsWith("/"))
    .max(GEO_MAX_CONVERSION_PATHS)
    .optional()
    .describe("Paths that count as a conversion when an AI referral reaches them, prefix match, e.g. /signup"),
  languages: z
    .array(geoShortTextSchema)
    .min(1)
    .max(GEO_MAX_LANGUAGES)
    .optional()
    .describe("Languages to run prompts in. The language the prompts are written in always stays tracked."),
  engines: z
    .array(geoShortTextSchema)
    .min(1)
    .max(GEO_MAX_ENGINES)
    .optional()
    .describe("Answer engine IDs from list_geo_engines. Replaces the whole list."),
  enforceZdr: z.boolean().optional().describe("Restrict scanning to zero-data-retention engines"),
  nonZdrApprovedEngines: z
    .array(geoShortTextSchema)
    .max(GEO_MAX_ENGINES)
    .optional()
    .describe("Engines explicitly approved despite not being zero-data-retention"),
  trackWithoutSearch: z.boolean().optional().describe("Also scan search-capable models without web search"),
  pausedAutoPromptIds: z
    .array(geoResourceIdSchema)
    .max(GEO_MAX_AUTO_PROMPT_IDS)
    .optional()
    .describe("IDs of auto-generated prompts (from list_geo_prompts) to skip in scans. Replaces the whole list."),
  removedAutoPromptIds: z
    .array(geoResourceIdSchema)
    .max(GEO_MAX_AUTO_PROMPT_IDS)
    .optional()
    .describe("IDs of auto-generated prompts removed from tracking. Replaces the whole list."),
  enabled: z.boolean().optional().describe("Whether recurring scans are enabled"),
  scanIntervalHours: z
    .number()
    .int()
    .min(GEO_SCAN_MIN_INTERVAL_HOURS)
    .max(GEO_SCAN_MAX_INTERVAL_HOURS)
    .multipleOf(GEO_SCAN_HOURS_PER_DAY)
    .optional()
    .describe(
      `Hours between recurring scans, whole days from ${GEO_SCAN_MIN_INTERVAL_HOURS} to ${GEO_SCAN_MAX_INTERVAL_HOURS}. Common values: ${GEO_SCAN_INTERVAL_HOURS.join(", ")}`,
    ),
});
