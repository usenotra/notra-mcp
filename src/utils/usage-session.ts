import { createHash, randomUUID } from "node:crypto";
import { USAGE_SESSION_IDLE_MS, USAGE_SESSION_MAX_ENTRIES } from "../constants/usage.js";
import type { AuthContext } from "../types/auth.js";
import { selectRequestOrganization } from "./organization.js";
import { getOrganizationScope } from "./request-scope.js";

type SessionEntry = { id: string; lastSeen: number };

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/**
 * The caller and the workspace the request acts on, read from verified auth:
 * an OAuth token's user and consent workspace, or an API key's hash and the
 * workspace picked the same way `requestAuth` picks it for tools.
 */
function callerKey(auth: AuthContext, headers: Headers | undefined): [string, string] {
  if (auth.kind === "oauth") return [`oauth:${auth.userId}`, auth.organizationId];
  const workspace = selectRequestOrganization(getOrganizationScope(), headers ?? new Headers());
  return [`key:${sha256(auth.token)}`, workspace ?? ""];
}

/**
 * Groups one caller's requests into sessions. The server is stateless, so
 * clients on MCP 2026-07-28 send no `Mcp-Session-Id`. Requests from the same
 * caller, workspace and user agent share an id until 30 minutes pass without
 * one. The user agent stands in for the client because 2025-era clients only
 * name themselves in `initialize`, while every request carries the header.
 */
export function createUsageSessions(idleMs = USAGE_SESSION_IDLE_MS, maxEntries = USAGE_SESSION_MAX_ENTRIES) {
  const sessions = new Map<string, SessionEntry>();

  return (auth: AuthContext | undefined, headers: Headers | undefined, now = Date.now()): string | undefined => {
    if (!auth) return undefined;

    const key = sha256(JSON.stringify([...callerKey(auth, headers), headers?.get("user-agent") ?? ""]));
    const existing = sessions.get(key);
    sessions.delete(key);
    const entry =
      existing && now - existing.lastSeen <= idleMs
        ? { id: existing.id, lastSeen: now }
        : { id: randomUUID(), lastSeen: now };
    sessions.set(key, entry);

    // Map iteration follows insertion order, and every hit re-inserts its key,
    // so the first key is always the least recently seen caller.
    while (sessions.size > maxEntries) {
      const oldest = sessions.keys().next().value;
      if (oldest === undefined) break;
      sessions.delete(oldest);
    }
    return entry.id;
  };
}
