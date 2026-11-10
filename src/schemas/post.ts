import * as z from "zod";
import {
  CONTENT_TYPE_VALUES,
  CREATABLE_CONTENT_TYPE_VALUES,
  GENERATABLE_CONTENT_TYPE_VALUES,
  POST_STATUS_VALUES,
} from "../constants/post.js";
import { apiResponsePropertySchema } from "../utils/output-schema.js";
import { geoWindowShape } from "./geo-fields.js";
import { brandIdentityIdFilterSchema, contentTypeFilterSchema, statusFilterSchema } from "./post-filters.js";

export const listPostsSchema = z.object({
  sort: z
    .enum(["asc", "desc"])
    .optional()
    .describe("Order of posts by creation date: desc lists the newest first, asc the oldest first."),
  limit: z.number().int().min(1).max(100).optional().describe("How many posts to return per page. Defaults to 10."),
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe("Which page of results to return, starting at 1. Use pagination in the response to find further pages."),
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
  postId: z.string().min(1).describe("ID of the post to fetch, as returned by list_posts or create_post."),
});

export const getPostAgentReachSchema = z.object({
  postId: z.string().min(1).describe("The post ID (see list_posts)"),
  ...geoWindowShape,
});

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1)
    .describe("Headline of the post, shown as its title in Notra and on any site it publishes to."),
  contentType: z
    .enum(CREATABLE_CONTENT_TYPE_VALUES)
    .describe(
      "Kind of post to create. Blog posts and changelogs can carry a slug and publish to sites; LinkedIn and X posts are short social posts.",
    ),
  slug: z
    .string()
    .trim()
    .min(1)
    .nullable()
    .optional()
    .describe(
      "Path segment the post uses in its URL, for blog posts and changelogs only. Notra normalizes it to lowercase letters, numbers and hyphens. Omit to let Notra derive one.",
    ),
  markdown: z.string().optional().describe("Post body in Markdown. Omit for an empty draft."),
  status: z
    .enum(POST_STATUS_VALUES)
    .optional()
    .describe(
      "Whether the post starts as a draft or is published right away. Omit to create a draft. Publishing can expose it on a hosted site.",
    ),
});

export const updatePostSchema = z.object({
  postId: z.string().min(1).describe("ID of the post to change, as returned by list_posts or create_post."),
  title: z
    .string()
    .min(1)
    .max(120)
    .optional()
    .describe("Replacement headline for the post. Omit to keep the current title."),
  slug: z
    .string()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional()
    .nullable()
    .describe(
      "Replacement path segment for the post URL, such as launch-week-recap. null clears it; omit to keep the current slug.",
    ),
  markdown: z
    .string()
    .min(1)
    .max(100000)
    .optional()
    .describe(
      "Full replacement body in Markdown. It overwrites the whole body, so send the complete text. Omit to keep the current content.",
    ),
  status: z
    .enum(["draft", "published"])
    .optional()
    .describe(
      "Move the post to draft or publish it. Publishing can expose it on a hosted site. Omit to keep the current status.",
    ),
  authorIds: z
    .array(z.string().min(1).max(64))
    .max(5)
    .optional()
    .describe(
      "Replace the credited authors of a blog post or changelog, in display order; [] clears them and omitting it keeps them. On a blog post that publishes to a Notra Site, credit the site's authors with their ref from list_site_authors, e.g. site:jane-doe. Keep a Notra author by passing the id get_post shows for it.",
    ),
});

export const deletePostSchema = z.object({
  postId: z.string().min(1).describe("ID of the post to delete permanently, as returned by list_posts."),
});

export const generatePostSchema = z
  .object({
    contentType: z
      .enum(GENERATABLE_CONTENT_TYPE_VALUES)
      .describe("Kind of post Notra should write from the selected activity, such as a changelog or a LinkedIn post."),
    lookbackWindow: z
      .enum(["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"])
      .optional()
      .describe(
        "How far back Notra looks for GitHub and Linear activity to write about. Defaults to the last 7 days. Ignored when pullRequest is set.",
      ),
    brandVoiceId: z
      .string()
      .min(1)
      .optional()
      .describe(
        "Brand identity ID whose voice and tone to write in, from list_brand_identities. Omit to use the default brand identity.",
      ),
    brandIdentityId: z
      .string()
      .min(1)
      .optional()
      .nullable()
      .describe(
        "Brand identity ID from list_brand_identities whose company details and tone shape the post. Omit or pass null to use the default brand identity.",
      ),
    repositoryIds: z
      .array(z.string().min(1))
      .optional()
      .describe("Repository IDs to include. Deprecated; prefer integrations.github IDs from list_integrations."),
    linearIntegrationIds: z
      .array(z.string().min(1))
      .optional()
      .describe(
        "Linear integration IDs, from the linear array of list_integrations, whose issues to include. Deprecated; prefer integrations.linear.",
      ),
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
        commitShas: z
          .array(z.string().min(1))
          .optional()
          .describe(
            "Commit hashes to write about, as listed by list_github_activity with type commits. Limits generation to these commits.",
          ),
        pullRequestNumbers: z
          .array(
            z.object({
              repositoryId: z
                .string()
                .min(1)
                .describe(
                  "GitHub integration ID, from list_integrations, of the repository that holds the pull request",
                ),
              number: z.number().int().min(1).describe("Pull request number in that repository, as shown on GitHub"),
            }),
          )
          .optional()
          .describe("Specific pull requests to include"),
        releaseTagNames: z
          .array(
            z.union([
              z.string().min(1),
              z.object({
                repositoryId: z
                  .string()
                  .min(1)
                  .describe(
                    "GitHub integration ID, from list_integrations, of the repository that published the release",
                  ),
                tagName: z
                  .string()
                  .min(1)
                  .describe("Git tag of the release, such as v1.4.0, as listed by list_github_activity"),
              }),
            ]),
          )
          .optional()
          .describe("Specific release tags to include"),
        linearIssueIds: z
          .array(
            z.object({
              integrationId: z
                .string()
                .min(1)
                .describe(
                  "Linear integration ID, from the linear array of list_integrations, that the issue comes from",
                ),
              issueId: z.string().min(1).describe("ID of the Linear issue to write about"),
            }),
          )
          .optional()
          .describe("Specific Linear issues to include"),
      })
      .optional()
      .describe("Specific items to include in generation"),
    pullRequest: z
      .object({
        owner: z.string().min(1).describe("GitHub repository owner"),
        repo: z.string().min(1).describe("GitHub repository name"),
        number: z.number().int().min(1).describe("Pull request number"),
      })
      .optional()
      .describe(
        "Write about exactly this pull request in a connected repository, open or merged, whatever its age. Do not combine with integrations, repositoryIds, linearIntegrationIds, github or selectedItems; dataPoints and lookbackWindow do not apply.",
      ),
    brief: z
      .string()
      .min(1)
      .max(4000)
      .optional()
      .describe(
        "What the post should be about and cover, in your own words. Steers topic, angle and structure; facts still come from the sources.",
      ),
  })
  .refine(
    (input) =>
      !input.pullRequest ||
      !(
        input.repositoryIds?.length ||
        input.linearIntegrationIds?.length ||
        input.integrations?.github?.length ||
        input.integrations?.linear?.length ||
        input.github?.repositories?.length ||
        input.selectedItems
      ),
    {
      message:
        "pullRequest selects its own source. Do not combine it with integrations, repositoryIds, linearIntegrationIds, github or selectedItems.",
      path: ["pullRequest"],
    },
  );

export const createPostPullRequestSchema = z
  .object({
    postId: z
      .string()
      .min(1)
      .describe(
        "ID of the blog post or changelog to open a pull request for, from list_posts or get_post_generation_status.",
      ),
    integrationId: z
      .string()
      .min(1)
      .optional()
      .describe(
        "GitHub integration ID, from the github array of list_integrations, of the repository to open the pull request in. Omit when only one repository is connected.",
      ),
    github: z
      .object({
        owner: z.string().min(1).describe("User or organization that owns the connected repository, such as vercel"),
        repo: z.string().min(1).describe("Name of the connected repository without the owner, such as next.js"),
      })
      .optional()
      .describe("Connected repository by owner and name, instead of integrationId"),
  })
  .refine(({ integrationId, github }) => !(integrationId && github), {
    message: "Provide either integrationId or github, not both",
    path: ["github"],
  });

export const getPostGenerationStatusSchema = z.object({
  jobId: z.string().min(1).describe("The generation job ID to check"),
});
