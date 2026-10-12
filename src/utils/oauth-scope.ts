import { ORGANIZATION_SCOPE_CACHE_MAX_ENTRIES, ORGANIZATION_SCOPE_CACHE_TTL_MS } from "../constants/organization.js";
import { NotraClient } from "../notra-client.js";
import type { OAuthAuthContext } from "../types/auth.js";

const scopeMatches = new Map<string, { matches: boolean; expiresAt: number }>();

/**
 * Whether an OAuth token's consent workspace is the one a scoped connection
 * URL names. The URL may carry a slug while the token only carries the id, so
 * a non-id scope is resolved through `/v1/me/workspaces` and the answer cached
 * per workspace/scope pair.
 */
export async function oauthTokenMatchesScope(auth: OAuthAuthContext, scope: string): Promise<boolean> {
  if (auth.organizationId === scope) {
    return true;
  }

  const key = `${auth.organizationId}\u0000${scope}`;
  const now = Date.now();
  const cached = scopeMatches.get(key);
  if (cached && cached.expiresAt > now) {
    return cached.matches;
  }

  const { currentWorkspace } = await new NotraClient(auth).getWorkspaceContext();
  const matches = currentWorkspace.id === scope || currentWorkspace.slug === scope;

  scopeMatches.delete(key);
  if (scopeMatches.size >= ORGANIZATION_SCOPE_CACHE_MAX_ENTRIES) {
    const oldest = scopeMatches.keys().next().value;
    if (oldest !== undefined) scopeMatches.delete(oldest);
  }
  scopeMatches.set(key, { matches, expiresAt: now + ORGANIZATION_SCOPE_CACHE_TTL_MS });
  return matches;
}
