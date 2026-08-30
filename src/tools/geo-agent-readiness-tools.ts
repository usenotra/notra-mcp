import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { projectIdSchema } from "../schemas/geo-fields.js";
import { handleError } from "../utils/mcp.js";

export function registerGeoAgentReadinessTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_geo_agent_readiness",
    {
      description:
        "Get the latest agent readiness report for the project's website: score, failed/partial checks with recommendations, any scan still in flight, and the score history. Never starts a scan.",
      annotations: { title: "Get Agent Readiness", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.getGeoAgentReadiness(projectId));
    },
  );

  server.registerTool(
    "start_geo_agent_readiness_scan",
    {
      description:
        "Queue an agent readiness scan of the project's website. A scan already running against the same URL is reused (alreadyRunning is true). Poll get_geo_agent_readiness for the result. Requires the agent readiness feature for the organization.",
      annotations: { title: "Start Agent Readiness Scan", destructiveHint: false },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.startGeoAgentReadinessScan(projectId));
    },
  );
}
