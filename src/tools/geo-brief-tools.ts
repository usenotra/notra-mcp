import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";
import {
  GEO_BRIEF_MAX_BRAND_VOICES,
  GEO_BRIEF_SOURCE_KIND_VALUES,
  GEO_CONTENT_SUBTYPE_VALUES,
  GEO_MAX_COMPETITORS,
} from "../constants/geo.js";
import type { NotraClient } from "../notra-client.js";
import { geoResourceIdSchema, projectIdSchema } from "../schemas/geo-fields.js";
import { handleError } from "../utils/mcp.js";

export function registerGeoBriefTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_geo_content_gaps",
    {
      description:
        "List GEO content gaps: prompts where competitors are mentioned but this brand is not, plus Search Console queries with no tracked prompt. Each gap links to the brief already written for it, when there is one.",
      annotations: { title: "List GEO Content Gaps", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.listGeoContentGaps(projectId));
    },
  );

  server.registerTool(
    "list_geo_content_briefs",
    {
      description: "List a project's GEO content briefs and their statuses",
      annotations: { title: "List GEO Content Briefs", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
      }),
    },
    async ({ projectId }) => {
      return handleError(() => client.listGeoContentBriefs(projectId));
    },
  );

  server.registerTool(
    "plan_geo_content_brief",
    {
      description:
        "Research a topic and plan a GEO content brief, saved as a draft. This books AI credits, is billed, and can take a few minutes. Set autoApprove to start the article writer in the same call.",
      annotations: { title: "Plan GEO Content Brief", destructiveHint: false },
      inputSchema: z.object({
        projectId: projectIdSchema,
        topic: z.string().trim().min(3).max(200).describe("Topic to research and brief (3-200 characters)"),
        autoApprove: z
          .boolean()
          .optional()
          .describe("Approve the brief immediately and start the writer (default false)"),
        contentSubtype: z.enum(GEO_CONTENT_SUBTYPE_VALUES).optional().describe("Article format to plan for"),
        brandVoiceIds: z
          .array(geoResourceIdSchema)
          .max(GEO_BRIEF_MAX_BRAND_VOICES)
          .optional()
          .describe("Brand voice IDs to write with; only the first is used"),
        competitorIds: z
          .array(geoResourceIdSchema)
          .max(GEO_MAX_COMPETITORS)
          .optional()
          .describe("Competitor IDs to position against"),
        sitemapId: geoResourceIdSchema.optional().describe("Sitemap ID to source internal links from"),
        sourceKind: z
          .enum(GEO_BRIEF_SOURCE_KIND_VALUES)
          .optional()
          .describe("What the brief was created from (e.g. a gap row from list_geo_content_gaps)"),
        sourceId: z
          .string()
          .min(1)
          .optional()
          .describe("ID of the source row when sourceKind is gap/prompt/search_console"),
      }),
    },
    async ({ projectId, ...body }) => {
      return handleError(() => client.planGeoContentBrief(projectId, body));
    },
  );

  server.registerTool(
    "get_geo_content_brief",
    {
      description:
        "Get a single GEO content brief including the full brief document, writer status and the resulting post ID",
      annotations: { title: "Get GEO Content Brief", readOnlyHint: true },
      inputSchema: z.object({
        projectId: projectIdSchema,
        briefId: geoResourceIdSchema.describe("The brief ID to retrieve"),
      }),
    },
    async ({ projectId, briefId }) => {
      return handleError(() => client.getGeoContentBrief(projectId, briefId));
    },
  );

  server.registerTool(
    "approve_geo_content_brief",
    {
      description:
        "Approve a GEO content brief and start the article writer. Only briefs in draft or failed status can be approved. Poll get_geo_content_brief for writer progress; the finished article appears as a post.",
      annotations: { title: "Approve GEO Content Brief", destructiveHint: false },
      inputSchema: z.object({
        projectId: projectIdSchema,
        briefId: geoResourceIdSchema.describe("The brief ID to approve"),
      }),
    },
    async ({ projectId, briefId }) => {
      return handleError(() => client.approveGeoContentBrief(projectId, briefId));
    },
  );
}
