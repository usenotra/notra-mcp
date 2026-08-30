#!/usr/bin/env node

import "dotenv/config";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./server.js";

const apiKey = process.env.NOTRA_API_KEY;
if (!apiKey) {
  console.error("Error: NOTRA_API_KEY environment variable is required");
  process.exit(1);
}

serveStdio(() => createServer(apiKey), {
  onerror: (error) => {
    console.error("MCP stdio error:", error);
  },
});

console.error("Notra MCP server running on stdio");
