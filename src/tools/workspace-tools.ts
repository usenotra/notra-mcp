import type { ToolRegistry } from "../types/server.js";
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

export function registerWhoAmITool(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "whoami",
      description:
        "Show the current Notra workspace and authenticated account. Use this to confirm which workspace this MCP connection operates against. Returns workspace (id, slug, name, logo) and authentication, whose type is apiKey or oauth; OAuth connections also include accountId and the granted scopes.",
      annotations: {
        title: "Who Am I",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(whoAmIInputSchema),
      outputSchema: shareJsonSchema(whoAmIOutputSchema),
    },
    async () => {
      return handleError(() => getWhoAmI(client));
    },
  );
}

/** Workspace discovery; omitted on workspace-scoped connection URLs (`/mcp/{organization}`). */
export function registerListWorkspacesTool(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_workspaces",
      description:
        "List accepted and pending Notra workspaces available to the authenticated account. Organization API keys only return their current workspace. Account API keys return every workspace their user belongs to; the user picks the one other tools act on with NOTRA_ORGANIZATION_ID (stdio), or the /mcp/<workspace> URL or X-Notra-Organization-Id header (HTTP). Returns currentWorkspace (id, slug, name, logo), workspaces (each with id, slug, name, logo, role, status and isCurrent), and authentication, whose type is apiKey or oauth; OAuth connections also include accountId and the granted scopes.",
      annotations: {
        title: "List Workspaces",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listWorkspacesInputSchema),
      outputSchema: shareJsonSchema(listWorkspacesOutputSchema),
    },
    async () => {
      return handleError(async () => {
        try {
          return projectWorkspaceContext(await client.getWorkspaceContext(true));
        } catch (error) {
          // A stale workspace selection (e.g. NOTRA_ORGANIZATION_ID read at stdio startup) must not block the
          // listing users need to pick a valid one; the endpoint works without the header.
          try {
            return projectWorkspaceContext(await client.getWorkspaceContext(true, true));
          } catch {
            throw error;
          }
        }
      });
    },
  );
}
