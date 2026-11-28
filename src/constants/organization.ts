/** Header the Notra API reads to pick the workspace an account API key acts on. */
export const ORGANIZATION_ID_HEADER = "X-Notra-Organization-Id";
/** Incoming MCP request headers that select the workspace, in priority order (Node lowercases header names). */
export const ORGANIZATION_ID_REQUEST_HEADERS = ["x-notra-organization-id", "x-organization-id"] as const;
/** Environment variable that selects the workspace for the stdio entry point. */
export const ORGANIZATION_ID_ENV = "NOTRA_ORGANIZATION_ID";

export const ORGANIZATION_SELECTION_REQUIRED_ERROR = "Organization selection required";
export const WORKSPACE_ACCESS_REVOKED_ERROR = "Workspace access revoked";
/** The API's answer when an organization key names another workspace than its own. */
export const ORGANIZATION_KEY_MISMATCH_ERROR =
  "This API key belongs to a different workspace than X-Notra-Organization-Id names";

/** Most workspaces a selection-required error names before pointing to `list_workspaces`. */
export const WORKSPACE_CHOICES_LISTED_MAX = 10;
/** How long a failed call waits for the workspace list it names in its error. */
export const WORKSPACE_CHOICES_LOOKUP_TIMEOUT_MS = 5_000;

/** Workspace id or slug accepted as the `/mcp/{organization}` path segment. */
export const ORGANIZATION_SCOPE_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
/** How long an OAuth token's workspace is remembered as matching (or not) a scoped URL. */
export const ORGANIZATION_SCOPE_CACHE_TTL_MS = 5 * 60 * 1000;
export const ORGANIZATION_SCOPE_CACHE_MAX_ENTRIES = 1000;
