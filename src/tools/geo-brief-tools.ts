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
        "List GEO content gaps: prompts where competitors are mentioned but this brand is not, plus Search Console queries with no tracked prompt. Returns promptGaps (tracked prompts with engines, competitors, ownMentionRate, engineCoverage and opportunity), searchGaps (Search Console queries with impressions, clicks, position and a recommendation), aiSearchGaps (web searches AI engines ran without mentioning the brand or citing its site), hasScanData (false until the project has a scan result), snapshotReady (false while the gaps snapshot is being prepared) and the organization. Each gap carries the brief already written for it in brief, when there is one.",
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
        "Ignore a prompt gap from list_geo_content_gaps so it stops appearing there and in brief planning, or restore it with ignored false. Ignored gaps are not listed anywhere, so keep the promptId if you may want to restore it. Only promptGaps rows can be ignored. Returns the promptId, its new ignored state and the organization.",
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
        "List a project's GEO content briefs. A brief is the outline of a GEO post; match a post to its brief by postId. Returns briefs (per brief: id, topic, workingTitle, status, postId and createdAt) and the organization.",
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
        "Research a topic and save a GEO content brief as a draft. Uses billed AI credits and can take a few minutes; confirm with the user first. If an open brief already exists for the same source, it is reused instead. Set autoApprove to also start the article writer, which creates a post. Returns briefId, brief (the outline: target prompt, sections, FAQ, internal links, checklist and research notes), status, runId and postId (null until the writer starts) and the organization. Edit the draft with update_geo_content_brief.",
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
        "Get a single GEO content brief. Returns brief (id, topic, the outline in brief with sections, FAQ, internal links and checklist, status, autoApproved, the writer's runId, the resulting postId, humanized, error and timestamps) and the organization. Use get_post for the article itself.",
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
        "Edit a GEO content brief, the outline of a GEO post. Omitted fields keep their value; list fields replace the whole list, so send the full outline when changing sections. Only briefs in draft or failed status can be edited, and the draft post's plan is updated with them. Editing drops research notes such as the baseline and recommended angle. To change a finished article, use update_post. Returns the updated brief, in the same shape as get_geo_content_brief, and the organization.",
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
        "Approve a GEO content brief and start the article writer, which uses billed AI credits; confirm with the user first. Only briefs in draft or failed status can be approved. Returns runId (the writer run) and the organization. Poll get_geo_content_brief for writer progress; the finished article appears as a post.",
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
