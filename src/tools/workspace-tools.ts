import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import type { NotraClient } from "../notra-client.js";
import {
  listWorkspacesInputSchema,
  listWorkspacesOutputSchema,
  whoAmIInputSchema,
  whoAmIOutputSchema,
} from "../schemas/workspace.js";
import type { WorkspaceContextResponse, WhoAmIResponse } from "../types/workspace.js";
import { handleError } from "../utils/mcp.js";

function projectWorkspaceContext(context: WorkspaceContextResponse): WorkspaceContextResponse {
  const currentWorkspace = {
    id: context.currentWorkspace.id,
    slug: context.currentWorkspace.slug,
    name: context.currentWorkspace.name,
    logo: context.currentWorkspace.logo,
  };

  return {
    currentWorkspace,
    workspaces: context.workspaces.map((workspace) => ({
      id: workspace.id,
      slug: workspace.slug,
      name: workspace.name,
      logo: workspace.logo,
      role: workspace.role,
      status: workspace.status,
      isCurrent: workspace.isCurrent,
    })),
    authentication:
      context.authentication.type === "oauth"
        ? {
            type: "oauth",
            accountId: context.authentication.accountId,
            scopes: context.authentication.scopes,
          }
        : { type: "apiKey" },
  };
}

export async function getWhoAmI(client: NotraClient): Promise<WhoAmIResponse> {
  const context = await client.getWorkspaceContext();
  return {
    workspace: context.currentWorkspace,
    authentication: context.authentication,
  };
}

export function registerWorkspaceTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "whoami",
    {
      description:
        "Show the current Notra workspace and authenticated account. Use this to confirm which workspace this MCP connection operates against.",
      annotations: { title: "Who Am I", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(whoAmIInputSchema),
      outputSchema: shareJsonSchema(whoAmIOutputSchema),
    },
    async () => {
      return handleError(() => getWhoAmI(client));
    },
  );

  server.registerTool(
    "list_workspaces",
    {
      description:
        "List accepted and pending Notra workspaces available to the authenticated account. Organization API keys only return their current workspace.",
      annotations: { title: "List Workspaces", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listWorkspacesInputSchema),
      outputSchema: shareJsonSchema(listWorkspacesOutputSchema),
    },
    async () => {
      return handleError(async () => projectWorkspaceContext(await client.getWorkspaceContext(true)));
    },
  );
}
