import * as z from "zod";
import { GEO_SEQUENCE_MAX_TURNS } from "../constants/geo.js";
import { geoPromptTextSchema, geoResourceIdSchema, geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoSequencesSchema = z.object({
  projectId: projectIdSchema,
});

export const createGeoSequenceSchema = z.object({
  projectId: projectIdSchema,
  name: geoShortTextSchema.describe("Sequence name (1-128 characters)"),
  steps: z
    .array(geoPromptTextSchema)
    .min(1)
    .max(GEO_SEQUENCE_MAX_TURNS)
    .describe("Ordered conversation turns (1-5 turns, each 8-300 characters)"),
});

export const updateGeoSequenceSchema = z
  .object({
    projectId: projectIdSchema,
    sequenceId: geoResourceIdSchema.describe("The sequence ID to update"),
    name: geoShortTextSchema.optional().describe("New sequence name (1-128 characters)"),
    steps: z
      .array(geoPromptTextSchema)
      .min(1)
      .max(GEO_SEQUENCE_MAX_TURNS)
      .optional()
      .describe("New ordered conversation turns"),
    enabled: z.boolean().optional().describe("Whether the sequence runs during scans"),
  })
  .refine(({ name, steps, enabled }) => name !== undefined || steps !== undefined || enabled !== undefined, {
    message: "Provide at least one field to update",
  });

export const deleteGeoSequenceSchema = z.object({
  projectId: projectIdSchema,
  sequenceId: geoResourceIdSchema.describe("The sequence ID to delete"),
});

export const runGeoSequenceSchema = z.object({
  projectId: projectIdSchema,
  sequenceId: geoResourceIdSchema.describe("The sequence ID to run"),
});
