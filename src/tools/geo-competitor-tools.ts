import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import { GEO_COMPETITOR_KIND_VALUES, GEO_COMPETITOR_MAX_SYNONYMS } from "../constants/geo.js";
import type { NotraClient } from "../notra-client.js";
import { geoCompetitorImportSchema } from "../schemas/geo-import.js";
import { geoShortTextSchema, projectIdSchema } from "../schemas/geo-fields.js";
import { toImportSource } from "../utils/import-source.js";
import { handleError } from "../utils/mcp.js";

export function registerGeoCompetitorTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_competitors",
    {
      description: "List the competitors tracked for a project's GEO share-of-voice reporting",
      annotations: { title: "List GEO Competitors", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.listGeoCompetitors(projectId));
    },
  );

  server.registerTool(
    "upsert_geo_competitor",
    {
      description:
        "Create or update a tracked GEO competitor. Matches on name, case-insensitively; send previousName to rename an existing competitor. Returns the full competitor list.",
      annotations: { title: "Upsert GEO Competitor", destructiveHint: false, idempotentHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        name: geoShortTextSchema.describe("Competitor brand name"),
        previousName: geoShortTextSchema.optional().describe("Current name when renaming an existing competitor"),
        domain: z.string().max(128).nullable().describe("Competitor website domain, or null if unknown"),
        synonyms: z
          .array(geoShortTextSchema)
          .max(GEO_COMPETITOR_MAX_SYNONYMS)
          .optional()
          .describe("Alternative names that count as a mention"),
        kind: z.enum(GEO_COMPETITOR_KIND_VALUES).optional().describe("Whether the competitor is direct or indirect"),
        color: z.string().max(128).nullable().optional().describe("Display color used in dashboard charts"),
      }),
    },
    async ({ projectId, ...body }) => {
      return handleError(() => client.upsertGeoCompetitor(projectId, body));
    },
  );

  server.registerTool(
    "suggest_geo_competitors",
    {
      description:
        "Discover likely competitors for a website domain using AI. Results are cached per organization and domain.",
      annotations: { title: "Suggest GEO Competitors", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        domain: geoShortTextSchema.describe("Website domain to find competitors for, e.g. example.com"),
      }),
    },
    async ({ projectId, domain }) => {
      return handleError(() => client.suggestGeoCompetitors(projectId, domain));
    },
  );

  server.registerTool(
    "delete_geo_competitor",
    {
      description: "Stop tracking a GEO competitor. The name is matched case-insensitively.",
      annotations: { title: "Delete GEO Competitor", destructiveHint: true, idempotentHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        name: geoShortTextSchema.describe("Competitor name to remove"),
      }),
    },
    async ({ projectId, name }) => {
      return handleError(() => client.deleteGeoCompetitor(projectId, name));
    },
  );

  server.registerTool(
    "import_geo_competitors",
    {
      description:
        "Bulk import GEO competitors from structured rows or raw CSV text. Existing competitors are updated in place rather than duplicated.",
      annotations: { title: "Import GEO Competitors", destructiveHint: false },
      inputSchema: geoCompetitorImportSchema,
    },
    async ({ projectId, rows, csv }) => {
      return handleError(() => client.importGeoCompetitors(projectId, toImportSource(rows, csv)));
    },
  );
}
