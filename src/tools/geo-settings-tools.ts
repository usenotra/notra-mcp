import { getGeoSettingsSchema, listGeoEnginesSchema, updateGeoSettingsSchema } from "../schemas/geo-settings.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { mergeGeoSettings } from "../utils/geo-settings.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoSettingsTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "get_geo_settings",
      description:
        "Get a project's GEO settings: tracked company name, aliases, languages, answer engines and the recurring scan configuration",
      annotations: {
        title: "Get GEO Settings",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoSettingsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoSettings")),
    },
    ({ projectId }) => handleError(() => client.getGeoSettings(projectId)),
  );

  server.tool(
    {
      name: "list_geo_engines",
      description:
        "List the answer engine IDs a project can track. Includes model APIs and consumer surfaces such as google/ai-overview (Google AI Overview), google/gemini (the Gemini app) and openai/chatgpt (the ChatGPT app). Use these IDs for engines in update_geo_settings.",
      annotations: {
        title: "List GEO Engines",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoEnginesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoEngines")),
    },
    ({ projectId }) => handleError(() => client.listGeoEngines(projectId)),
  );

  server.tool(
    {
      name: "update_geo_settings",
      description:
        "Change a project's GEO settings and restart the recurring scan schedule. Send only the fields to change; omitted fields keep their stored value. List fields replace the whole list, so include existing entries you want to keep, or they are dropped. Changes are reversible by sending the old values. Recurring scans use billed AI credits, so more engines or languages, or a shorter interval, raise spend. Use engine IDs from list_geo_engines. Returns the saved settings.",
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
    ({ projectId, ...patch }) =>
      handleError(async () => {
        const { settings } = await client.getGeoSettings(projectId);
        return client.updateGeoSettings(projectId, mergeGeoSettings(settings, patch));
      }),
  );
}
