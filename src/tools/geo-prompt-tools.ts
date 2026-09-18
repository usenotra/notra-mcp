import {
  listGeoPromptsSchema,
  createGeoPromptSchema,
  updateGeoPromptSchema,
  deleteGeoPromptSchema,
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
}
