#!/usr/bin/env node

import "zod/compile";

import "dotenv/config";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./server.js";
import { readOrganizationIdEnv } from "./utils/organization.js";

const apiKey = process.env.NOTRA_API_KEY;
if (!apiKey) {
  console.error("Error: NOTRA_API_KEY environment variable is required");
  process.exit(1);
}

// Account API keys work in every workspace their user belongs to; this pins the one to act on.
const organizationId = readOrganizationIdEnv();

serveStdio(() => createServer({ kind: "apiKey", token: apiKey, organizationId }), {
  onerror: (error) => {
    console.error("MCP stdio error:", error);
  },
});

console.error("Notra MCP server running on stdio");
