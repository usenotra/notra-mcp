import {
  listIntegrationsSchema,
  createGithubIntegrationSchema,
  deleteIntegrationSchema,
  listGithubActivitySchema,
} from "../schemas/integration.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerIntegrationTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_integrations",
      description:
        "List enabled GitHub and Linear integrations for your organization. Returns github (id, displayName, owner, repo, defaultBranch; one entry per connected repository), linear (id, displayName, linearOrganizationName, linearTeamId, linearTeamName), slack and the organization. The slack array is always empty; Slack connections are managed in the Notra dashboard and are not exposed by this API.",
      annotations: {
        title: "List Integrations",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listIntegrationsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listIntegrations")),
    },
    () => handleError(() => client.listIntegrations()),
  );

  server.tool(
    {
      name: "list_github_activity",
      description:
        "List what shipped in a connected GitHub repository: pull requests merged into the default branch (default), commits on it, or published releases, within a time window (default: last 7 days). Returns integration (the repository read), type, since and until (the window used), items (ref, title, body, author, url, occurredAt), pagination (page, nextPage) and the organization. Use it to decide what to write about, then write the post yourself with create_post, or let Notra draft it with generate_post. Reads GitHub live; follow pagination.nextPage until it is null, since a page can hold fewer items than the page size.",
      annotations: {
        title: "List GitHub Activity",
        readOnlyHint: true,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGithubActivitySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGitHubActivity")),
    },
    ({ integrationId, ...params }) => handleError(() => client.listGithubActivity(integrationId, params)),
  );

  server.tool(
    {
      name: "create_github_integration",
      description:
        "Connect a public GitHub repository for content generation. For private repositories, configure access in the Notra dashboard; never request or send a personal access token in chat. Returns github, the new integration (id, displayName, owner, repo, defaultBranch), and the organization.",
      annotations: {
        title: "Create GitHub Integration",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(createGithubIntegrationSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createGitHubIntegration")),
    },
    ({ owner, repo, branch }) =>
      handleError(() => client.createGithubIntegration({ owner, repo, branch: branch ?? undefined })),
  );

  server.tool(
    {
      name: "delete_integration",
      description:
        "Permanently disconnect a GitHub or Linear integration from Notra; it cannot be restored and has to be connected again to be used. Schedules and event triggers that relied on it are disabled, and the response lists them in disabledSchedules and disabledEvents (id, name) along with id, the removed integration's ID, and the organization. Confirm with the user first.",
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
