import * as z from "zod";
import { GEO_SEQUENCE_MAX_TURNS } from "../constants/geo.js";
import { geoPromptTextSchema, geoResourceIdSchema, geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoSequencesSchema = z.object({
  projectId: projectIdSchema,
});

export const createGeoSequenceSchema = z.object({
  projectId: projectIdSchema,
  name: geoShortTextSchema.describe("Label that identifies the sequence in lists and reports"),
  steps: z
    .array(geoPromptTextSchema)
    .min(1)
    .max(GEO_SEQUENCE_MAX_TURNS)
    .describe(
      "Messages sent in order as one conversation; each turn is a buyer question or follow-up, phrased like a real user",
    ),
});

export const updateGeoSequenceSchema = z
  .object({
    projectId: projectIdSchema,
    sequenceId: geoResourceIdSchema.describe("The sequence ID to update"),
    name: geoShortTextSchema.optional().describe("New label for the sequence. Omit to keep the current name."),
    steps: z
      .array(geoPromptTextSchema)
      .min(1)
      .max(GEO_SEQUENCE_MAX_TURNS)
      .optional()
      .describe(
        "Messages sent in order as one conversation. Replaces every existing turn; omit to keep the current turns.",
      ),
    enabled: z
      .boolean()
      .optional()
      .describe("true to play the sequence during scans, false to skip it. Omit to keep the current state."),
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
  sequenceId: geoResourceIdSchema.describe("ID of the prompt sequence to play right away, from list_geo_sequences"),
});
