import * as z from "zod";
import {
  GEO_COMPETITOR_KIND_VALUES,
  GEO_COMPETITOR_MAX_SYNONYMS,
  GEO_CSV_IMPORT_MAX_LENGTH,
  GEO_MAX_COMPETITORS,
  GEO_PROMPT_IMPORT_MAX_ROWS,
} from "../constants/geo.js";
import { geoPromptTextSchema, geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const geoPromptImportSchema = z
  .object({
    projectId: projectIdSchema,
    rows: z
      .array(
        z.object({
          prompt: geoPromptTextSchema.describe("The prompt to track (8-300 characters)"),
          enabled: z.boolean().optional().describe("Whether the prompt starts enabled (default true)"),
        }),
      )
      .min(1)
      .max(GEO_PROMPT_IMPORT_MAX_ROWS)
      .optional()
      .describe("Structured prompt rows to import"),
    csv: z
      .string()
      .min(1)
      .max(GEO_CSV_IMPORT_MAX_LENGTH)
      .optional()
      .describe("Raw CSV text with a prompt column, as an alternative to rows"),
  })
  .refine(({ rows, csv }) => (rows === undefined) !== (csv === undefined), {
    message: "Provide exactly one of rows or csv",
  });

export const geoCompetitorImportSchema = z
  .object({
    projectId: projectIdSchema,
    rows: z
      .array(
        z.object({
          name: geoShortTextSchema.describe("Competitor brand name"),
          domain: z.string().trim().max(128).nullable().optional().describe("Competitor website domain"),
          kind: z.enum(GEO_COMPETITOR_KIND_VALUES).optional().describe("direct or indirect"),
          synonyms: z
            .array(geoShortTextSchema)
            .max(GEO_COMPETITOR_MAX_SYNONYMS)
            .optional()
            .describe("Alternative names that count as a mention"),
        }),
      )
      .min(1)
      .max(GEO_MAX_COMPETITORS)
      .optional()
      .describe("Structured competitor rows to import"),
    csv: z
      .string()
      .min(1)
      .max(GEO_CSV_IMPORT_MAX_LENGTH)
      .optional()
      .describe("Raw CSV text with name/domain/kind columns, as an alternative to rows"),
  })
  .refine(({ rows, csv }) => (rows === undefined) !== (csv === undefined), {
    message: "Provide exactly one of rows or csv",
  });
