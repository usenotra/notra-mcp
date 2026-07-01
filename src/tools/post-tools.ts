import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { brandIdentityIdFilterSchema, contentTypeFilterSchema, statusFilterSchema } from "../schemas/post-filters.js";
import { GENERATABLE_CONTENT_TYPE_VALUES } from "../types/api.js";
import { handleError } from "../utils/mcp.js";

export function registerPostTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_posts",
    {
      description:
        "List posts from Notra with optional filters for sorting, pagination, status, content type, and brand identity",
      inputSchema: {
        sort: z.enum(["asc", "desc"]).optional().describe("Sort by creation date"),
        limit: z.number().int().min(1).max(100).optional().describe("Items per page (1-100, default 10)"),
        page: z.number().int().min(1).optional().describe("Page number (default 1)"),
        status: statusFilterSchema,
        contentType: contentTypeFilterSchema,
        brandIdentityId: brandIdentityIdFilterSchema,
      },
    },
    async (params) => {
      return handleError(() =>
        client.listPosts({
          sort: params.sort,
          limit: params.limit,
          page: params.page,
          status: params.status,
          contentType: params.contentType,
          brandIdentityId: params.brandIdentityId,
        }),
      );
    },
  );

  server.registerTool(
    "get_post",
    {
      description: "Get a single post by its ID, including full content in HTML and markdown",
      inputSchema: {
        postId: z.string().min(1).describe("The post ID to retrieve"),
      },
    },
    async ({ postId }) => {
      return handleError(() => client.getPost(postId));
    },
  );

  server.registerTool(
    "update_post",
    {
      description: "Update a post's title, markdown content, or publication status",
      inputSchema: {
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
      },
    },
    async ({ postId, ...body }) => {
      return handleError(() => client.updatePost(postId, body));
    },
  );

  server.registerTool(
    "delete_post",
    {
      description: "Delete a post by its ID",
      inputSchema: {
        postId: z.string().min(1).describe("The post ID to delete"),
      },
    },
    async ({ postId }) => {
      return handleError(() => client.deletePost(postId));
    },
  );

  server.registerTool(
    "generate_post",
    {
      description:
        "Queue an async post generation job. Notra will analyze your GitHub activity and generate content. Use get_post_generation_status to poll for completion.",
      inputSchema: {
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
            commitShas: z.array(z.string()).optional().describe("Specific commit SHAs to include"),
            pullRequestNumbers: z
              .array(
                z.object({
                  repositoryId: z.string(),
                  number: z.number(),
                }),
              )
              .optional()
              .describe("Specific pull requests to include"),
            releaseTagNames: z
              .array(z.union([z.string(), z.object({ repositoryId: z.string(), tagName: z.string() })]))
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
      },
    },
    async (params) => {
      return handleError(() => client.generatePost(params));
    },
  );

  server.registerTool(
    "get_post_generation_status",
    {
      description: "Check the status of an async post generation job. Returns job status and event log.",
      inputSchema: {
        jobId: z.string().min(1).describe("The generation job ID to check"),
      },
    },
    async ({ jobId }) => {
      return handleError(() => client.getPostGenerationStatus(jobId));
    },
  );
}
