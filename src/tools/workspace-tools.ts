import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import type { NotraClient } from "../notra-client.js";
import {
  listWorkspacesInputSchema,
  listWorkspacesOutputSchema,
  whoAmIInputSchema,
  whoAmIOutputSchema,
} from "../schemas/workspace.js";
import type { Organization } from "../types/api.js";
import type { WorkspaceContextResponse, WorkspaceListResponse, WhoAmIResponse } from "../types/workspace.js";
import { handleError } from "../utils/mcp.js";
import { isWorkspaceSelectionRequired } from "../utils/organization.js";
import { getRequestAuth } from "../utils/request-scope.js";

function projectOrganization(organization: Organization): Organization {
  return { id: organization.id, slug: organization.slug, name: organization.name, logo: organization.logo };
}

/**
 * `selected` is false when the API's `currentWorkspace` is only its fallback
 * for a key that selected no usable workspace; then nothing is shown as current.
 */
function projectWorkspaceContext(context: WorkspaceContextResponse, selected: boolean): WorkspaceListResponse {
  return {
    currentWorkspace: selected ? projectOrganization(context.currentWorkspace) : null,
    selectionRequired: !selected,
    workspaces: context.workspaces.map((workspace) => ({
      ...projectOrganization(workspace),
      role: workspace.role,
      status: workspace.status,
      isCurrent: selected && workspace.isCurrent,
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
  const selected = !isWorkspaceSelectionRequired(context, getRequestAuth());
  return {
    workspace: selected ? projectOrganization(context.currentWorkspace) : null,
    selectionRequired: !selected,
    authentication: context.authentication,
  };
}

export function registerWhoAmITool(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "whoami",
      description:
        "Show the current Notra workspace and authenticated account. Use this to confirm which workspace this MCP connection operates against. Returns workspace (id, slug, name, logo), selectionRequired and authentication, whose type is apiKey or oauth; OAuth connections also include accountId and the granted scopes. When an account API key reaches several workspaces and none is selected, workspace is null and selectionRequired is true: ask the user which workspace to use (list_workspaces shows them) before calling other tools.",
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
        "List accepted and pending Notra workspaces available to the authenticated account. Organization API keys only return their current workspace. Account API keys return every workspace their user belongs to; the user picks the one other tools act on with NOTRA_ORGANIZATION_ID (stdio), or the /mcp/<workspace> URL or X-Notra-Organization-Id header (HTTP). Returns currentWorkspace (id, slug, name, logo), selectionRequired, workspaces (each with id, slug, name, logo, role, status and isCurrent), and authentication, whose type is apiKey or oauth; OAuth connections also include accountId and the granted scopes. While selectionRequired is true, currentWorkspace is null, no workspace is current and other tools fail until a workspace is selected.",
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
        const auth = getRequestAuth();
        try {
          const context = await client.getWorkspaceContext(true);
          return projectWorkspaceContext(context, !isWorkspaceSelectionRequired(context, auth));
        } catch (error) {
          // A stale workspace selection (e.g. NOTRA_ORGANIZATION_ID read at stdio startup) must not block the
          // listing users need to pick a valid one; the endpoint works without the header. When a selection
          // was dropped, the current workspace is the API's fallback, not one the tools can act in.
          try {
            const context = await client.getWorkspaceContext(true, true);
            const droppedSelection = auth.kind === "apiKey" && auth.organizationId !== undefined;
            return projectWorkspaceContext(context, !droppedSelection && !isWorkspaceSelectionRequired(context, auth));
          } catch {
            throw error;
          }
        }
      });
    },
  );
}
