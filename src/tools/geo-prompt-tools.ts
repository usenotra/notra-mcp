import {
  listGeoPromptsSchema,
  createGeoPromptSchema,
  updateGeoPromptSchema,
  deleteGeoPromptSchema,
  listGeoPromptSuggestionsSchema,
  geoPromptSuggestionSchema,
} from "../schemas/geo-prompt.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { geoPromptImportSchema } from "../schemas/geo-import.js";
import { toImportSource } from "../utils/import-source.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoPromptTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_geo_prompts",
      description:
        "List the GEO prompts tracked for a project: custom prompts plus the ones derived automatically from the brand context",
      annotations: {
        title: "List GEO Prompts",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoPromptsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoPrompts")),
    },
    ({ projectId }) => handleError(() => client.listGeoPrompts(projectId)),
  );

  server.tool(
    {
      name: "create_geo_prompt",
      description: "Track a new GEO prompt so future scans check it against every configured answer engine",
      annotations: {
        title: "Create GEO Prompt",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(createGeoPromptSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createGeoPrompt")),
    },
    ({ projectId, prompt }) => handleError(() => client.createGeoPrompt(projectId, prompt)),
  );

  server.tool(
    {
      name: "update_geo_prompt",
      description:
        "Enable or disable a tracked GEO prompt. Disabled prompts are skipped by future scans and stay in the project, so you can enable them again later; this is the reversible alternative to delete_geo_prompt. Get prompt IDs from list_geo_prompts. Returns the updated prompt.",
      annotations: {
        title: "Update GEO Prompt",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateGeoPromptSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateGeoPrompt")),
    },
    ({ projectId, promptId, enabled }) => handleError(() => client.updateGeoPrompt(projectId, promptId, enabled)),
  );

  server.tool(
    {
      name: "delete_geo_prompt",
      description:
        "Permanently stop tracking a GEO prompt and remove it from the project. This cannot be undone; adding the same text again creates a new prompt. To pause a prompt instead, use update_geo_prompt with enabled false. Get prompt IDs from list_geo_prompts. Returns the deleted prompt's ID.",
      annotations: {
        title: "Delete GEO Prompt",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteGeoPromptSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteGeoPrompt")),
    },
    ({ projectId, promptId }) => handleError(() => client.deleteGeoPrompt(projectId, promptId)),
  );

  server.tool(
    {
      name: "import_geo_prompts",
      description:
        "Bulk import GEO prompts from structured rows or raw CSV text. Prompts that already exist are skipped, not duplicated.",
      annotations: {
        title: "Import GEO Prompts",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(geoPromptImportSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("importGeoPrompts")),
    },
    ({ projectId, rows, csv }) => handleError(() => client.importGeoPrompts(projectId, toImportSource(rows, csv))),
  );

  server.tool(
    {
      name: "list_geo_prompt_suggestions",
      description:
        "List prompts Notra suggests tracking, derived from the project's Google Search Console queries. Each suggestion has an ID, the prompt text, a title and the Search Console keywords behind it with their clicks, impressions and position. Empty until Search Console is connected in the dashboard. Accept or dismiss each with accept_geo_prompt_suggestion or dismiss_geo_prompt_suggestion.",
      annotations: {
        title: "List GEO Prompt Suggestions",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoPromptSuggestionsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoPromptSuggestions")),
    },
    ({ projectId }) => handleError(() => client.listGeoPromptSuggestions(projectId)),
  );

  server.tool(
    {
      name: "accept_geo_prompt_suggestion",
      description:
        "Start tracking a suggested prompt: it is added to the project's tracked prompts, and future scans, which use billed AI credits, check it. Returns the tracked prompt. If the project already tracks the same prompt, that prompt is returned instead of a duplicate. Undo with update_geo_prompt or delete_geo_prompt. Get suggestion IDs from list_geo_prompt_suggestions.",
      annotations: {
        title: "Accept GEO Prompt Suggestion",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(geoPromptSuggestionSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("acceptGeoPromptSuggestion")),
    },
    ({ projectId, suggestionId }) => handleError(() => client.acceptGeoPromptSuggestion(projectId, suggestionId)),
  );

  server.tool(
    {
      name: "dismiss_geo_prompt_suggestion",
      description:
        "Dismiss a suggested prompt without tracking it, hiding it from list_geo_prompt_suggestions. This is permanent: dismissed suggestions cannot be brought back. Tracked prompts are not affected. Returns the suggestion ID and dismissed flag.",
      annotations: {
        title: "Dismiss GEO Prompt Suggestion",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(geoPromptSuggestionSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("dismissGeoPromptSuggestion")),
    },
    ({ projectId, suggestionId }) => handleError(() => client.dismissGeoPromptSuggestion(projectId, suggestionId)),
  );
}
