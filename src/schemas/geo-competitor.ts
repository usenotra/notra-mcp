import * as z from "zod";
import { GEO_COMPETITOR_KIND_VALUES, GEO_COMPETITOR_MAX_SYNONYMS } from "../constants/geo.js";
import { geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoCompetitorsSchema = z.object({
  projectId: projectIdSchema,
});

export const upsertGeoCompetitorSchema = z.object({
  projectId: projectIdSchema,
  name: geoShortTextSchema.describe("Competitor brand name"),
  previousName: geoShortTextSchema.optional().describe("Current name when renaming an existing competitor"),
  domain: z.string().max(128).nullable().describe("Competitor website domain, or null if unknown"),
  synonyms: z
    .array(geoShortTextSchema)
    .max(GEO_COMPETITOR_MAX_SYNONYMS)
    .optional()
    .describe("Alternative names that count as a mention"),
  kind: z.enum(GEO_COMPETITOR_KIND_VALUES).optional().describe("Whether the competitor is direct or indirect"),
  color: z.string().max(128).nullable().optional().describe("Display color used in dashboard charts"),
});

export const suggestGeoCompetitorsSchema = z.object({
  projectId: projectIdSchema,
  domain: geoShortTextSchema.describe("Website domain to find competitors for, e.g. example.com"),
});

export const deleteGeoCompetitorSchema = z.object({
  projectId: projectIdSchema,
  name: geoShortTextSchema.describe("Competitor name to remove"),
});
