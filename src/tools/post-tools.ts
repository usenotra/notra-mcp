import {
  listPostsSchema,
  getPostSchema,
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  generatePostSchema,
  getPostGenerationStatusSchema,
  postSummaryListOutputSchema,
} from "../schemas/post.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { toPostSummaryList } from "../utils/post-summary.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerPostTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_posts",
    {
      description:
        "List post summaries from Notra (title, status, type, short excerpt) with optional filters for sorting, pagination, status, content type, and brand identity. Use get_post for full content.",
      annotations: { title: "List Posts", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listPostsSchema),
      outputSchema: shareJsonSchema(postSummaryListOutputSchema),
    },
    (params) => handleError(async () => toPostSummaryList(await client.listPosts(params))),
  );

  server.registerTool(
    "get_post",
    {
      description: "Get a single post by its ID, including full content in HTML and markdown",
      annotations: { title: "Get Post", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getPostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getPost")),
    },
    ({ postId }) => handleError(() => client.getPost(postId)),
  );

  server.registerTool(
    "create_post",
    {
      description:
        "Create a post directly from your own title and markdown, without AI generation. Omit markdown to create an empty draft to fill in later with update_post. Slugs are only accepted for blog posts and changelogs. Setting status to published can expose the post on a hosted site and request a visibility rescan.",
      annotations: { title: "Create Post", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(createPostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createPost")),
    },
    (body) => handleError(() => client.createPost(body)),
  );

  server.registerTool(
    "update_post",
    {
      description:
        "Update a post's title, slug, markdown, or publication status. Changes to title, slug, or markdown also sync a post linked to GitHub: an open pull request gets a new commit, and a repository set to publish directly gets a direct commit when its live branch allows one. Otherwise, including closed or merged pull requests, GitHub is left as is and no new pull request is opened. Publishing can expose content on a hosted site and request a visibility rescan. A sync failure can occur after the post is saved; check the post and linked PR before retrying.",
      annotations: {
        title: "Update Post",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updatePostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updatePost")),
    },
    ({ postId, ...body }) => handleError(() => client.updatePost(postId, body)),
  );

  server.registerTool(
    "delete_post",
    {
      description: "Delete a post by its ID, including content that may be published on a hosted site.",
      annotations: {
        title: "Delete Post",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deletePostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deletePost")),
    },
    ({ postId }) => handleError(() => client.deletePost(postId)),
  );

  server.registerTool(
    "generate_post",
    {
      description:
        "Queue an async post generation job. Notra will analyze your GitHub activity and generate content. Use get_post_generation_status to poll for completion.",
      annotations: { title: "Generate Post", readOnlyHint: false, openWorldHint: true, destructiveHint: false },
      inputSchema: shareJsonSchema(generatePostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createPostGeneration")),
    },
    (params) => handleError(() => client.generatePost(params)),
  );

  server.registerTool(
    "get_post_generation_status",
    {
      description: "Check the status of an async post generation job. Returns job status and event log.",
      annotations: {
        title: "Get Post Generation Status",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(getPostGenerationStatusSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getPostGeneration")),
    },
    ({ jobId }) => handleError(() => client.getPostGenerationStatus(jobId)),
  );
}
