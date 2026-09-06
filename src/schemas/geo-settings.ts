import * as z from "zod";
import { GEO_MAX_ENGINES, GEO_SCAN_INTERVAL_HOURS } from "../constants/geo.js";
import { geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const getGeoSettingsSchema = z.object({
  projectId: projectIdSchema,
});

export const updateGeoSettingsSchema = z.object({
  projectId: projectIdSchema,
  companyName: geoShortTextSchema.describe("Company or brand name to track in AI answers"),
  aliases: z.array(geoShortTextSchema).max(10).describe("Alternative names that also count as a brand mention"),
  languages: z.array(geoShortTextSchema).min(1).max(4).describe("Languages to run prompts in"),
  engines: z
    .array(geoShortTextSchema)
    .min(1)
    .max(GEO_MAX_ENGINES)
    .describe("Answer engine IDs from the organization's model catalog"),
  enforceZdr: z.boolean().describe("Restrict scanning to zero-data-retention engines"),
  nonZdrApprovedEngines: z
    .array(geoShortTextSchema)
    .max(GEO_MAX_ENGINES)
    .describe("Engines explicitly approved despite not being zero-data-retention"),
  enabled: z.boolean().describe("Whether recurring scans are enabled"),
  scanIntervalHours: z
    .union(GEO_SCAN_INTERVAL_HOURS.map((hours) => z.literal(hours)))
    .describe(`Hours between recurring scans: ${GEO_SCAN_INTERVAL_HOURS.join(", ")}`),
});
