import {
  createGeoScanSchema,
  listGeoScansSchema,
  getGeoScanSchema,
  rescanGeoPromptSchema,
} from "../schemas/geo-scan.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoScanTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "create_geo_scan",
      description:
        "Trigger a GEO visibility scan. The scan runs asynchronously and checks every enabled prompt against every configured answer engine, or only the engines in engines; poll get_geo_scan with the returned scanId for status, progress, mentions, and safe failure details. Returns scanId, statusUrl (the API URL to poll) and the organization. Fails while another scan for the project is still running. A manual scan does not move the automatic schedule; nextScanAt from get_geo_settings stays the same. This uses AI credits.",
      annotations: {
        title: "Create GEO Scan",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(createGeoScanSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createGeoScan")),
    },
    ({ projectId, engines }) => handleError(() => client.createGeoScan(projectId, engines)),
  );

  server.tool(
    {
      name: "rescan_geo_prompt",
      description:
        "Scan a single enabled tracked prompt against the project's answer engines, or only the engines in engines (one engine is fine), for example to check whether newly published content changed the answers. Cheaper than create_geo_scan, which checks every prompt. Runs asynchronously; poll get_geo_scan with the returned scanId. Returns scanId, statusUrl (the API URL to poll) and the organization. Fails while another scan is running and shares create_geo_scan's rate limit. This uses AI credits.",
      annotations: {
        title: "Rescan GEO Prompt",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(rescanGeoPromptSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createGeoPromptScan")),
    },
    ({ projectId, promptId, engines }) => handleError(() => client.rescanGeoPrompt(projectId, promptId, engines)),
  );

  server.tool(
    {
      name: "list_geo_scans",
      description:
        "List a project's GEO scans, newest first. Returns scans (id, status, startedAt, finishedAt, createdAt, summary of planned, completed, mentioned and failed checks with totals by engine, and errorCode, errorMessage, failedStage and retryable for failed scans), pagination (currentPage, nextPage, totalPages, totalItems) and the organization.",
      annotations: {
        title: "List GEO Scans",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoScansSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoScans")),
    },
    ({ projectId, ...params }) => handleError(() => client.listGeoScans(projectId, params)),
  );

  server.tool(
    {
      name: "get_geo_scan",
      description:
        "Get one GEO scan. Returns scan (id, status, startedAt, finishedAt, summary of planned, completed, mentioned and failed checks with totals by engine, and errorCode, errorMessage, failedStage and retryable when the scan failed) and the organization. plannedChecks is null for older scans without a saved plan.",
      annotations: {
        title: "Get GEO Scan",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoScanSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoScan")),
    },
    ({ projectId, scanId }) => handleError(() => client.getGeoScan(projectId, scanId)),
  );
}
