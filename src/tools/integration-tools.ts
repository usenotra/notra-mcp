import {
  listIntegrationsSchema,
  createGithubIntegrationSchema,
  deleteIntegrationSchema,
} from "../schemas/integration.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";

export function registerIntegrationTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_integrations",
    {
      description: "List all connected integrations (GitHub, Slack, Linear) for your organization",
      annotations: { title: "List Integrations", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: listIntegrationsSchema,
    },
    () => handleError(() => client.listIntegrations()),
  );

  server.registerTool(
    "create_github_integration",
    {
      description: "Connect a GitHub repository as an integration for content generation",
      annotations: {
        title: "Create GitHub Integration",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
      },
      inputSchema: createGithubIntegrationSchema,
    },
    ({ owner, repo, branch, token }) =>
      handleError(() =>
        client.createGithubIntegration({ owner, repo, branch: branch ?? undefined, token: token ?? undefined }),
      ),
  );

  server.registerTool(
    "delete_integration",
    {
      description:
        "Delete a GitHub or Linear integration. Returns any schedules or events that were disabled as a result.",
      annotations: {
        title: "Delete Integration",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: deleteIntegrationSchema,
    },
    ({ integrationId }) => handleError(() => client.deleteIntegration(integrationId)),
  );
}
