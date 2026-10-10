import * as z from "zod";
import {
  CONTENT_TYPE_VALUES,
  CREATABLE_CONTENT_TYPE_VALUES,
  GENERATABLE_CONTENT_TYPE_VALUES,
  POST_STATUS_VALUES,
} from "../constants/post.js";
import { apiResponsePropertySchema } from "../utils/output-schema.js";
import { brandIdentityIdFilterSchema, contentTypeFilterSchema, statusFilterSchema } from "./post-filters.js";

export const listPostsSchema = z.object({
  sort: z.enum(["asc", "desc"]).optional().describe("Sort by creation date"),
  limit: z.number().int().min(1).max(100).optional().describe("Items per page (1-100, default 10)"),
  page: z.number().int().min(1).optional().describe("Page number (default 1)"),
  status: statusFilterSchema,
  contentType: contentTypeFilterSchema,
  brandIdentityId: brandIdentityIdFilterSchema,
});

export const postSummaryListOutputSchema = z.object({
  organization: apiResponsePropertySchema("listPosts", "organization"),
  posts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string().nullable(),
      excerpt: z.string().nullable().describe("Start of the post's markdown. Use get_post for the full content."),
      imageUrl: z.string().nullable().describe("Rendered image URL for image posts, null otherwise"),
      contentType: z.enum(CONTENT_TYPE_VALUES),
      status: z.enum(POST_STATUS_VALUES),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  ),
  pagination: apiResponsePropertySchema("listPosts", "pagination"),
});

export const getPostSchema = z.object({
  postId: z.string().min(1).describe("The post ID to retrieve"),
});

export const createPostSchema = z.object({
  title: z.string().trim().min(1).describe("Post title"),
  contentType: z.enum(CREATABLE_CONTENT_TYPE_VALUES).describe("Type of post"),
  slug: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional()
    .describe("URL slug, blog posts and changelogs only. Normalized to lowercase letters, numbers and hyphens."),
  markdown: z.string().optional().describe("Post body in Markdown. Omit for an empty draft."),
  status: z.enum(POST_STATUS_VALUES).optional().describe("Publication status (default: draft)"),
});

export const updatePostSchema = z.object({
  postId: z.string().min(1).describe("The post ID to update"),
  title: z.string().min(1).max(120).optional().describe("New title (1-120 characters)"),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .nullable()
    .describe("New URL slug (lowercase kebab-case)"),
  markdown: z.string().min(1).max(100000).optional().describe("New markdown content"),
  status: z.enum(["draft", "published"]).optional().describe("Set status to draft or published"),
});

export const deletePostSchema = z.object({
  postId: z.string().min(1).describe("The post ID to delete"),
});

export const generatePostSchema = z.object({
  contentType: z.enum(GENERATABLE_CONTENT_TYPE_VALUES).describe("Type of content to generate"),
  lookbackWindow: z
    .enum(["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"])
    .optional()
    .describe("Time window for gathering data (default: last_7_days)"),
  brandVoiceId: z.string().min(1).optional().describe("Brand voice ID to use for generation"),
  brandIdentityId: z.string().min(1).optional().nullable().describe("Brand identity ID to use"),
  repositoryIds: z
    .array(z.string().min(1))
    .optional()
    .describe("Repository IDs to include. Deprecated; prefer integrations.github IDs from list_integrations."),
  linearIntegrationIds: z
    .array(z.string().min(1))
    .optional()
    .describe("Linear integration IDs to include. Deprecated; prefer integrations.linear."),
  integrations: z
    .object({
      github: z
        .array(z.string().min(1))
        .min(1)
        .optional()
        .describe("Connected GitHub integration IDs from list_integrations to include"),
      linear: z.array(z.string().min(1)).min(1).optional().describe("Linear integration IDs to include"),
    })
    .optional()
    .describe("Integration IDs to use for generation"),
  github: z
    .object({
      repositories: z
        .array(
          z.object({
            owner: z.string().min(1).describe("GitHub repository owner"),
            repo: z.string().min(1).describe("GitHub repository name"),
          }),
        )
        .min(1),
    })
    .optional()
    .describe("Connected GitHub repositories to analyze. Use owner/repo values returned by list_integrations."),
  dataPoints: z
    .object({
      includePullRequests: z.boolean().optional().describe("Include pull requests (default true)"),
      includeCommits: z.boolean().optional().describe("Include commits (default true)"),
      includeReleases: z.boolean().optional().describe("Include releases (default true)"),
      includeLinearData: z.boolean().optional().describe("Include Linear data (default false)"),
    })
    .optional()
    .describe("Types of data to include in generation"),
  selectedItems: z
    .object({
      commitShas: z.array(z.string().min(1)).optional().describe("Specific commit SHAs to include"),
      pullRequestNumbers: z
        .array(
          z.object({
            repositoryId: z.string().min(1),
            number: z.number().int().min(1),
          }),
        )
        .optional()
        .describe("Specific pull requests to include"),
      releaseTagNames: z
        .array(z.union([z.string().min(1), z.object({ repositoryId: z.string().min(1), tagName: z.string().min(1) })]))
        .optional()
        .describe("Specific release tags to include"),
      linearIssueIds: z
        .array(
          z.object({
            integrationId: z.string().min(1),
            issueId: z.string().min(1),
          }),
        )
        .optional()
        .describe("Specific Linear issues to include"),
    })
    .optional()
    .describe("Specific items to include in generation"),
});

export const getPostGenerationStatusSchema = z.object({
  jobId: z.string().min(1).describe("The generation job ID to check"),
});
