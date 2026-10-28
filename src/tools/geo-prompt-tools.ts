import {
  listGeoPromptsSchema,
  createGeoPromptSchema,
  updateGeoPromptSchema,
  deleteGeoPromptSchema,
  listGeoPromptSuggestionsSchema,
  geoPromptSuggestionSchema,
} from "../schemas/geo-prompt.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { geoPromptImportSchema } from "../schemas/geo-import.js";
import { toImportSource } from "../utils/import-source.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoPromptTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_prompts",
    {
      description:
        "List the GEO prompts tracked for a project: custom prompts plus the ones derived automatically from the brand context",
      annotations: { title: "List GEO Prompts", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listGeoPromptsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoPrompts")),
    },
    ({ projectId }) => handleError(() => client.listGeoPrompts(projectId)),
  );

  server.registerTool(
    "create_geo_prompt",
    {
      description: "Track a new GEO prompt so future scans check it against every configured answer engine",
      annotations: { title: "Create GEO Prompt", readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(createGeoPromptSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createGeoPrompt")),
    },
    ({ projectId, prompt }) => handleError(() => client.createGeoPrompt(projectId, prompt)),
  );

  server.registerTool(
    "update_geo_prompt",
    {
      description: "Enable or disable a tracked GEO prompt",
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

  server.registerTool(
    "delete_geo_prompt",
    {
      description: "Stop tracking a GEO prompt",
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

  server.registerTool(
    "import_geo_prompts",
    {
      description:
        "Bulk import GEO prompts from structured rows or raw CSV text. Prompts that already exist are skipped, not duplicated.",
      annotations: { title: "Import GEO Prompts", readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(geoPromptImportSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("importGeoPrompts")),
    },
    ({ projectId, rows, csv }) => handleError(() => client.importGeoPrompts(projectId, toImportSource(rows, csv))),
  );

  server.registerTool(
    "list_geo_prompt_suggestions",
    {
      description:
        "List prompts Notra suggests tracking, derived from the project's Google Search Console queries with their clicks, impressions and position. Empty until Search Console is connected in the dashboard. Accept or dismiss each with accept_geo_prompt_suggestion or dismiss_geo_prompt_suggestion.",
      annotations: {
        title: "List GEO Prompt Suggestions",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(listGeoPromptSuggestionsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoPromptSuggestions")),
    },
    ({ projectId }) => handleError(() => client.listGeoPromptSuggestions(projectId)),
  );

  server.registerTool(
    "accept_geo_prompt_suggestion",
    {
      description:
        "Start tracking a suggested prompt and return it. If the project already tracks the same prompt, that prompt is returned instead of a duplicate.",
      annotations: {
        title: "Accept GEO Prompt Suggestion",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(geoPromptSuggestionSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("acceptGeoPromptSuggestion")),
    },
    ({ projectId, suggestionId }) => handleError(() => client.acceptGeoPromptSuggestion(projectId, suggestionId)),
  );

  server.registerTool(
    "dismiss_geo_prompt_suggestion",
    {
      description: "Dismiss a suggested prompt without tracking it. Dismissed suggestions cannot be brought back.",
      annotations: {
        title: "Dismiss GEO Prompt Suggestion",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
      },
      inputSchema: shareJsonSchema(geoPromptSuggestionSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("dismissGeoPromptSuggestion")),
    },
    ({ projectId, suggestionId }) => handleError(() => client.dismissGeoPromptSuggestion(projectId, suggestionId)),
  );
}
