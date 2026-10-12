import "zod/compile";
import "dotenv/config";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { NodeStreamableHTTPServerTransport, toNodeHandler, toWebRequest } from "@modelcontextprotocol/node";
import { createMcpHandler, isInitializeRequest, isLegacyRequest, type AuthInfo } from "@modelcontextprotocol/server";
import type { NextFunction, Request, Response } from "express";
import {
  DEFAULT_MAX_SESSIONS,
  DEFAULT_MAX_SESSIONS_PER_PRINCIPAL,
  MCP_JSON_BODY_LIMIT_BYTES,
  MCP_PATHS,
  SESSION_RETRY_AFTER_SECONDS,
  SESSION_SWEEP_INTERVAL_MS,
  SESSION_TTL_MS,
} from "./constants/http.js";
import { OAUTH_AUTHORIZATION_SERVER_METADATA_PATH, OAUTH_PROTECTED_RESOURCE_METADATA_PATH } from "./constants/oauth.js";
import { OPENAI_APPS_CHALLENGE_PATH, OPENAI_APPS_CHALLENGE_TOKEN } from "./constants/openai-apps.js";
import { SERVER_FAVICON_URL, SERVER_ICON_SVG_URL } from "./constants/server.js";
import { createServer } from "./server.js";
import type { AuthContext } from "./types/auth.js";
import type { BodyParserError, Session } from "./types/http.js";
import type { Toolset } from "./types/toolset.js";
import { authenticateBearerToken, parseBearerToken } from "./utils/auth.js";
import { readPositiveIntEnv } from "./utils/env.js";
import { readOrganizationScope, selectRequestOrganization } from "./utils/organization.js";
import { getMcpResourceUrl, getOAuthConfig, getProtectedResourceMetadata } from "./utils/oauth-config.js";
import { oauthTokenMatchesScope } from "./utils/oauth-scope.js";
import { runWithRequestSignal } from "./utils/request-signal.js";
import { parseToolsets } from "./utils/toolsets.js";

const app = createMcpExpressApp({ host: "0.0.0.0", jsonLimit: String(MCP_JSON_BODY_LIMIT_BYTES) });

const SESSION_TOKEN_DIGEST_KEY = randomBytes(32);
const MAX_SESSIONS = readPositiveIntEnv("NOTRA_MCP_MAX_SESSIONS", DEFAULT_MAX_SESSIONS);
const MAX_SESSIONS_PER_PRINCIPAL = readPositiveIntEnv(
  "NOTRA_MCP_MAX_SESSIONS_PER_PRINCIPAL",
  DEFAULT_MAX_SESSIONS_PER_PRINCIPAL,
);
const oauthConfig = getOAuthConfig();

const modernHandler = createMcpHandler(
  ({ authInfo, requestInfo }) => {
    if (!authInfo) {
      throw new Error("Authenticated MCP request is missing auth context");
    }
    // Modern requests are single-message and stateless: a tools/call server
    // only needs the module owning the called tool. Mcp-Method/Mcp-Name are
    // required headers on this era and the SDK rejects header/body mismatches
    // before the factory runs, so the headers can be trusted. All of our tool
    // names are ASCII and never use the base64 sentinel encoding; an encoded
    // (or unknown) name simply misses the lookup and gets full registration.
    let onlyTool: string | undefined;
    if (requestInfo?.headers.get("mcp-method") === "tools/call") {
      onlyTool = requestInfo.headers.get("mcp-name") ?? undefined;
    }
    return createServer(fromMcpAuthInfo(authInfo), {
      toolsets: authInfo.extra?.toolsets as ReadonlySet<Toolset>,
      onlyTool,
      trackUsage: true,
      organizationScoped: authInfo.extra?.organizationScope !== undefined,
    });
  },
  {
    legacy: "reject",
    onerror: (error) => {
      console.error("MCP HTTP handler error:", error);
    },
  },
);

const sessions = new Map<string, Session>();

function digestToken(token: string): Buffer {
  return createHmac("sha256", SESSION_TOKEN_DIGEST_KEY).update(token).digest();
}

async function getAuthenticatedSession(req: Request, scope: string | undefined) {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const token = parseBearerToken(req.headers["authorization"]);

  if (!sessionId) {
    return undefined;
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return undefined;
  }

  if (Date.now() - session.lastSeen > SESSION_TTL_MS) {
    closeSession(sessionId, session);
    return undefined;
  }

  // A session belongs to the connection URL it was initialized on.
  if (session.organizationScope !== scope) {
    return undefined;
  }

  if (!token && session.auth.kind !== "oauth") {
    return undefined;
  }

  if (token && session.auth.kind === "oauth") {
    try {
      const nextAuth = await authenticateBearerToken(token, oauthConfig);
      if (
        nextAuth.kind !== "oauth" ||
        nextAuth.userId !== session.auth.userId ||
        nextAuth.organizationId !== session.auth.organizationId
      ) {
        closeSession(sessionId, session);
        return undefined;
      }
      // The session's client shares this object and must see refreshed credentials.
      Object.assign(session.auth, nextAuth);
      session.tokenDigest = digestToken(token);
    } catch {
      closeSession(sessionId, session);
      return undefined;
    }
  } else if (token && !timingSafeEqual(digestToken(token), session.tokenDigest)) {
    return undefined;
  }

  // An API-key session is pinned to the workspace selected at initialize; a
  // request naming another workspace must open its own session.
  if (session.auth.kind === "apiKey") {
    const organizationId = selectRequestOrganization(scope, req.headers);
    if (organizationId !== undefined && organizationId !== session.auth.organizationId) {
      return undefined;
    }
  }

  session.lastSeen = Date.now();
  // Map order doubles as LRU order: move the session to the most recent end.
  sessions.delete(sessionId);
  sessions.set(sessionId, session);
  return session;
}

function closeSession(sessionId: string, session: Session) {
  sessions.delete(sessionId);
  session.transport.close().catch((error: unknown) => {
    console.error("Error closing MCP session:", error);
  });
}

function sessionPrincipal(auth: AuthContext, tokenDigest: Buffer): string {
  return auth.kind === "oauth"
    ? `oauth:${auth.organizationId}:${auth.userId}`
    : `apiKey:${tokenDigest.toString("hex")}`;
}

/**
 * Whether a new session for the principal can be admitted. A principal at its
 * quota makes room by giving up its own least recently used session; sessions
 * of other principals are never evicted, so a caller cannot close someone
 * else's connection by opening many sessions. Returns false when the server
 * is full of other principals' sessions. Admission is side-effect free; the
 * actual eviction happens in `evictForSessionQuota`. Because concurrent
 * initializations can all pass this check before any of them is stored, it is
 * re-checked in `onsessioninitialized` before the session is committed.
 */
function hasSessionSlot(principal: string): boolean {
  let own = 0;
  for (const session of sessions.values()) {
    if (session.principal === principal) {
      own += 1;
    }
  }
  const evictable = Math.max(0, own - MAX_SESSIONS_PER_PRINCIPAL + 1);
  return sessions.size - evictable < MAX_SESSIONS;
}

/**
 * Closes the principal's least recently used sessions beyond its quota to
 * make room for one more. Runs only once the replacement session has been
 * initialized, so a failed server creation or connection — or a client that
 * disconnects mid-initialize — never costs the caller an existing session.
 */
function evictForSessionQuota(principal: string) {
  const own = [...sessions].filter(([, session]) => session.principal === principal);
  for (const [sessionId, session] of own.slice(0, Math.max(0, own.length - MAX_SESSIONS_PER_PRINCIPAL + 1))) {
    closeSession(sessionId, session);
  }
}

// Workspace-scoped URLs announce the same registered resource as /mcp: AuthKit
// rejects unregistered resource indicators (`invalid_target`), and MCP clients
// accept a resource whose path is a prefix of the server URL. The workspace is
// still enforced through the token's consent claim.
function setBearerChallenge(res: Response, error?: string, description?: string) {
  const resource = oauthConfig.resource;
  const metadataUrl = new URL(OAUTH_PROTECTED_RESOURCE_METADATA_PATH, oauthConfig.resource).toString();
  const params = [`resource_metadata="${metadataUrl}"`, `resource="${resource}"`];

  if (error) {
    params.push(`error="${error}"`);
  }

  if (description) {
    params.push(`error_description="${description.replace(/"/g, "'")}"`);
  }

  res.setHeader("WWW-Authenticate", `Bearer ${params.join(", ")}`);
}

function sendUnauthorizedJson(res: Response, description = "Unauthorized") {
  setBearerChallenge(res, "invalid_token", description);
  res.status(401).json({
    jsonrpc: "2.0",
    error: { code: -32001, message: "Unauthorized" },
    id: null,
  });
}

function sendUnauthorizedText(res: Response, description = "Unauthorized") {
  setBearerChallenge(res, "invalid_token", description);
  res.status(401).send("Unauthorized");
}

function toMcpAuthInfo(
  auth: AuthContext,
  toolsets: ReadonlySet<Toolset>,
  organizationScope: string | undefined,
): AuthInfo {
  if (auth.kind === "oauth") {
    return {
      token: auth.token,
      clientId: oauthConfig.clientId ?? auth.userId,
      scopes: auth.scopes,
      resource: new URL(oauthConfig.resource),
      extra: {
        kind: auth.kind,
        userId: auth.userId,
        organizationId: auth.organizationId,
        organizationScope,
        toolsets,
      },
    };
  }

  return {
    token: auth.token,
    clientId: "notra-api-key",
    scopes: ["*"],
    resource: new URL(oauthConfig.resource),
    extra: { kind: auth.kind, organizationId: auth.organizationId, organizationScope, toolsets },
  };
}

function fromMcpAuthInfo(authInfo: AuthInfo): AuthContext {
  const extra = authInfo.extra ?? {};
  if (extra.kind === "oauth") {
    return {
      kind: "oauth",
      token: authInfo.token,
      userId: String(extra.userId),
      organizationId: String(extra.organizationId),
      scopes: authInfo.scopes,
    };
  }
  return {
    kind: "apiKey",
    token: authInfo.token,
    organizationId: typeof extra.organizationId === "string" ? extra.organizationId : undefined,
  };
}

/** Reads `?toolsets=content,geo` (or repeated keys), falling back to `NOTRA_MCP_TOOLSETS`. */
function requestToolsets(req: Request, res: Response): ReadonlySet<Toolset> | undefined {
  const query = req.query?.toolsets;
  try {
    if (query !== undefined && typeof query !== "string" && !Array.isArray(query)) {
      throw new Error("Invalid toolsets query parameter");
    }
    return parseToolsets(query === undefined ? process.env.NOTRA_MCP_TOOLSETS : [query].flat().join(","));
  } catch (error) {
    res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32602, message: error instanceof Error ? error.message : "Invalid toolsets" },
      id: null,
    });
    return undefined;
  }
}

function sendJsonRpcError(res: Response, status: number, code: number, message: string) {
  res.status(status).json({ jsonrpc: "2.0", error: { code, message }, id: null });
}

/**
 * Reads the `/mcp/{organization}` segment. Answers malformed segments itself
 * and returns null, so callers only see a valid scope or undefined.
 */
function requestScope(req: Request, res: Response): string | undefined | null {
  const scope = readOrganizationScope(req.params);
  if (scope === null) {
    sendJsonRpcError(res, 404, -32000, "Unknown workspace in the connection URL");
  }
  return scope;
}

async function authenticateRequest(
  req: Request,
  res: Response,
  scope: string | undefined,
): Promise<AuthContext | undefined> {
  const token = parseBearerToken(req.headers["authorization"]);
  if (!token) {
    sendUnauthorizedJson(res, "Missing bearer token");
    return undefined;
  }

  let auth: AuthContext;
  try {
    auth = await authenticateBearerToken(token, oauthConfig);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid bearer token";
    sendUnauthorizedJson(res, message);
    return undefined;
  }

  // Account API keys pick their workspace per request, from the scoped URL or
  // else the header. OAuth tokens are bound to their consent workspace, so
  // nothing is forwarded for them; a scoped URL naming another workspace is
  // refused rather than silently acting on the token's workspace.
  if (auth.kind === "apiKey") {
    const organizationId = selectRequestOrganization(scope, req.headers);
    return organizationId ? { ...auth, organizationId } : auth;
  }
  if (scope !== undefined) {
    let matches: boolean;
    try {
      matches = await oauthTokenMatchesScope(auth, scope);
    } catch (error) {
      console.error("Error resolving the connection URL workspace:", error);
      sendJsonRpcError(res, 502, -32000, "Could not verify the workspace in the connection URL, try again later");
      return undefined;
    }
    if (!matches) {
      sendJsonRpcError(
        res,
        403,
        -32000,
        `This connection URL is scoped to workspace "${scope}", but the OAuth authorization is for a different workspace. Reconnect and choose "${scope}" when authorizing, or use ${getMcpResourceUrl(oauthConfig)}.`,
      );
      return undefined;
    }
  }
  return auth;
}

async function handleModernRequest(
  req: Request,
  res: Response,
  auth: AuthContext,
  toolsets: ReadonlySet<Toolset>,
  scope: string | undefined,
) {
  const authInfo = toMcpAuthInfo(auth, toolsets, scope);
  const nodeHandler = toNodeHandler({
    fetch: (request, options) => modernHandler.fetch(request, { ...options, authInfo }),
  });
  await nodeHandler(req, res, req.body);
}

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastSeen > SESSION_TTL_MS) {
      closeSession(sessionId, session);
    }
  }
}, SESSION_SWEEP_INTERVAL_MS).unref();

let authServerMetadataCache: { metadata: unknown; expiresAt: number } | undefined;

async function fetchAuthorizationServerMetadata(): Promise<unknown> {
  const now = Date.now();
  if (authServerMetadataCache && now < authServerMetadataCache.expiresAt) {
    return authServerMetadataCache.metadata;
  }

  try {
    const response = await fetch(oauthConfig.authorizationServerMetadataUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      throw new Error(`Authorization server metadata request failed with HTTP ${response.status}`);
    }

    const metadata: unknown = await response.json();
    authServerMetadataCache = { metadata, expiresAt: now + 5 * 60 * 1000 };
    return metadata;
  } catch (error) {
    // Serve stale metadata rather than failing discovery when AuthKit is
    // briefly unreachable.
    if (authServerMetadataCache) {
      return authServerMetadataCache.metadata;
    }
    throw error;
  }
}

async function handleAuthorizationServerMetadata(_req: Request, res: Response) {
  try {
    res.json(await fetchAuthorizationServerMetadata());
  } catch (error) {
    console.error("Error fetching authorization server metadata:", error);
    res.status(502).json({ error: "authorization_server_metadata_unavailable" });
  }
}

app.get(OAUTH_AUTHORIZATION_SERVER_METADATA_PATH, handleAuthorizationServerMetadata);
app.get("/.well-known/oauth-authorization-server/mcp", handleAuthorizationServerMetadata);

app.get(OAUTH_PROTECTED_RESOURCE_METADATA_PATH, (_req, res) => {
  res.json(getProtectedResourceMetadata(oauthConfig));
});

app.get("/.well-known/oauth-protected-resource/mcp", (_req, res) => {
  res.json(getProtectedResourceMetadata(oauthConfig, getMcpResourceUrl(oauthConfig)));
});

app.get("/.well-known/oauth-protected-resource/mcp/:organization", (req, res) => {
  const scope = requestScope(req, res);
  if (scope) {
    res.json(getProtectedResourceMetadata(oauthConfig));
  }
});

app.get(OPENAI_APPS_CHALLENGE_PATH, (_req, res) => {
  res.type("text/plain").send(OPENAI_APPS_CHALLENGE_TOKEN);
});

app.get("/favicon.ico", (_req, res) => {
  res.redirect(301, SERVER_FAVICON_URL);
});

app.get("/favicon.svg", (_req, res) => {
  res.redirect(301, SERVER_ICON_SVG_URL);
});

app.post("/register", (_req, res) => {
  res.status(404).end();
});

app.post(MCP_PATHS, (req, res) => {
  // A client that goes away before the response completes (tab closed, fetch
  // aborted, connection dropped) must cancel the in-flight tool work upstream.
  // The signal rides AsyncLocalStorage so tool handlers and the Notra API
  // client pick it up without threading it through every call.
  const disconnect = new AbortController();
  res.on("close", () => {
    if (!res.writableFinished) disconnect.abort();
  });
  return runWithRequestSignal(disconnect.signal, () => handleMcpPost(req, res));
});

async function handleMcpPost(req: Request, res: Response) {
  const scope = requestScope(req, res);
  if (scope === null) {
    return;
  }
  try {
    const webRequest = await toWebRequest(req, req.body);
    if (!(await isLegacyRequest(webRequest, req.body))) {
      const toolsets = requestToolsets(req, res);
      if (!toolsets) {
        return;
      }
      const auth = await authenticateRequest(req, res, scope);
      if (auth) {
        await handleModernRequest(req, res, auth, toolsets, scope);
      }
      return;
    }

    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: NodeStreamableHTTPServerTransport;

    if (sessionId) {
      const session = await getAuthenticatedSession(req, scope);
      if (!session) {
        sendUnauthorizedJson(res);
        return;
      }
      transport = session.transport;
    } else if (isInitializeRequest(req.body)) {
      const toolsets = requestToolsets(req, res);
      if (!toolsets) {
        return;
      }
      const auth = await authenticateRequest(req, res, scope);
      if (!auth) {
        return;
      }

      const tokenDigest = digestToken(auth.token);
      const principal = sessionPrincipal(auth, tokenDigest);
      if (!hasSessionSlot(principal)) {
        res.setHeader("Retry-After", String(SESSION_RETRY_AFTER_SECONDS));
        res.status(503).json({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Too many active sessions, try again later" },
          id: null,
        });
        return;
      }
      const server = createServer(auth, { toolsets, trackUsage: true, organizationScoped: scope !== undefined });

      transport = new NodeStreamableHTTPServerTransport({
        sessionIdGenerator: randomUUID,
        onsessioninitialized: (id: string) => {
          const session = {
            transport,
            tokenDigest,
            auth,
            principal,
            organizationScope: scope,
            lastSeen: Date.now(),
          };
          // A concurrent burst can fill the server between admission and
          // now. Close the fresh transport instead of exceeding the cap; the
          // client's re-initialize then gets a clean 503 at admission.
          if (!hasSessionSlot(principal)) {
            closeSession(id, session);
            return;
          }
          evictForSessionQuota(principal);
          sessions.set(id, session);
        },
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid) {
          sessions.delete(sid);
        }
      };

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: No valid session ID provided" },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling POST /mcp:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
}

app.get(MCP_PATHS, async (req, res) => {
  const scope = requestScope(req, res);
  if (scope === null) {
    return;
  }
  const session = await getAuthenticatedSession(req, scope);
  if (!session) {
    sendUnauthorizedText(res);
    return;
  }
  await session.transport.handleRequest(req, res);
});

app.delete(MCP_PATHS, async (req, res) => {
  const scope = requestScope(req, res);
  if (scope === null) {
    return;
  }
  const session = await getAuthenticatedSession(req, scope);
  if (!session) {
    sendUnauthorizedText(res);
    return;
  }
  try {
    await session.transport.handleRequest(req, res);
  } catch (error) {
    console.error("Error handling session termination:", error);
    if (!res.headersSent) {
      res.status(500).send("Error processing session termination");
    }
  }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Body parser failures (oversized or malformed JSON) would otherwise be answered
// with Express's HTML error page, which MCP clients cannot surface.
app.use((error: BodyParserError, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent || !error.status || error.status >= 500) {
    next(error);
    return;
  }
  const rpcError =
    error.type === "entity.too.large"
      ? { code: -32600, message: `Request body exceeds the ${MCP_JSON_BODY_LIMIT_BYTES / (1024 * 1024)} MB limit` }
      : error.type === "entity.parse.failed"
        ? { code: -32700, message: "Parse error: invalid JSON" }
        : { code: -32600, message: "Invalid request body" };
  res.status(error.status).json({ jsonrpc: "2.0", error: rpcError, id: null });
});

const PORT = parseInt(process.env.PORT || "3000", 10);
const listener = app.listen(PORT, () => {
  const address = listener.address();
  console.log(`Notra MCP HTTP server listening on port ${typeof address === "object" ? address?.port : PORT}`);
});
