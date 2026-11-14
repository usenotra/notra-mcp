import type { ToolRegistry } from "../types/server.js";
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
import { chartView } from "../utils/views.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoDiagnosticTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "get_geo_snapshot",
      description:
        "Get a compact GEO diagnosis across visibility, sentiment, scan changes, competitors, content gaps, shelf sources, readiness and AI traffic. Returns generatedAt, the window, visibility totals, sections for sentiment, changes, competitors, contentGaps, shelf, agentReadiness and traffic (each null when it could not be loaded, with a matching entry in warnings), recommendedNextActions and the organization. Each recommended next action has a priority, action, reason, and names the tool and arguments to call, or tool null when it needs the Notra dashboard; confirm with the user before actions with usesCredits.",
      annotations: {
        title: "Get GEO Snapshot",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoSnapshotSchema),
      outputSchema: shareJsonSchema(geoSnapshotOutputSchema),
    },
    ({ projectId, ...window }) => handleError(() => loadGeoSnapshot(client, projectId, window)),
  );

  server.tool(
    {
      name: "get_geo_changes",
      description:
        "Compare the two latest GEO scans and list gained or lost mentions, positions and citations. Returns both scans' IDs and finish times, summary counts per change type, and one event per prompt and engine with previous and current mention state and position, plus the competitors and domains involved, and the organization.",
      annotations: {
        title: "Get GEO Changes",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoChangesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoChanges")),
    },
    ({ projectId }) => handleError(() => client.getGeoChanges(projectId)),
  );

  server.tool(
    {
      name: "get_geo_prompt_history",
      description:
        "Get compact historical checks for one prompt. Returns a configured flag, the promptId, the organization and one row per check with its ID, scan ID, engine, whether the brand was mentioned or an owned source cited, position, sentiment, competitors, language and capture time. Use a returned check id with get_geo_prompt_result_detail for the full answer.",
      annotations: {
        title: "Get GEO Prompt History",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoPromptHistorySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoPromptHistory")),
    },
    ({ projectId, promptId, scanId }) => handleError(() => client.getGeoPromptHistory(projectId, promptId, scanId)),
  );

  server.tool(
    {
      name: "get_geo_sentiment",
      description:
        "Get aggregate GEO sentiment for the window. Returns positive, neutral and negative mention counts, shares and score, the same figures per engine and per day, and a comparison with the previous period of the same length, plus a configured flag and the organization.",
      annotations: {
        title: "Get GEO Sentiment",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoSentimentSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoSentiment")),
      ...chartView(
        "geo-sentiment",
        "Brand sentiment score, daily mix and per-engine split",
        "Loading sentiment",
        "Sentiment ready",
      ),
    },
    ({ projectId, ...window }) => handleError(() => client.getGeoSentiment(projectId, window)),
  );

  server.tool(
    {
      name: "get_geo_sentiment_analysis",
      description:
        "Get the stored thematic GEO sentiment analysis without starting a billed analysis run. Returns status, a message, the organization and, when an analysis exists, result with when it was generated, how many answers were sampled out of the eligible ones, and the themes found in AI answers with their polarity, claims and supporting evidence.",
      annotations: {
        title: "Get GEO Sentiment Analysis",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoSentimentAnalysisSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoSentimentAnalysis")),
    },
    ({ projectId, ...window }) => handleError(() => client.getGeoSentimentAnalysis(projectId, window)),
  );

  server.tool(
    {
      name: "list_geo_sentiment_evidence",
      description:
        "Page through the full AI answers that sentiment scores are based on, for one project and window. Returns items (id, scanId, promptId, prompt, engine, language, capturedAt, full answer and excerpt), nextCursor (null on the last page) and the organization. Pass nextCursor back as cursor for the next page.",
      annotations: {
        title: "List GEO Sentiment Evidence",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoSentimentEvidenceSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoSentimentEvidence")),
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoSentimentEvidence(projectId, params)),
  );

  server.tool(
    {
      name: "list_geo_shelf_sources",
      description:
        "List cited and manually tracked GEO shelf sources: pages AI answers cite. Returns each source's URL, domain, title, kind, ownership, citation counts and engines, competitor placements on the page, and opportunity state, newest updates first, plus nextOffset (null on the last page) and the organization. Pass nextOffset as offset for the next page.",
      annotations: {
        title: "List GEO Shelf Sources",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoShelfSourcesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoShelfSources")),
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoShelfSources(projectId, params)),
  );
}
