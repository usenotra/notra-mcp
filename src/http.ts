import "dotenv/config";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import type { Request } from "express";
import { createServer } from "./server.js";

const app = createMcpExpressApp({ host: "0.0.0.0" });

const SESSION_TTL_MS = 30 * 60 * 1000;

type Session = {
  transport: StreamableHTTPServerTransport;
  tokenDigest: Buffer;
  lastSeen: number;
};

const sessions: Record<string, Session> = {};

function parseBearerToken(authorization: string | string[] | undefined): string | undefined {
  if (typeof authorization !== "string") {
    return undefined;
  }

  const match = authorization.match(/^Bearer\s+(\S+)$/);
  return match?.[1];
}

function digestToken(token: string): Buffer {
  return createHash("sha256").update(token).digest();
}

function tokenMatches(token: string, expectedDigest: Buffer): boolean {
  const actualDigest = digestToken(token);
  return timingSafeEqual(actualDigest, expectedDigest);
}

function getAuthenticatedSession(req: Request) {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const token = parseBearerToken(req.headers["authorization"]);

  if (!sessionId || !token) {
    return undefined;
  }

  const session = sessions[sessionId];
  if (!session || !tokenMatches(token, session.tokenDigest)) {
    return undefined;
  }

  if (Date.now() - session.lastSeen > SESSION_TTL_MS) {
    delete sessions[sessionId];
    return undefined;
  }

  session.lastSeen = Date.now();
  return session;
}

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of Object.entries(sessions)) {
    if (now - session.lastSeen > SESSION_TTL_MS) {
      delete sessions[sessionId];
    }
  }
}, SESSION_TTL_MS).unref();

app.get("/.well-known/oauth-authorization-server", (_req, res) => {
  res.status(404).end();
});

app.get("/.well-known/oauth-protected-resource", (_req, res) => {
  res.status(404).end();
});

app.post("/register", (_req, res) => {
  res.status(404).end();
});

app.post("/mcp", async (req, res) => {
  try {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId) {
      const session = getAuthenticatedSession(req);
      if (!session) {
        res.status(401).json({
          jsonrpc: "2.0",
          error: { code: -32001, message: "Unauthorized" },
          id: null,
        });
        return;
      }
      transport = session.transport;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      const apiKey = parseBearerToken(req.headers["authorization"]);
      if (!apiKey) {
        res.status(401).json({
          jsonrpc: "2.0",
          error: { code: -32001, message: "Unauthorized" },
          id: null,
        });
        return;
      }

      const tokenDigest = digestToken(apiKey);
      const server = createServer(apiKey);

      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id: string) => {
          sessions[id] = { transport, tokenDigest, lastSeen: Date.now() };
        },
      } as ConstructorParameters<typeof StreamableHTTPServerTransport>[0]);

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && sessions[sid]) {
          delete sessions[sid];
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
  const session = getAuthenticatedSession(req);
  if (!session) {
    res.status(401).send("Unauthorized");
    return;
  }
  await session.transport.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  const session = getAuthenticatedSession(req);
  if (!session) {
    res.status(401).send("Unauthorized");
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
