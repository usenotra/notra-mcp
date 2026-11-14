import {
  listGeoCompetitorsSchema,
  upsertGeoCompetitorSchema,
  suggestGeoCompetitorsSchema,
  deleteGeoCompetitorSchema,
  upsertGeoCompetitorOutputSchema,
  deleteGeoCompetitorOutputSchema,
} from "../schemas/geo-competitor.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { geoCompetitorImportSchema } from "../schemas/geo-import.js";

import { summarizeCompetitorDelete, summarizeCompetitorUpsert } from "../utils/geo-competitor-change.js";
import { toImportSource } from "../utils/import-source.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoCompetitorTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_geo_competitors",
      description:
        "List the competitors tracked for a project's GEO share-of-voice reporting. Returns each competitor's ID, name, domain, synonyms that count as mentions, kind (direct or indirect) and chart color, plus the organization.",
      annotations: {
        title: "List GEO Competitors",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoCompetitorsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoCompetitors")),
    },
    ({ projectId }) => handleError(() => client.listGeoCompetitors(projectId)),
  );

  server.tool(
    {
      name: "upsert_geo_competitor",
      description:
        "Create or update a tracked GEO competitor. Matches on name, case-insensitively; send previousName to rename an existing competitor. domain is always overwritten; omitted synonyms, kind and color keep their stored value. Reversible by upserting the previous values. Changes future share-of-voice reporting. Returns competitor (id, name, domain, synonyms, kind, color; null if the saved name could not be matched in the response), totalCompetitors after the change and the organization; call list_geo_competitors for the full list.",
      annotations: {
        title: "Upsert GEO Competitor",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(upsertGeoCompetitorSchema),
      outputSchema: shareJsonSchema(upsertGeoCompetitorOutputSchema),
    },
    ({ projectId, ...body }) =>
      handleError(async () => summarizeCompetitorUpsert(body.name, await client.upsertGeoCompetitor(projectId, body))),
  );

  server.tool(
    {
      name: "suggest_geo_competitors",
      description:
        "Discover likely competitors for a website domain using AI. Returns the domain, its detected field, suggested competitors (name, domain, description, confidence) and the organization. Suggestions are not tracked until you add them with upsert_geo_competitor or import_geo_competitors. Results are cached per organization and domain.",
      annotations: {
        title: "Suggest AI Search Competitors",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(suggestGeoCompetitorsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("suggestGeoCompetitors")),
    },
    ({ projectId, domain }) => handleError(() => client.suggestGeoCompetitors(projectId, domain)),
  );

  server.tool(
    {
      name: "delete_geo_competitor",
      description:
        "Stop tracking a GEO competitor so it no longer counts in share-of-voice reporting. The name is matched case-insensitively. To undo, add it again with upsert_geo_competitor, re-entering its domain, synonyms, kind and color. Returns the removed name and the remaining competitor count.",
      annotations: {
        title: "Delete GEO Competitor",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteGeoCompetitorSchema),
      outputSchema: shareJsonSchema(deleteGeoCompetitorOutputSchema),
    },
    ({ projectId, name }) =>
      handleError(async () => summarizeCompetitorDelete(name, await client.deleteGeoCompetitor(projectId, name))),
  );

  server.tool(
    {
      name: "import_geo_competitors",
      description:
        "Bulk import GEO competitors from structured rows or raw CSV text. New names are added; a row matching an existing competitor's name (case-insensitively) updates its domain, kind and synonyms when given. Repeated names in the input are skipped and nothing is deleted. Returns imported, updated and skipped counts, issues listing CSV lines rejected while parsing, the full competitor list (id, name, domain, synonyms, kind, color) and the organization.",
      annotations: {
        title: "Import GEO Competitors",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(geoCompetitorImportSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("importGeoCompetitors")),
    },
    ({ projectId, rows, csv }) => handleError(() => client.importGeoCompetitors(projectId, toImportSource(rows, csv))),
  );
}
