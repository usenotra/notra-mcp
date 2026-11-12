import {
  listGeoContentGapsSchema,
  listGeoContentBriefsSchema,
  planGeoContentBriefSchema,
  getGeoContentBriefSchema,
  approveGeoContentBriefSchema,
  updateGeoContentBriefSchema,
  updateGeoContentGapSchema,
} from "../schemas/geo-brief.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerGeoBriefTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_geo_content_gaps",
      description:
        "List GEO content gaps: prompts where competitors are mentioned but this brand is not, plus Search Console queries with no tracked prompt. Returns prompt gaps with engines, competitors, own mention rate and opportunity, search gaps with clicks, impressions and position, and AI search gaps. Each gap links to the brief already written for it, when there is one.",
      annotations: {
        title: "List GEO Content Gaps",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoContentGapsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoContentGaps")),
    },
    ({ projectId }) => handleError(() => client.listGeoContentGaps(projectId)),
  );

  server.tool(
    {
      name: "update_geo_content_gap",
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

  server.tool(
    {
      name: "list_geo_content_briefs",
      description:
        "List a project's GEO content briefs. Returns each brief's ID, topic, working title, status, linked post ID and creation time. A brief is the outline of a GEO post; match a post to its brief by postId.",
      annotations: {
        title: "List GEO Content Briefs",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listGeoContentBriefsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listGeoContentBriefs")),
    },
    ({ projectId }) => handleError(() => client.listGeoContentBriefs(projectId)),
  );

  server.tool(
    {
      name: "plan_geo_content_brief",
      description:
        "Research a topic and save a GEO content brief as a draft. Uses billed AI credits and can take a few minutes; confirm with the user first. If an open brief already exists for the same source, it is reused instead. Set autoApprove to also start the article writer, which creates a post. Returns the brief ID, outline, status, and writer run and post IDs once started. Edit the draft with update_geo_content_brief.",
      annotations: {
        title: "Plan GEO Content Brief",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(planGeoContentBriefSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("planGeoContentBrief")),
    },
    ({ projectId, ...body }) => handleError(() => client.planGeoContentBrief(projectId, body)),
  );

  server.tool(
    {
      name: "get_geo_content_brief",
      description:
        "Get a single GEO content brief: the post's outline (sections, FAQ, internal links, checklist), writer status and the resulting post ID. Use get_post for the article itself.",
      annotations: {
        title: "Get GEO Content Brief",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getGeoContentBriefSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getGeoContentBrief")),
    },
    ({ projectId, briefId }) => handleError(() => client.getGeoContentBrief(projectId, briefId)),
  );

  server.tool(
    {
      name: "update_geo_content_brief",
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

  server.tool(
    {
      name: "approve_geo_content_brief",
      description:
        "Approve a GEO content brief and start the article writer, which uses billed AI credits; confirm with the user first. Only briefs in draft or failed status can be approved. Returns the writer run ID. Poll get_geo_content_brief for writer progress; the finished article appears as a post.",
      annotations: {
        title: "Approve GEO Content Brief",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(approveGeoContentBriefSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("approveGeoContentBrief")),
    },
    ({ projectId, briefId }) => handleError(() => client.approveGeoContentBrief(projectId, briefId)),
  );
}
