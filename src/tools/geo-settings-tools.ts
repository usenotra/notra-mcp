import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import { GEO_MAX_ALIASES, GEO_MAX_ENGINES, GEO_MAX_LANGUAGES, GEO_SCAN_INTERVAL_HOURS } from "../constants/geo.js";
import type { NotraClient } from "../notra-client.js";
import { geoShortTextSchema, projectIdSchema } from "../schemas/geo-fields.js";
import { handleError } from "../utils/mcp.js";

export function registerGeoSettingsTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_geo_settings",
    {
      description:
        "Get a project's GEO settings: tracked company name, aliases, languages, answer engines and the recurring scan configuration",
      annotations: { title: "Get GEO Settings", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.getGeoSettings(projectId));
    },
  );

  server.registerTool(
    "update_geo_settings",
    {
      description:
        "Replace all GEO settings and restart the recurring scan schedule. Send every field from get_geo_settings; this endpoint does not merge partial updates. Use model catalog IDs for engines and languages listed in the current settings response.",
      annotations: { title: "Update GEO Settings", destructiveHint: true, idempotentHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        companyName: geoShortTextSchema.describe("Company or brand name to track in AI answers"),
        aliases: z
          .array(geoShortTextSchema)
          .max(GEO_MAX_ALIASES)
          .describe("Alternative names that also count as a brand mention"),
        languages: z.array(geoShortTextSchema).min(1).max(GEO_MAX_LANGUAGES).describe("Languages to run prompts in"),
        engines: z
          .array(geoShortTextSchema)
          .min(1)
          .max(GEO_MAX_ENGINES)
          .describe("Answer engine IDs from the organization's model catalog"),
        enforceZdr: z.boolean().describe("Restrict scanning to zero-data-retention engines"),
        nonZdrApprovedEngines: z
          .array(geoShortTextSchema)
          .max(GEO_MAX_ENGINES)
          .describe("Engines explicitly approved despite not being zero-data-retention"),
        enabled: z.boolean().describe("Whether recurring scans are enabled"),
        scanIntervalHours: z
          .union(GEO_SCAN_INTERVAL_HOURS.map((hours) => z.literal(hours)))
          .describe(`Hours between recurring scans: ${GEO_SCAN_INTERVAL_HOURS.join(", ")}`),
      }),
    },
    async ({ projectId, ...body }) => {
      return handleError(() => client.updateGeoSettings(projectId, body));
    },
  );
}
