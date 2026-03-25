import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createServer } from "./server.js";

const app = express();
app.use(express.json());

const sessions = new Map<string, { server: ReturnType<typeof createServer>; transport: StreamableHTTPServerTransport }>();

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
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (sessionId && sessions.has(sessionId)) {
    const session = sessions.get(sessionId)!;
    await session.transport.handleRequest(req, res, req.body);
    return;
  }

  if (sessionId && !sessions.has(sessionId)) {
    res.status(404).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Session not found" },
      id: null,
    });
    return;
  }

  if (!isInitializeRequest(req.body)) {
    res.status(400).json({
      jsonrpc: "2.0",
      error: { code: -32600, message: "Bad request: expected initialize" },
      id: null,
    });
    return;
  }

  const apiKey = req.headers["authorization"]?.replace("Bearer ", "");
  if (!apiKey) {
    res.status(401).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Missing Authorization header with Notra API key" },
      id: null,
    });
    return;
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });

  const server = createServer(apiKey);
  await server.connect(transport);

  const newSessionId = transport.sessionId!;
  sessions.set(newSessionId, { server, transport });

  transport.onclose = () => {
    sessions.delete(newSessionId);
  };

  await transport.handleRequest(req, res, req.body);
});

app.get("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (!sessionId || !sessions.has(sessionId)) {
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed. Use POST to initialize a session first." },
      id: null,
    }));
    return;
  }

  const session = sessions.get(sessionId)!;
  await session.transport.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (!sessionId || !sessions.has(sessionId)) {
    res.status(404).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Session not found" },
      id: null,
    });
    return;
  }

  const session = sessions.get(sessionId)!;
  await session.transport.close();
  await session.server.close();
  sessions.delete(sessionId);
  res.status(200).end();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`Notra MCP HTTP server listening on port ${PORT}`);
});
