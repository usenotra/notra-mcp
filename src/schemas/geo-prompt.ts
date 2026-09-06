import * as z from "zod";
import { geoPromptTextSchema, geoResourceIdSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoPromptsSchema = z.object({
  projectId: projectIdSchema,
});

export const createGeoPromptSchema = z.object({
  projectId: projectIdSchema,
  prompt: geoPromptTextSchema.describe("The prompt to track (8-300 characters), phrased like a real user query"),
});

export const updateGeoPromptSchema = z.object({
  projectId: projectIdSchema,
  promptId: geoResourceIdSchema.describe("The prompt ID to update"),
  enabled: z.boolean().describe("Whether the prompt is checked during scans"),
});

export const deleteGeoPromptSchema = z.object({
  projectId: projectIdSchema,
  promptId: geoResourceIdSchema.describe("The prompt ID to delete"),
});
