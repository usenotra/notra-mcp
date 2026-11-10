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
        "Get the latest agent readiness report for the project's website: score, failed/partial checks with recommendations, any scan still in flight, and the score history. Never starts a scan.",
      annotations: {
        title: "Get Agent Readiness",
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
        "Queue an agent readiness scan of the project's website. Returns the report ID and alreadyRunning, which is true when a scan against the same URL was already running and is reused. Poll get_geo_agent_readiness for the result. Requires the agent readiness feature for the organization.",
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
