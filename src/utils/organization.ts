import { MCP_HOSTED_URL } from "../constants/http.js";
import {
  ORGANIZATION_ID_ENV,
  ORGANIZATION_ID_HEADER,
  ORGANIZATION_ID_REQUEST_HEADERS,
  ORGANIZATION_KEY_MISMATCH_ERROR,
  ORGANIZATION_SCOPE_PATTERN,
  ORGANIZATION_SELECTION_REQUIRED_ERROR,
  WORKSPACE_ACCESS_REVOKED_ERROR,
  WORKSPACE_CHOICES_LISTED_MAX,
} from "../constants/organization.js";
import type { Organization } from "../types/api.js";
import type { AuthContext } from "../types/auth.js";
import type { WorkspaceContextResponse } from "../types/workspace.js";

/**
 * The API rejected the workspace an API key selected: the account isn't a
 * member of it, or an organization key named another workspace. Every
 * workspace tool fails the same way until the selection is fixed.
 */
export class InvalidWorkspaceSelectionError extends Error {
  override name = "InvalidWorkspaceSelectionError";
}

/** Whether an API error message means the API key's workspace selection is unusable. */
export function isInvalidSelectionError(message: string, auth: AuthContext): boolean {
  return (
    auth.kind === "apiKey" &&
    auth.organizationId !== undefined &&
    (message === WORKSPACE_ACCESS_REVOKED_ERROR || message.startsWith(ORGANIZATION_KEY_MISMATCH_ERROR))
  );
}

function normalizeOrganizationId(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** The workspace an MCP client selected via `X-Notra-Organization-Id` (or its `X-Organization-Id` alias). */
export function readOrganizationIdHeader(headers: Headers): string | undefined {
  for (const name of ORGANIZATION_ID_REQUEST_HEADERS) {
    const organizationId = normalizeOrganizationId(headers.get(name));
    if (organizationId) {
      return organizationId;
    }
  }
  return undefined;
}

/**
 * The workspace a connection URL is scoped to (`/mcp/{organization}`, id or
 * slug). Returns null for a malformed segment so callers can reject it.
 */
export function readOrganizationScope(params: Record<string, unknown> | undefined): string | null | undefined {
  const value = params?.organization;
  if (value === undefined) {
    return undefined;
  }
  return typeof value === "string" && ORGANIZATION_SCOPE_PATTERN.test(value) ? value : null;
}

/**
 * The workspace an API-key request acts on. A scoped URL wins over the
 * header, because URL-only clients cannot change headers to match it.
 */
export function selectRequestOrganization(scope: string | undefined, headers: Headers): string | undefined {
  return scope ?? readOrganizationIdHeader(headers);
}

/** The workspace selected for the stdio entry point via `NOTRA_ORGANIZATION_ID`. */
export function readOrganizationIdEnv(): string | undefined {
  return normalizeOrganizationId(process.env[ORGANIZATION_ID_ENV]);
}

/** Workspaces the caller is a member of, leaving out pending invitations. */
export function activeWorkspaces(context: WorkspaceContextResponse): WorkspaceContextResponse["workspaces"] {
  return context.workspaces.filter((workspace) => workspace.status === "active");
}

/**
 * Whether workspace tools have nothing to act on: an account API key that
 * reaches several workspaces and selected none of them. The API still answers
 * `/v1/me/workspaces` then, with its oldest membership as `currentWorkspace`,
 * but rejects every workspace endpoint, so that workspace must not be shown as
 * the current one. The API's own `selectionRequired` decides when it sends one.
 */
export function isWorkspaceSelectionRequired(context: WorkspaceContextResponse, auth: AuthContext): boolean {
  if (typeof context.selectionRequired === "boolean") {
    return context.selectionRequired;
  }
  return (
    auth.kind === "apiKey" &&
    !auth.organizationId &&
    context.authentication.type === "apiKey" &&
    activeWorkspaces(context).length > 1
  );
}

function listWorkspaceChoices(workspaces: readonly Organization[]): string {
  const named = workspaces
    .slice(0, WORKSPACE_CHOICES_LISTED_MAX)
    .map((workspace) => `${workspace.name} (${workspace.slug})`);
  const more = workspaces.length - named.length;
  return more > 0 ? `${named.join(", ")} and ${more} more (see \`list_workspaces\`)` : named.join(", ");
}

function describeSelectionRequired(workspaces: readonly Organization[] | undefined): string {
  const choices =
    workspaces && workspaces.length > 0
      ? `this account API key can act in ${workspaces.length} workspaces: ${listWorkspaceChoices(workspaces)}.`
      : "this account API key can act in more than one workspace. Call `list_workspaces` for their slugs.";
  return [
    `No workspace is selected, and ${choices}`,
    "Ask the user which one to use; a tool call cannot choose it.",
    `Then select it for this connection: connect to ${MCP_HOSTED_URL}/<slug> (works in clients that can't send headers), send the slug in ${ORGANIZATION_ID_HEADER} on each request to /mcp, or set ${ORGANIZATION_ID_ENV} and restart (stdio).`,
  ].join(" ");
}

/**
 * Turns the API's workspace-selection failures for account API keys into
 * errors an agent can act on. Other messages pass through unchanged.
 * `workspaces` are the ones the key can choose from, named in the error when known.
 */
export function describeOrganizationError(
  message: string,
  auth: AuthContext,
  workspaces?: readonly Organization[],
): string {
  if (auth.kind !== "apiKey") {
    return message;
  }
  if (message.startsWith(ORGANIZATION_SELECTION_REQUIRED_ERROR)) {
    return describeSelectionRequired(workspaces);
  }
  if (message === WORKSPACE_ACCESS_REVOKED_ERROR && auth.organizationId) {
    return `This API key cannot act in workspace "${auth.organizationId}": the account is not a member of it. Call \`list_workspaces\` to see the workspaces the key can use (on a /mcp/<workspace> URL it is hidden, so connect to /mcp for it), then fix ${ORGANIZATION_ID_ENV} (stdio, restart the server afterwards), the /mcp/<workspace> URL or the ${ORGANIZATION_ID_HEADER} header.`;
  }
  return message;
}
