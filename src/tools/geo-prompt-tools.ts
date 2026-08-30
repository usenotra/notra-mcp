import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { geoPromptTextSchema, geoResourceIdSchema, projectIdSchema } from "../schemas/geo-fields.js";
import { geoPromptImportSchema } from "../schemas/geo-import.js";
import { toImportSource } from "../utils/import-source.js";
import { handleError } from "../utils/mcp.js";

export function registerGeoPromptTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_prompts",
    {
      description:
        "List the GEO prompts tracked for a project: custom prompts plus the ones derived automatically from the brand context",
      annotations: { title: "List GEO Prompts", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.listGeoPrompts(projectId));
    },
  );

  server.registerTool(
    "create_geo_prompt",
    {
      description: "Track a new GEO prompt so future scans check it against every configured answer engine",
      annotations: { title: "Create GEO Prompt", destructiveHint: false },
      inputSchema: z.object({
        projectId: projectIdSchema,
        prompt: geoPromptTextSchema.describe("The prompt to track (8-300 characters), phrased like a real user query"),
      }),
    },
    async ({ projectId, prompt }) => {
      return handleError(() => client.createGeoPrompt(projectId, prompt));
    },
  );

  server.registerTool(
    "update_geo_prompt",
    {
      description: "Enable or disable a tracked GEO prompt",
      annotations: { title: "Update GEO Prompt", destructiveHint: true, idempotentHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        promptId: geoResourceIdSchema.describe("The prompt ID to update"),
        enabled: z.boolean().describe("Whether the prompt is checked during scans"),
      }),
    },
    async ({ projectId, promptId, enabled }) => {
      return handleError(() => client.updateGeoPrompt(projectId, promptId, enabled));
    },
  );

  server.registerTool(
    "delete_geo_prompt",
    {
      description: "Stop tracking a GEO prompt",
      annotations: { title: "Delete GEO Prompt", destructiveHint: true, idempotentHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        promptId: geoResourceIdSchema.describe("The prompt ID to delete"),
      }),
    },
    async ({ projectId, promptId }) => {
      return handleError(() => client.deleteGeoPrompt(projectId, promptId));
    },
  );

  server.registerTool(
    "import_geo_prompts",
    {
      description:
        "Bulk import GEO prompts from structured rows or raw CSV text. Prompts that already exist are skipped, not duplicated.",
      annotations: { title: "Import GEO Prompts", destructiveHint: false },
      inputSchema: geoPromptImportSchema,
    },
    async ({ projectId, rows, csv }) => {
      return handleError(() => client.importGeoPrompts(projectId, toImportSource(rows, csv)));
    },
  );
}
