import { getGeoAgentReadinessSchema, startGeoAgentReadinessScanSchema } from "../schemas/geo-agent-readiness.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { chartView } from "../utils/views.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoAgentReadinessTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "get_geo_agent_readiness",
      description:
        "Get the stored agent readiness results for the project's website. Never starts a scan. Returns targetUrl, report (the latest completed report or null: score, scoreLabel, scoreBreakdown, issues with each failed or partial check's details and recommendation, scannedAt), scan (a newer run that is still running or failed, or null), history (completed scans oldest first with score and failed and partial counts), comparison (checks resolved, added, improved or worsened since the previous scan, null until there are two) and the organization.",
      annotations: {
        title: "Get Website AI Agent Readiness",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoAgentReadinessSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoAgentReadiness")),
      ...chartView(
        "geo-agent-readiness",
        "Agent readiness score gauge, history and issues",
        "Loading agent readiness",
        "Agent readiness ready",
      ),
    },
    ({ projectId }) => handleError(() => client.getGeoAgentReadiness(projectId)),
  );

  server.tool(
    {
      name: "start_geo_agent_readiness_scan",
      description:
        "Queue an agent readiness scan of the project's website. Returns reportId, alreadyRunning (true when a scan against the same URL was already running and is reused) and the organization. Poll get_geo_agent_readiness for the result. Requires the agent readiness feature for the organization.",
      annotations: {
        title: "Start Agent Readiness Scan",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(startGeoAgentReadinessScanSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("startGeoAgentReadinessScan")),
    },
    ({ projectId }) => handleError(() => client.startGeoAgentReadinessScan(projectId)),
  );
}
