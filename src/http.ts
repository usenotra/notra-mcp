import "dotenv/config";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { NodeStreamableHTTPServerTransport, toNodeHandler, toWebRequest } from "@modelcontextprotocol/node";
import { createMcpHandler, isInitializeRequest, isLegacyRequest, type AuthInfo } from "@modelcontextprotocol/server";
import type { Request, Response } from "express";
import {
  OAUTH_AUTHORIZATION_SERVER_MCP_METADATA_PATH,
  OAUTH_AUTHORIZATION_SERVER_METADATA_PATH,
  OAUTH_PROTECTED_RESOURCE_MCP_METADATA_PATH,
  OAUTH_PROTECTED_RESOURCE_METADATA_PATH,
} from "./constants/oauth.js";
import { createServer } from "./server.js";
import type { AuthContext } from "./types/auth.js";
import { authenticateBearerToken, parseBearerToken } from "./utils/auth.js";
import { getMcpResourceUrl, getOAuthConfig, getProtectedResourceMetadata } from "./utils/oauth-config.js";

const app = createMcpExpressApp({ host: "0.0.0.0" });

const SESSION_TTL_MS = 30 * 60 * 1000;
const SESSION_TOKEN_DIGEST_KEY = randomBytes(32);
const oauthConfig = getOAuthConfig();

const modernHandler = createMcpHandler(
  ({ authInfo }) => {
    if (!authInfo) {
      throw new Error("Authenticated MCP request is missing auth context");
    }
    return createServer(authInfo.token);
  },
  {
    legacy: "reject",
    onerror: (error) => {
      console.error("MCP HTTP handler error:", error);
    },
  },
);

type Session = {
  transport: NodeStreamableHTTPServerTransport;
  tokenDigest: Buffer;
  auth: AuthContext;
  lastSeen: number;
};

const sessions = new Map<string, Session>();

function digestToken(token: string): Buffer {
  return createHmac("sha256", SESSION_TOKEN_DIGEST_KEY).update(token).digest();
}

function tokenMatches(token: string, expectedDigest: Buffer): boolean {
  const actualDigest = digestToken(token);
  return timingSafeEqual(actualDigest, expectedDigest);
}

async function getAuthenticatedSession(req: Request) {
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
    sessions.delete(sessionId);
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
        sessions.delete(sessionId);
        return undefined;
      }
      session.auth = nextAuth;
      session.tokenDigest = digestToken(token);
    } catch {
      sessions.delete(sessionId);
      return undefined;
    }
  } else if (token && !tokenMatches(token, session.tokenDigest)) {
    return undefined;
  }

  session.lastSeen = Date.now();
  return session;
}

function getProtectedResourceMetadataUrl(): string {
  return new URL(OAUTH_PROTECTED_RESOURCE_METADATA_PATH, oauthConfig.resource).toString();
}

function setBearerChallenge(res: Response, error?: string, description?: string) {
  const params = [`resource_metadata="${getProtectedResourceMetadataUrl()}"`, `resource="${oauthConfig.resource}"`];

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

function toMcpAuthInfo(auth: AuthContext): AuthInfo {
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
      },
    };
  }

  return {
    token: auth.token,
    clientId: "notra-api-key",
    scopes: ["*"],
    resource: new URL(oauthConfig.resource),
    extra: { kind: auth.kind },
  };
}

async function authenticateRequest(req: Request, res: Response): Promise<AuthContext | undefined> {
  const token = parseBearerToken(req.headers["authorization"]);
  if (!token) {
    sendUnauthorizedJson(res, "Missing bearer token");
    return undefined;
  }

  try {
    return await authenticateBearerToken(token, oauthConfig);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid bearer token";
    sendUnauthorizedJson(res, message);
    return undefined;
  }
}

async function handleModernRequest(req: Request, res: Response, auth: AuthContext) {
  const authInfo = toMcpAuthInfo(auth);
  const nodeHandler = toNodeHandler({
    fetch: (request, options) => modernHandler.fetch(request, { ...options, authInfo }),
  });
  await nodeHandler(req, res, req.body);
}

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastSeen > SESSION_TTL_MS) {
      sessions.delete(sessionId);
    }
  }
}, SESSION_TTL_MS).unref();

const AUTH_SERVER_METADATA_TTL_MS = 5 * 60 * 1000;
const AUTH_SERVER_METADATA_TIMEOUT_MS = 10_000;

let authServerMetadataCache: { metadata: unknown; expiresAt: number } | undefined;

async function fetchAuthorizationServerMetadata(): Promise<unknown> {
  const now = Date.now();
  if (authServerMetadataCache && now < authServerMetadataCache.expiresAt) {
    return authServerMetadataCache.metadata;
  }

  try {
    const response = await fetch(oauthConfig.authorizationServerMetadataUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(AUTH_SERVER_METADATA_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new Error(`Authorization server metadata request failed with HTTP ${response.status}`);
    }

    const metadata: unknown = await response.json();
    authServerMetadataCache = { metadata, expiresAt: now + AUTH_SERVER_METADATA_TTL_MS };
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
app.get(OAUTH_AUTHORIZATION_SERVER_MCP_METADATA_PATH, handleAuthorizationServerMetadata);

app.get(OAUTH_PROTECTED_RESOURCE_METADATA_PATH, (_req, res) => {
  res.json(getProtectedResourceMetadata(oauthConfig));
});

app.get(OAUTH_PROTECTED_RESOURCE_MCP_METADATA_PATH, (_req, res) => {
  res.json(getProtectedResourceMetadata(oauthConfig, getMcpResourceUrl(oauthConfig)));
});

app.post("/register", (_req, res) => {
  res.status(404).end();
});

app.post("/mcp", async (req, res) => {
  try {
    const webRequest = await toWebRequest(req, req.body);
    if (!(await isLegacyRequest(webRequest, req.body))) {
      const auth = await authenticateRequest(req, res);
      if (auth) {
        await handleModernRequest(req, res, auth);
      }
      return;
    }

    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: NodeStreamableHTTPServerTransport;

    if (sessionId) {
      const session = await getAuthenticatedSession(req);
      if (!session) {
        sendUnauthorizedJson(res);
        return;
      }
      transport = session.transport;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      const auth = await authenticateRequest(req, res);
      if (!auth) {
        return;
      }

      const tokenDigest = digestToken(auth.token);
      const server = createServer(auth);

      transport = new NodeStreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id: string) => {
          sessions.set(id, { transport, tokenDigest, auth, lastSeen: Date.now() });
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
});

app.get("/mcp", async (req, res) => {
  const session = await getAuthenticatedSession(req);
  if (!session) {
    sendUnauthorizedText(res);
    return;
  }
  await session.transport.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  const session = await getAuthenticatedSession(req);
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

const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`Notra MCP HTTP server listening on port ${PORT}`);
});
