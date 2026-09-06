import {
  listGeoContentGapsSchema,
  listGeoContentBriefsSchema,
  planGeoContentBriefSchema,
  getGeoContentBriefSchema,
  approveGeoContentBriefSchema,
} from "../schemas/geo-brief.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";

export function registerGeoBriefTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_content_gaps",
    {
      description:
        "List GEO content gaps: prompts where competitors are mentioned but this brand is not, plus Search Console queries with no tracked prompt. Each gap links to the brief already written for it, when there is one.",
      annotations: { title: "List GEO Content Gaps", readOnlyHint: true },
      inputSchema: listGeoContentGapsSchema,
    },
    ({ projectId }) => handleError(() => client.listGeoContentGaps(projectId)),
  );

  server.registerTool(
    "list_geo_content_briefs",
    {
      description: "List a project's GEO content briefs and their statuses",
      annotations: { title: "List GEO Content Briefs", readOnlyHint: true },
      inputSchema: listGeoContentBriefsSchema,
    },
    ({ projectId }) => handleError(() => client.listGeoContentBriefs(projectId)),
  );

  server.registerTool(
    "plan_geo_content_brief",
    {
      description:
        "Research a topic and plan a GEO content brief, saved as a draft. This books AI credits, is billed, and can take a few minutes. Set autoApprove to start the article writer in the same call.",
      annotations: { title: "Plan GEO Content Brief", destructiveHint: false },
      inputSchema: planGeoContentBriefSchema,
    },
    ({ projectId, ...body }) => handleError(() => client.planGeoContentBrief(projectId, body)),
  );

  server.registerTool(
    "get_geo_content_brief",
    {
      description:
        "Get a single GEO content brief including the full brief document, writer status and the resulting post ID",
      annotations: { title: "Get GEO Content Brief", readOnlyHint: true },
      inputSchema: getGeoContentBriefSchema,
    },
    ({ projectId, briefId }) => handleError(() => client.getGeoContentBrief(projectId, briefId)),
  );

  server.registerTool(
    "approve_geo_content_brief",
    {
      description:
        "Approve a GEO content brief and start the article writer. Only briefs in draft or failed status can be approved. Poll get_geo_content_brief for writer progress; the finished article appears as a post.",
      annotations: { title: "Approve GEO Content Brief", destructiveHint: false },
      inputSchema: approveGeoContentBriefSchema,
    },
    ({ projectId, briefId }) => handleError(() => client.approveGeoContentBrief(projectId, briefId)),
  );
}
