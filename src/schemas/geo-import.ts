import * as z from "zod";
import {
  GEO_COMPETITOR_KIND_VALUES,
  GEO_COMPETITOR_MAX_SYNONYMS,
  GEO_CSV_IMPORT_MAX_LENGTH,
  GEO_MAX_COMPETITORS,
} from "../constants/geo.js";
import { geoPromptTextSchema, geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const geoPromptImportSchema = z
  .object({
    projectId: projectIdSchema,
    rows: z
      .array(
        z.object({
          prompt: geoPromptTextSchema.describe(
            "Question to track, phrased the way a real buyer would ask an AI assistant",
          ),
          enabled: z.boolean().optional().describe("Whether the prompt starts enabled (default true)"),
        }),
      )
      .min(1)
      .max(500)
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
          domain: z
            .string()
            .trim()
            .max(128)
            .nullable()
            .optional()
            .describe(
              "Competitor website domain, such as example.com. Omit to keep an existing competitor's domain; a new competitor is saved without one.",
            ),
          kind: z
            .enum(GEO_COMPETITOR_KIND_VALUES)
            .optional()
            .describe(
              "direct for a competitor selling the same product, indirect for an alternative solution. Omit to keep an existing competitor's kind; new competitors default to direct.",
            ),
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
