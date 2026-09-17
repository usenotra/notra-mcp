import { createGeoScanSchema, listGeoScansSchema, getGeoScanSchema } from "../schemas/geo-scan.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";

export function registerGeoScanTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "create_geo_scan",
    {
      description:
        "Trigger a GEO visibility scan. The scan runs asynchronously and checks every enabled prompt against every configured answer engine; poll get_geo_scan with the returned scanId for status, progress, mentions, and safe failure details. This uses AI credits.",
      annotations: { title: "Create GEO Scan", readOnlyHint: false, openWorldHint: true, destructiveHint: false },
      inputSchema: createGeoScanSchema,
    },
    ({ projectId }) => handleError(() => client.createGeoScan(projectId)),
  );

  server.registerTool(
    "list_geo_scans",
    {
      description:
        "List a project's GEO scans, newest first, with pagination, check totals by engine, and safe failure details",
      annotations: { title: "List GEO Scans", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: listGeoScansSchema,
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoScans(projectId, params)),
  );

  server.registerTool(
    "get_geo_scan",
    {
      description:
        "Get a GEO scan's status, planned and completed checks, mentions and explicit failures by engine, plus safe failure details when the scan failed",
      annotations: { title: "Get GEO Scan", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: getGeoScanSchema,
    },
    ({ projectId, scanId }) => handleError(() => client.getGeoScan(projectId, scanId)),
  );
}
