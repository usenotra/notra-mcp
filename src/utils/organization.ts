import type { IncomingHttpHeaders } from "node:http";
import {
  ORGANIZATION_ID_ENV,
  ORGANIZATION_ID_HEADER,
  ORGANIZATION_ID_REQUEST_HEADERS,
  ORGANIZATION_SCOPE_PATTERN,
  ORGANIZATION_SELECTION_REQUIRED_ERROR,
  WORKSPACE_ACCESS_REVOKED_ERROR,
} from "../constants/organization.js";
import type { AuthContext } from "../types/auth.js";

function normalizeOrganizationId(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value;
  const trimmed = first?.trim();
  return trimmed ? trimmed : undefined;
}

/** The workspace an MCP client selected via `X-Notra-Organization-Id` (or its `X-Organization-Id` alias). */
export function readOrganizationIdHeader(headers: IncomingHttpHeaders): string | undefined {
  for (const name of ORGANIZATION_ID_REQUEST_HEADERS) {
    const organizationId = normalizeOrganizationId(headers[name]);
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
export function selectRequestOrganization(scope: string | undefined, headers: IncomingHttpHeaders): string | undefined {
  return scope ?? readOrganizationIdHeader(headers);
}

/** The workspace selected for the stdio entry point via `NOTRA_ORGANIZATION_ID`. */
export function readOrganizationIdEnv(): string | undefined {
  return normalizeOrganizationId(process.env[ORGANIZATION_ID_ENV]);
}

/**
 * Turns the API's workspace-selection failures for account API keys into
 * errors an agent can act on. Other messages pass through unchanged.
 */
export function describeOrganizationError(message: string, auth: AuthContext): string {
  if (auth.kind !== "apiKey") {
    return message;
  }
  if (message.startsWith(ORGANIZATION_SELECTION_REQUIRED_ERROR)) {
    return `This Notra account API key can access several workspaces, so each request must name one. Call \`list_workspaces\` to find the workspace id, then set ${ORGANIZATION_ID_ENV} (stdio), or connect to /mcp/<workspace> or send the ${ORGANIZATION_ID_HEADER} header (HTTP), and reconnect.`;
  }
  if (message === WORKSPACE_ACCESS_REVOKED_ERROR && auth.organizationId) {
    return `This API key cannot act in workspace "${auth.organizationId}": the account is not a member of it. Call \`list_workspaces\` to see the workspaces the key can use, then fix ${ORGANIZATION_ID_ENV} (stdio, restart the server afterwards), the /mcp/<workspace> URL or the ${ORGANIZATION_ID_HEADER} header.`;
  }
  return message;
}
