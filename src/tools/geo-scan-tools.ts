import { createGeoScanSchema, listGeoScansSchema, getGeoScanSchema } from "../schemas/geo-scan.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";

export function registerGeoScanTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "create_geo_scan",
    {
      description:
        "Trigger a GEO visibility scan. The scan runs asynchronously and checks every enabled prompt against every configured answer engine; poll get_geo_scan with the returned scanId for completion. This uses AI credits.",
      annotations: { title: "Create GEO Scan", destructiveHint: false },
      inputSchema: createGeoScanSchema,
    },
    ({ projectId }) => handleError(() => client.createGeoScan(projectId)),
  );

  server.registerTool(
    "list_geo_scans",
    {
      description: "List a project's GEO scans, newest first, with pagination",
      annotations: { title: "List GEO Scans", readOnlyHint: true },
      inputSchema: listGeoScansSchema,
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoScans(projectId, params)),
  );

  server.registerTool(
    "get_geo_scan",
    {
      description: "Get a single GEO scan and its status (running, completed or failed)",
      annotations: { title: "Get GEO Scan", readOnlyHint: true },
      inputSchema: getGeoScanSchema,
    },
    ({ projectId, scanId }) => handleError(() => client.getGeoScan(projectId, scanId)),
  );
}
