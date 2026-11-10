import * as z from "zod";
import { GEO_BRIEF_SOURCE_KIND_VALUES, GEO_CONTENT_SUBTYPE_VALUES, GEO_MAX_COMPETITORS } from "../constants/geo.js";
import { geoResourceIdSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoContentGapsSchema = z.object({
  projectId: projectIdSchema,
});

export const updateGeoContentGapSchema = z.object({
  projectId: projectIdSchema,
  promptId: geoResourceIdSchema.describe("The id of a promptGaps row from list_geo_content_gaps"),
  ignored: z.boolean().describe("true hides the gap from content gaps and brief planning; false brings it back"),
});

export const listGeoContentBriefsSchema = z.object({
  projectId: projectIdSchema,
});

export const planGeoContentBriefSchema = z.object({
  projectId: projectIdSchema,
  topic: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .describe(
      "What the article should target, such as a buyer question or subject. Replaced by the source prompt when sourceKind is gap, prompt or search_console.",
    ),
  autoApprove: z.boolean().optional().describe("Approve the brief immediately and start the writer (default false)"),
  contentSubtype: z
    .enum(GEO_CONTENT_SUBTYPE_VALUES)
    .optional()
    .describe("Article format to plan, such as a comparison or how-to. Omit to let the planner choose."),
  brandVoiceIds: z
    .array(geoResourceIdSchema)
    .max(8)
    .optional()
    .describe(
      "Brand identity IDs from list_brand_identities whose voice the article uses. Only the first is used; it overrides the project's linked brand identity.",
    ),
  competitorIds: z
    .array(geoResourceIdSchema)
    .max(GEO_MAX_COMPETITORS)
    .optional()
    .describe("IDs of tracked competitors from list_geo_competitors that the article should position against"),
  sitemapId: geoResourceIdSchema
    .optional()
    .describe(
      "ID of one of the brand identity's sitemaps, set up in the Notra dashboard, to pick internal links from. Omit to use all of its sitemaps.",
    ),
  sourceKind: z
    .enum(GEO_BRIEF_SOURCE_KIND_VALUES)
    .optional()
    .describe(
      "Where the topic comes from: manual uses topic as given; gap, prompt and search_console use the row named by sourceId. Omit for manual.",
    ),
  sourceId: z
    .string()
    .min(1)
    .optional()
    .describe(
      "Source row for sourceKind: a tracked prompt ID (a promptGaps row or list_geo_prompts) for gap or prompt, or a prompt suggestion ID (a searchGaps row or list_geo_prompt_suggestions) for search_console. An open brief for the same source is reused.",
    ),
});

export const getGeoContentBriefSchema = z.object({
  projectId: projectIdSchema,
  briefId: geoResourceIdSchema.describe("The brief ID to retrieve"),
});

const briefLineSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[^\r\n]*$/, "Must be a single line");

export const updateGeoContentBriefSchema = z
  .object({
    projectId: projectIdSchema,
    briefId: geoResourceIdSchema.describe("The brief ID to update"),
    expectedUpdatedAt: z.iso
      .datetime()
      .optional()
      .describe(
        "The brief's updatedAt from your last read. Fails if the brief changed since; omit to overwrite the latest version",
      ),
    workingTitle: briefLineSchema.max(120).optional().describe("Working title, also used as the post title"),
    targetPrompt: briefLineSchema.optional().describe("The question a buyer would ask an AI assistant"),
    intent: briefLineSchema.optional().describe("Search intent behind the target prompt"),
    audience: briefLineSchema.optional().describe("Who the article is for, one line"),
    jobToBeDone: briefLineSchema.optional().describe("What the reader is trying to get done, one line"),
    sections: z
      .array(
        z.object({
          heading: briefLineSchema.describe("H2 heading for the section"),
          goal: briefLineSchema.describe("One sentence on what the reader should take away"),
          claims: z.array(briefLineSchema).max(5).describe("Concrete, checkable claims the section must make"),
        }),
      )
      .min(3)
      .max(8)
      .optional()
      .describe("The full outline in order (3-8 sections). Replaces every existing section"),
    questionsToAnswer: z.array(briefLineSchema).max(8).optional().describe("FAQ questions. Replaces the whole list"),
    internalLinks: z
      .array(
        z.object({
          url: briefLineSchema.describe("URL of the page on your site to link to"),
          anchor: briefLineSchema.describe("Link text to use in the article"),
          why: briefLineSchema.describe("One line on why the reader benefits from this link"),
        }),
      )
      .max(6)
      .optional()
      .describe("Internal links to include. Replaces the whole list"),
    acceptanceChecklist: z
      .array(briefLineSchema)
      .max(8)
      .optional()
      .describe(
        "Checks the finished article must pass before it counts as done, one per entry. Replaces the whole list.",
      ),
  })
  .refine(
    ({ projectId: _projectId, briefId: _briefId, expectedUpdatedAt: _expected, ...fields }) =>
      Object.values(fields).some((value) => value !== undefined),
    { message: "Provide at least one field to update" },
  );

export const approveGeoContentBriefSchema = z.object({
  projectId: projectIdSchema,
  briefId: geoResourceIdSchema.describe(
    "ID of a draft or failed brief, from plan_geo_content_brief or list_geo_content_briefs",
  ),
});
