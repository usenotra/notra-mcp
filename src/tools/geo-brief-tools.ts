import {
  listGeoContentGapsSchema,
  listGeoContentBriefsSchema,
  planGeoContentBriefSchema,
  getGeoContentBriefSchema,
  approveGeoContentBriefSchema,
  updateGeoContentBriefSchema,
  updateGeoContentGapSchema,
} from "../schemas/geo-brief.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoBriefTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_content_gaps",
    {
      description:
        "List GEO content gaps: prompts where competitors are mentioned but this brand is not, plus Search Console queries with no tracked prompt. Each gap links to the brief already written for it, when there is one.",
      annotations: { title: "List GEO Content Gaps", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listGeoContentGapsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoContentGaps")),
    },
    ({ projectId }) => handleError(() => client.listGeoContentGaps(projectId)),
  );

  server.registerTool(
    "update_geo_content_gap",
    {
      description:
        "Ignore a prompt gap from list_geo_content_gaps so it stops appearing there and in brief planning, or restore it with ignored false. Ignored gaps are not listed anywhere, so keep the promptId if you may want to restore it. Only promptGaps rows can be ignored.",
      annotations: {
        title: "Update GEO Content Gap",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateGeoContentGapSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateGeoContentGap")),
    },
    ({ projectId, promptId, ignored }) => handleError(() => client.updateGeoContentGap(projectId, promptId, ignored)),
  );

  server.registerTool(
    "list_geo_content_briefs",
    {
      description:
        "List a project's GEO content briefs and their statuses. A brief is the outline of a GEO post; match a post to its brief by postId.",
      annotations: {
        title: "List GEO Content Briefs",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(listGeoContentBriefsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoContentBriefs")),
    },
    ({ projectId }) => handleError(() => client.listGeoContentBriefs(projectId)),
  );

  server.registerTool(
    "plan_geo_content_brief",
    {
      description:
        "Research a topic and plan a GEO content brief, saved as a draft. This books AI credits, is billed, and can take a few minutes. Set autoApprove to start the article writer in the same call.",
      annotations: { title: "Plan GEO Content Brief", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(planGeoContentBriefSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("planGeoContentBrief")),
    },
    ({ projectId, ...body }) => handleError(() => client.planGeoContentBrief(projectId, body)),
  );

  server.registerTool(
    "get_geo_content_brief",
    {
      description:
        "Get a single GEO content brief: the post's outline (sections, FAQ, internal links, checklist), writer status and the resulting post ID. Use get_post for the article itself.",
      annotations: { title: "Get GEO Content Brief", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getGeoContentBriefSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoContentBrief")),
    },
    ({ projectId, briefId }) => handleError(() => client.getGeoContentBrief(projectId, briefId)),
  );

  server.registerTool(
    "update_geo_content_brief",
    {
      description:
        "Edit a GEO content brief, the outline of a GEO post. Omitted fields keep their value; list fields replace the whole list, so send the full outline when changing sections. Only briefs in draft or failed status can be edited, and the draft post's plan is updated with them. Editing drops research notes such as the baseline and recommended angle. To change a finished article, use update_post.",
      annotations: {
        title: "Update GEO Content Brief",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateGeoContentBriefSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateGeoContentBrief")),
    },
    ({ projectId, briefId, ...body }) => handleError(() => client.updateGeoContentBrief(projectId, briefId, body)),
  );

  server.registerTool(
    "approve_geo_content_brief",
    {
      description:
        "Approve a GEO content brief and start the article writer. Only briefs in draft or failed status can be approved. Poll get_geo_content_brief for writer progress; the finished article appears as a post.",
      annotations: {
        title: "Approve GEO Content Brief",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
      },
      inputSchema: shareJsonSchema(approveGeoContentBriefSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("approveGeoContentBrief")),
    },
    ({ projectId, briefId }) => handleError(() => client.approveGeoContentBrief(projectId, briefId)),
  );
}
