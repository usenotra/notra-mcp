import * as z from "zod";
import { GEO_COMPETITOR_KIND_VALUES, GEO_COMPETITOR_MAX_SYNONYMS } from "../constants/geo.js";
import { apiResponsePropertySchema } from "../utils/output-schema.js";
import { geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoCompetitorsSchema = z.object({
  projectId: projectIdSchema,
});

export const upsertGeoCompetitorSchema = z.object({
  projectId: projectIdSchema,
  name: geoShortTextSchema.describe("Competitor brand name"),
  previousName: geoShortTextSchema
    .optional()
    .describe(
      "The competitor's existing name, when renaming it to name. Omit when creating a competitor or updating one without renaming.",
    ),
  domain: z.string().max(128).nullable().describe("Competitor website domain, or null if unknown"),
  synonyms: z
    .array(geoShortTextSchema)
    .max(GEO_COMPETITOR_MAX_SYNONYMS)
    .optional()
    .describe("Alternative names that count as a mention"),
  kind: z.enum(GEO_COMPETITOR_KIND_VALUES).optional().describe("Whether the competitor is direct or indirect"),
  color: z
    .string()
    .max(128)
    .nullable()
    .optional()
    .describe(
      "Color for this competitor in Notra dashboard charts, as a hex code such as #2563eb. Omit to keep the current color.",
    ),
});

export const suggestGeoCompetitorsSchema = z.object({
  projectId: projectIdSchema,
  domain: geoShortTextSchema.describe("Website domain to find competitors for, e.g. example.com"),
});

export const deleteGeoCompetitorSchema = z.object({
  projectId: projectIdSchema,
  name: geoShortTextSchema.describe("Competitor name to remove"),
});

const geoCompetitorSchema = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.string().nullable(),
  synonyms: z.array(z.string()),
  kind: z.enum(GEO_COMPETITOR_KIND_VALUES),
  color: z.string().nullable(),
});

export const upsertGeoCompetitorOutputSchema = z.object({
  competitor: geoCompetitorSchema.nullable().describe("The created or updated competitor"),
  totalCompetitors: z.number().int().describe("Competitors tracked for the project after this change"),
  organization: apiResponsePropertySchema("upsertGeoCompetitor", "organization"),
});

export const deleteGeoCompetitorOutputSchema = z.object({
  deleted: z.string().describe("Name of the competitor that is no longer tracked"),
  totalCompetitors: z.number().int().describe("Competitors tracked for the project after this change"),
  organization: apiResponsePropertySchema("deleteGeoCompetitor", "organization"),
});
