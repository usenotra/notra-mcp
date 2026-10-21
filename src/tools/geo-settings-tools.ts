import { getGeoSettingsSchema, listGeoEnginesSchema, updateGeoSettingsSchema } from "../schemas/geo-settings.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoSettingsTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_geo_settings",
    {
      description:
        "Get a project's GEO settings: tracked company name, aliases, languages, answer engines and the recurring scan configuration",
      annotations: { title: "Get GEO Settings", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getGeoSettingsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoSettings")),
    },
    ({ projectId }) => handleError(() => client.getGeoSettings(projectId)),
  );

  server.registerTool(
    "list_geo_engines",
    {
      description:
        "List the answer engine IDs a project can track. Includes model APIs and consumer surfaces such as google/ai-overview (Google AI Overview), google/gemini (the Gemini app) and openai/chatgpt (the ChatGPT app). Use these IDs for engines in update_geo_settings.",
      annotations: { title: "List GEO Engines", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listGeoEnginesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoEngines")),
    },
    ({ projectId }) => handleError(() => client.listGeoEngines(projectId)),
  );

  server.registerTool(
    "update_geo_settings",
    {
      description:
        "Replace all GEO settings and restart the recurring scan schedule. Send every field from get_geo_settings; this endpoint does not merge partial updates. Use engine IDs from list_geo_engines and languages listed in the current settings response.",
      annotations: {
        title: "Update GEO Settings",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateGeoSettingsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateGeoSettings")),
    },
    ({ projectId, ...body }) => handleError(() => client.updateGeoSettings(projectId, body)),
  );
}
