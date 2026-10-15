import {
  listIntegrationsSchema,
  createGithubIntegrationSchema,
  deleteIntegrationSchema,
} from "../schemas/integration.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerIntegrationTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_integrations",
    {
      description: "List all connected integrations (GitHub, Slack, Linear) for your organization",
      annotations: { title: "List Integrations", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listIntegrationsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listIntegrations")),
    },
    () => handleError(() => client.listIntegrations()),
  );

  server.registerTool(
    "create_github_integration",
    {
      description:
        "Connect a public GitHub repository for content generation. For private repositories, configure access in the Notra dashboard; never request or send a personal access token in chat.",
      annotations: {
        title: "Create GitHub Integration",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(createGithubIntegrationSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createGitHubIntegration")),
    },
    ({ owner, repo, branch }) =>
      handleError(() => client.createGithubIntegration({ owner, repo, branch: branch ?? undefined })),
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
      inputSchema: shareJsonSchema(deleteIntegrationSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteIntegration")),
    },
    ({ integrationId }) => handleError(() => client.deleteIntegration(integrationId)),
  );
}
