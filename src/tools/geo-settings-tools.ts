import * as z from "zod";

import { getGeoSettingsSchema, listGeoEnginesSchema, updateGeoSettingsSchema } from "../schemas/geo-settings.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { hasNormalizedWwwDomain, mergeGeoSettings } from "../utils/geo-settings.js";
import { handleError } from "../utils/mcp.js";
import { apiObjectOutputSchema, apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoSettingsTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "get_geo_settings",
      description:
        "Get a project's GEO settings: tracked company name, aliases, domains, conversion paths, languages, answer engines and the recurring scan configuration. Returns configured (whether the analytics backend is configured), settings (companyName, aliases, domains, conversionPaths, competitors, languages, engines, the zero-data-retention options enforceZdr and nonZdrApprovedEngines, trackWithoutSearch, pausedAutoPromptIds, removedAutoPromptIds, enabled, scanIntervalHours, nextScanAt, scanStartedAt, lastScanAt, isScanning and timestamps; may be null), and the organization. nextScanAt is the exact UTC time the next automatic scan is due (it starts within 10 minutes after it, keeps the same time of day on every interval, and is null while automatic scans are off); manual scans never move it.",
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
        "List the answer engine IDs a project can track. Includes model APIs and consumer surfaces such as google/ai-overview (Google AI Overview), google/gemini (the Gemini app) and openai/chatgpt (the ChatGPT app). Use these IDs for engines in update_geo_settings. Returns engines (id, label, provider, zdr for zero-data-retention coverage, default for engines in the default set for new projects, supportsGroundedChecks) and the organization.",
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
        "Change a project's GEO settings. Changing scanIntervalHours or turning enabled back on recalculates nextScanAt from the last finished scan (due right away if that time has passed), setting enabled to false clears it to null, and other changes keep it. Send only the fields to change; omitted fields keep their stored value. List fields replace the whole list, so include existing entries you want to keep, or they are dropped. Tracked domains drop the leading www. and merge duplicates; traffic from both hosts is still covered. Changes are reversible by sending the old values. Recurring scans use billed AI credits, so more engines or languages, or a shorter interval, raise spend. Use engine IDs from list_geo_engines. Returns the saved settings, configured, the organization, and a warning if a submitted www. host was normalized.",
      annotations: {
        title: "Update GEO Settings",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateGeoSettingsSchema),
      outputSchema: shareJsonSchema(
        apiObjectOutputSchema("updateGeoSettings").extend({
          warnings: z.array(z.string()).optional().describe("Notes about domain normalization applied to this update."),
        }),
      ),
    },
    ({ projectId, ...patch }) =>
      handleError(async () => {
        const { settings } = await client.getGeoSettings(projectId);
        const saved = await client.updateGeoSettings(projectId, mergeGeoSettings(settings, patch));
        if (!patch.domains || !saved.settings || !hasNormalizedWwwDomain(patch.domains, saved.settings.domains)) {
          return saved;
        }
        return {
          ...saved,
          warnings: [
            "Tracked domains drop the leading www. and merge duplicates. Traffic from www. hosts is still covered.",
          ],
        };
      }),
  );
}
