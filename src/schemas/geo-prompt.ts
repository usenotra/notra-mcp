import * as z from "zod";
import { geoPromptTextSchema, geoResourceIdSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoPromptsSchema = z.object({
  projectId: projectIdSchema,
});

export const createGeoPromptSchema = z.object({
  projectId: projectIdSchema,
  prompt: geoPromptTextSchema.describe(
    "Question to ask the answer engines, phrased the way a real buyer would ask an AI assistant",
  ),
});

export const updateGeoPromptSchema = z.object({
  projectId: projectIdSchema,
  promptId: geoResourceIdSchema.describe("ID of the prompt to enable or disable, from list_geo_prompts"),
  enabled: z.boolean().describe("Whether the prompt is checked during scans"),
});

export const deleteGeoPromptSchema = z.object({
  projectId: projectIdSchema,
  promptId: geoResourceIdSchema.describe("ID of the prompt to delete, from list_geo_prompts"),
});

export const listGeoPromptSuggestionsSchema = z.object({
  projectId: projectIdSchema,
});

export const geoPromptSuggestionSchema = z.object({
  projectId: projectIdSchema,
  suggestionId: geoResourceIdSchema.describe("The suggestion ID from list_geo_prompt_suggestions"),
});
