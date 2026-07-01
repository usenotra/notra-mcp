import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";

export function registerIntegrationTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_integrations",
    {
      description: "List all connected integrations (GitHub, Slack, Linear) for your organization",
      inputSchema: {},
    },
    async () => {
      return handleError(() => client.listIntegrations());
    },
  );

  server.registerTool(
    "create_github_integration",
    {
      description: "Connect a GitHub repository as an integration for content generation",
      inputSchema: {
        owner: z.string().min(1).describe("GitHub repository owner (user or organization)"),
        repo: z.string().min(1).describe("GitHub repository name"),
        branch: z.string().min(1).optional().nullable().describe("Default branch (auto-detected if not set)"),
        token: z.string().min(1).optional().nullable().describe("GitHub personal access token for private repos"),
      },
    },
    async (params) => {
      const body: { owner: string; repo: string; branch?: string; token?: string } = {
        owner: params.owner,
        repo: params.repo,
      };
      if (params.branch) body.branch = params.branch;
      if (params.token) body.token = params.token;
      return handleError(() => client.createGithubIntegration(body));
    },
  );

  server.registerTool(
    "delete_integration",
    {
      description:
        "Delete a GitHub or Linear integration. Returns any schedules or events that were disabled as a result.",
      inputSchema: {
        integrationId: z.string().min(1).describe("The integration ID to delete"),
      },
    },
    async ({ integrationId }) => {
      return handleError(() => client.deleteIntegration(integrationId));
    },
  );
}
