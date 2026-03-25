import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createServer } from "./server.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const app = express();
app.use(express.json());

const sessions = new Map<string, { server: McpServer; transport: StreamableHTTPServerTransport }>();

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

    if (sessionId) {
      const session = sessions.get(sessionId);
      if (session) {
        await session.transport.handleRequest(req, res, req.body);
        return;
      }
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

    const apiKey = req.headers["authorization"]?.replace("Bearer ", "") || "";

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
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const session = sessionId ? sessions.get(sessionId) : undefined;

  if (!session) {
    res.writeHead(405).end(JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    }));
    return;
  }

  await session.transport.handleRequest(req, res);
});

app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  const session = sessionId ? sessions.get(sessionId) : undefined;

  if (!session) {
    res.status(404).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Session not found" },
      id: null,
    });
    return;
  }

  await session.transport.close();
  await session.server.close();
  sessions.delete(sessionId!);
  res.status(200).end();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = parseInt(process.env.PORT || "3000", 10);
app.listen(PORT, () => {
  console.log(`Notra MCP HTTP server listening on port ${PORT}`);
});
