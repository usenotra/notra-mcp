import "dotenv/config";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import type { Request, Response } from "express";
import { OAUTH_PROTECTED_RESOURCE_METADATA_PATH } from "./constants/oauth.js";
import { createServer } from "./server.js";
import type { AuthContext } from "./types/auth.js";
import { authenticateBearerToken, parseBearerToken } from "./utils/auth.js";
import { getOAuthConfig, getProtectedResourceMetadata } from "./utils/oauth-config.js";

const app = createMcpExpressApp({ host: "0.0.0.0" });

const SESSION_TTL_MS = 30 * 60 * 1000;
const SESSION_TOKEN_DIGEST_KEY = randomBytes(32);
const oauthConfig = getOAuthConfig();

type Session = {
  transport: StreamableHTTPServerTransport;
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

function getRequestOrigin(req: Request): string {
  return oauthConfig.resource;
}

function getProtectedResourceMetadataUrl(req: Request): string {
  return new URL(OAUTH_PROTECTED_RESOURCE_METADATA_PATH, getRequestOrigin(req)).toString();
}

function setBearerChallenge(req: Request, res: Response, error?: string, description?: string) {
  const params = [`resource_metadata="${getProtectedResourceMetadataUrl(req)}"`, `resource="${oauthConfig.resource}"`];

  if (error) {
    params.push(`error="${error}"`);
  }

  if (description) {
    params.push(`error_description="${description.replace(/"/g, "'")}"`);
  }

  res.setHeader("WWW-Authenticate", `Bearer ${params.join(", ")}`);
}

function sendUnauthorizedJson(req: Request, res: Response, description = "Unauthorized") {
  setBearerChallenge(req, res, "invalid_token", description);
  res.status(401).json({
    jsonrpc: "2.0",
    error: { code: -32001, message: "Unauthorized" },
    id: null,
  });
}

function sendUnauthorizedText(req: Request, res: Response, description = "Unauthorized") {
  setBearerChallenge(req, res, "invalid_token", description);
  res.status(401).send("Unauthorized");
}

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastSeen > SESSION_TTL_MS) {
      sessions.delete(sessionId);
    }
  }
}, SESSION_TTL_MS).unref();

app.get("/.well-known/oauth-authorization-server", (_req, res) => {
  res.status(404).end();
});

app.get("/.well-known/oauth-protected-resource", (_req, res) => {
  res.json(getProtectedResourceMetadata(oauthConfig));
});

app.post("/register", (_req, res) => {
  res.status(404).end();
});

app.post("/mcp", async (req, res) => {
  try {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId) {
      const session = await getAuthenticatedSession(req);
      if (!session) {
        sendUnauthorizedJson(req, res);
        return;
      }
      transport = session.transport;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      const token = parseBearerToken(req.headers["authorization"]);
      if (!token) {
        sendUnauthorizedJson(req, res, "Missing bearer token");
        return;
      }

      let auth: AuthContext;
      try {
        auth = await authenticateBearerToken(token, oauthConfig);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Invalid bearer token";
        sendUnauthorizedJson(req, res, message);
        return;
      }

      const tokenDigest = digestToken(token);
      const server = createServer(auth);

      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id: string) => {
          sessions.set(id, { transport, tokenDigest, auth, lastSeen: Date.now() });
        },
      } as ConstructorParameters<typeof StreamableHTTPServerTransport>[0]);

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
    sendUnauthorizedText(req, res);
    return;
  }
  await session.transport.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  const session = await getAuthenticatedSession(req);
  if (!session) {
    sendUnauthorizedText(req, res);
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
