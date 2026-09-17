import {
  listGeoCompetitorsSchema,
  upsertGeoCompetitorSchema,
  suggestGeoCompetitorsSchema,
  deleteGeoCompetitorSchema,
} from "../schemas/geo-competitor.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import { geoCompetitorImportSchema } from "../schemas/geo-import.js";

import { toImportSource } from "../utils/import-source.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoCompetitorTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_competitors",
    {
      description: "List the competitors tracked for a project's GEO share-of-voice reporting",
      annotations: { title: "List GEO Competitors", readOnlyHint: true },
      inputSchema: listGeoCompetitorsSchema,
      outputSchema: apiOutputSchema("listGeoCompetitors"),
    },
    ({ projectId }) => handleError(() => client.listGeoCompetitors(projectId)),
  );

  server.registerTool(
    "upsert_geo_competitor",
    {
      description:
        "Create or update a tracked GEO competitor. Matches on name, case-insensitively; send previousName to rename an existing competitor. Returns the full competitor list.",
      annotations: { title: "Upsert GEO Competitor", destructiveHint: false, idempotentHint: true },
      inputSchema: upsertGeoCompetitorSchema,
      outputSchema: apiOutputSchema("upsertGeoCompetitor"),
    },
    ({ projectId, ...body }) => handleError(() => client.upsertGeoCompetitor(projectId, body)),
  );

  server.registerTool(
    "suggest_geo_competitors",
    {
      description:
        "Discover likely competitors for a website domain using AI. Results are cached per organization and domain.",
      annotations: { title: "Suggest GEO Competitors", readOnlyHint: true },
      inputSchema: suggestGeoCompetitorsSchema,
      outputSchema: apiOutputSchema("suggestGeoCompetitors"),
    },
    ({ projectId, domain }) => handleError(() => client.suggestGeoCompetitors(projectId, domain)),
  );

  server.registerTool(
    "delete_geo_competitor",
    {
      description: "Stop tracking a GEO competitor. The name is matched case-insensitively.",
      annotations: { title: "Delete GEO Competitor", destructiveHint: true, idempotentHint: true },
      inputSchema: deleteGeoCompetitorSchema,
      outputSchema: apiOutputSchema("deleteGeoCompetitor"),
    },
    ({ projectId, name }) => handleError(() => client.deleteGeoCompetitor(projectId, name)),
  );

  server.registerTool(
    "import_geo_competitors",
    {
      description:
        "Bulk import GEO competitors from structured rows or raw CSV text. Existing competitors are updated in place rather than duplicated.",
      annotations: { title: "Import GEO Competitors", destructiveHint: false },
      inputSchema: geoCompetitorImportSchema,
      outputSchema: apiOutputSchema("importGeoCompetitors"),
    },
    ({ projectId, rows, csv }) => handleError(() => client.importGeoCompetitors(projectId, toImportSource(rows, csv))),
  );
}
