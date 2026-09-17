import {
  listIntegrationsSchema,
  createGithubIntegrationSchema,
  deleteIntegrationSchema,
} from "../schemas/integration.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerIntegrationTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_integrations",
    {
      description: "List all connected integrations (GitHub, Slack, Linear) for your organization",
      annotations: { title: "List Integrations", readOnlyHint: true },
      inputSchema: listIntegrationsSchema,
      outputSchema: apiOutputSchema("listIntegrations"),
    },
    () => handleError(() => client.listIntegrations()),
  );

  server.registerTool(
    "create_github_integration",
    {
      description: "Connect a GitHub repository as an integration for content generation",
      annotations: { title: "Create GitHub Integration", destructiveHint: false },
      inputSchema: createGithubIntegrationSchema,
      outputSchema: apiOutputSchema("createGitHubIntegration"),
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
      annotations: { title: "Delete Integration", destructiveHint: true, idempotentHint: true },
      inputSchema: deleteIntegrationSchema,
      outputSchema: apiOutputSchema("deleteIntegration"),
    },
    ({ integrationId }) => handleError(() => client.deleteIntegration(integrationId)),
  );
}
