import {
  listIntegrationsSchema,
  createGithubIntegrationSchema,
  deleteIntegrationSchema,
  listGithubActivitySchema,
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
      description:
        "List enabled GitHub and Linear integrations for your organization. Includes organization details. The slack array is always empty; Slack connections are managed in the Notra dashboard and are not exposed by this API.",
      annotations: { title: "List Integrations", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listIntegrationsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listIntegrations")),
    },
    () => handleError(() => client.listIntegrations()),
  );

  server.registerTool(
    "list_github_activity",
    {
      description:
        "List what shipped in a connected GitHub repository: pull requests merged into the default branch (default), commits on it, or published releases, within a time window (default: last 7 days). Each item has the title, body, author and link. Use it to decide what to write about, then write the post yourself with create_post, or let Notra draft it with generate_post. Reads GitHub live; follow pagination.nextPage until it is null, since a page can hold fewer items than the page size.",
      annotations: {
        title: "List GitHub Activity",
        readOnlyHint: true,
        openWorldHint: true,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(listGithubActivitySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGitHubActivity")),
    },
    ({ integrationId, ...params }) => handleError(() => client.listGithubActivity(integrationId, params)),
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
