import { createHash, randomUUID } from "node:crypto";
import { decodeJwt } from "jose";
import { USAGE_SESSION_IDLE_MS, USAGE_SESSION_MAX_ENTRIES } from "../constants/usage.js";
import { parseBearerToken } from "./auth.js";
import { getOrganizationScope } from "./request-scope.js";

type SessionEntry = { id: string; lastSeen: number };

function callerIdentity(token: string): string {
  // Read without verification: the value only groups requests for analytics,
  // and authentication still verifies the token before any tool runs.
  try {
    const { sub } = decodeJwt(token);
    if (typeof sub === "string" && sub.length > 0) return `sub:${sub}`;
  } catch {
    // Not a JWT, so it is an API key.
  }
  return `key:${createHash("sha256").update(token).digest("hex")}`;
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

  return (headers: Headers | undefined, now = Date.now()): string | undefined => {
    const token = parseBearerToken(headers?.get("authorization") ?? undefined);
    if (!token) return undefined;

    const workspace = getOrganizationScope() ?? headers?.get("x-notra-organization-id") ?? "";
    const key = createHash("sha256")
      .update(JSON.stringify([callerIdentity(token), workspace, headers?.get("user-agent") ?? ""]))
      .digest("hex");

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
