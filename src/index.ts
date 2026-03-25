#!/usr/bin/env node

import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

const apiKey = process.env.NOTRA_API_KEY;
if (!apiKey) {
  console.error("Error: NOTRA_API_KEY environment variable is required");
  process.exit(1);
}

const server = createServer(apiKey);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Notra MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
