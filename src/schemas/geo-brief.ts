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
  topic: z.string().trim().min(3).max(200).describe("Topic to research and brief (3-200 characters)"),
  autoApprove: z.boolean().optional().describe("Approve the brief immediately and start the writer (default false)"),
  contentSubtype: z.enum(GEO_CONTENT_SUBTYPE_VALUES).optional().describe("Article format to plan for"),
  brandVoiceIds: z
    .array(geoResourceIdSchema)
    .max(8)
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
  sourceId: z.string().min(1).optional().describe("ID of the source row when sourceKind is gap/prompt/search_console"),
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
    audience: briefLineSchema.optional(),
    jobToBeDone: briefLineSchema.optional(),
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
      .array(z.object({ url: briefLineSchema, anchor: briefLineSchema, why: briefLineSchema }))
      .max(6)
      .optional()
      .describe("Internal links to include. Replaces the whole list"),
    acceptanceChecklist: z.array(briefLineSchema).max(8).optional().describe("Replaces the whole list"),
  })
  .refine(
    ({ projectId: _projectId, briefId: _briefId, expectedUpdatedAt: _expected, ...fields }) =>
      Object.values(fields).some((value) => value !== undefined),
    { message: "Provide at least one field to update" },
  );

export const approveGeoContentBriefSchema = z.object({
  projectId: projectIdSchema,
  briefId: geoResourceIdSchema.describe("The brief ID to approve"),
});
