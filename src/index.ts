#!/usr/bin/env node

import "zod/compile";

import "dotenv/config";
import { ORGANIZATION_ID_HEADER } from "./constants/organization.js";
import { createServer } from "./server.js";
import { readOrganizationIdEnv } from "./utils/organization.js";
import { serveStdio } from "./utils/stdio.js";
import { parseToolsets } from "./utils/toolsets.js";

const apiKey = process.env.NOTRA_API_KEY;
if (!apiKey) {
  console.error("Error: NOTRA_API_KEY environment variable is required");
  process.exit(1);
}

parseToolsets(process.env.NOTRA_MCP_TOOLSETS);

// Account API keys work in every workspace their user belongs to; this pins the one to act on.
const organizationId = readOrganizationIdEnv();

serveStdio(createServer(), {
  Authorization: `Bearer ${apiKey}`,
  ...(organizationId ? { [ORGANIZATION_ID_HEADER]: organizationId } : {}),
});

console.error("Notra MCP server running on stdio");
