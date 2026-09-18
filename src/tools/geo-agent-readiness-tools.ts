import { getGeoAgentReadinessSchema, startGeoAgentReadinessScanSchema } from "../schemas/geo-agent-readiness.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoAgentReadinessTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_geo_agent_readiness",
    {
      description:
        "Get the latest agent readiness report for the project's website: score, failed/partial checks with recommendations, any scan still in flight, and the score history. Never starts a scan.",
      annotations: { title: "Get Agent Readiness", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getGeoAgentReadinessSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoAgentReadiness")),
    },
    ({ projectId }) => handleError(() => client.getGeoAgentReadiness(projectId)),
  );

  server.registerTool(
    "start_geo_agent_readiness_scan",
    {
      description:
        "Queue an agent readiness scan of the project's website. A scan already running against the same URL is reused (alreadyRunning is true). Poll get_geo_agent_readiness for the result. Requires the agent readiness feature for the organization.",
      annotations: {
        title: "Start Agent Readiness Scan",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(startGeoAgentReadinessScanSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("startGeoAgentReadinessScan")),
    },
    ({ projectId }) => handleError(() => client.startGeoAgentReadinessScan(projectId)),
  );
}
