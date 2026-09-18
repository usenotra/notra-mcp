import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import {
  getGeoChangesSchema,
  getGeoPromptHistorySchema,
  getGeoSentimentAnalysisSchema,
  getGeoSentimentSchema,
  getGeoSnapshotSchema,
  geoSnapshotOutputSchema,
  listGeoSentimentEvidenceSchema,
  listGeoShelfSourcesSchema,
} from "../schemas/geo-diagnostics.js";
import { loadGeoSnapshot } from "../utils/geo-snapshot.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoDiagnosticTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_geo_snapshot",
    {
      description:
        "Get a compact GEO diagnosis across visibility, sentiment, scan changes, competitors, content gaps, shelf sources, readiness and AI traffic, with deterministic next actions",
      annotations: { title: "Get GEO Snapshot", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getGeoSnapshotSchema),
      outputSchema: shareJsonSchema(geoSnapshotOutputSchema),
    },
    ({ projectId, ...window }) => handleError(() => loadGeoSnapshot(client, projectId, window)),
  );

  server.registerTool(
    "get_geo_changes",
    {
      description: "Compare the two latest GEO scans and list gained or lost mentions, positions and citations",
      annotations: { title: "Get GEO Changes", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getGeoChangesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoChanges")),
    },
    ({ projectId }) => handleError(() => client.getGeoChanges(projectId)),
  );

  server.registerTool(
    "get_geo_prompt_history",
    {
      description:
        "Get compact historical checks for one prompt. Use a returned check id with get_geo_prompt_result_detail for the full answer.",
      annotations: {
        title: "Get GEO Prompt History",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(getGeoPromptHistorySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoPromptHistory")),
    },
    ({ projectId, promptId, scanId }) => handleError(() => client.getGeoPromptHistory(projectId, promptId, scanId)),
  );

  server.registerTool(
    "get_geo_sentiment",
    {
      description: "Get aggregate GEO sentiment, engine breakdowns, timeseries and previous-period comparison",
      annotations: { title: "Get GEO Sentiment", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getGeoSentimentSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoSentiment")),
    },
    ({ projectId, ...window }) => handleError(() => client.getGeoSentiment(projectId, window)),
  );

  server.registerTool(
    "get_geo_sentiment_analysis",
    {
      description: "Get the stored thematic GEO sentiment analysis without starting a billed analysis run",
      annotations: {
        title: "Get GEO Sentiment Analysis",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(getGeoSentimentAnalysisSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoSentimentAnalysis")),
    },
    ({ projectId, ...window }) => handleError(() => client.getGeoSentimentAnalysis(projectId, window)),
  );

  server.registerTool(
    "list_geo_sentiment_evidence",
    {
      description: "List a bounded page of full answers used as sentiment evidence",
      annotations: {
        title: "List GEO Sentiment Evidence",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(listGeoSentimentEvidenceSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoSentimentEvidence")),
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoSentimentEvidence(projectId, params)),
  );

  server.registerTool(
    "list_geo_shelf_sources",
    {
      description: "List cited and manually tracked GEO shelf sources, including placements and opportunity state",
      annotations: {
        title: "List GEO Shelf Sources",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(listGeoShelfSourcesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoShelfSources")),
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoShelfSources(projectId, params)),
  );
}
