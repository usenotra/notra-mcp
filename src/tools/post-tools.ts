import {
  listPostsSchema,
  getPostSchema,
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  generatePostSchema,
  getPostGenerationStatusSchema,
} from "../schemas/post.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerPostTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_posts",
    {
      description:
        "List posts from Notra with optional filters for sorting, pagination, status, content type, and brand identity",
      annotations: { title: "List Posts", readOnlyHint: true },
      inputSchema: listPostsSchema,
      outputSchema: apiOutputSchema("listPosts"),
    },
    (params) => handleError(() => client.listPosts(params)),
  );

  server.registerTool(
    "get_post",
    {
      description: "Get a single post by its ID, including full content in HTML and markdown",
      annotations: { title: "Get Post", readOnlyHint: true },
      inputSchema: getPostSchema,
      outputSchema: apiOutputSchema("getPost"),
    },
    ({ postId }) => handleError(() => client.getPost(postId)),
  );

  server.registerTool(
    "create_post",
    {
      description:
        "Create a post directly from your own title and markdown, without AI generation. Omit markdown to create an empty draft to fill in later with update_post. Slugs are only accepted for blog posts and changelogs.",
      annotations: { title: "Create Post", destructiveHint: false },
      inputSchema: createPostSchema,
      outputSchema: apiOutputSchema("createPost"),
    },
    (body) => handleError(() => client.createPost(body)),
  );

  server.registerTool(
    "update_post",
    {
      description: "Update a post's title, markdown content, or publication status",
      annotations: { title: "Update Post", destructiveHint: true, idempotentHint: true },
      inputSchema: updatePostSchema,
      outputSchema: apiOutputSchema("updatePost"),
    },
    ({ postId, ...body }) => handleError(() => client.updatePost(postId, body)),
  );

  server.registerTool(
    "delete_post",
    {
      description: "Delete a post by its ID",
      annotations: { title: "Delete Post", destructiveHint: true, idempotentHint: true },
      inputSchema: deletePostSchema,
      outputSchema: apiOutputSchema("deletePost"),
    },
    ({ postId }) => handleError(() => client.deletePost(postId)),
  );

  server.registerTool(
    "generate_post",
    {
      description:
        "Queue an async post generation job. Notra will analyze your GitHub activity and generate content. Use get_post_generation_status to poll for completion.",
      annotations: { title: "Generate Post", destructiveHint: false },
      inputSchema: generatePostSchema,
      outputSchema: apiOutputSchema("createPostGeneration"),
    },
    (params) => handleError(() => client.generatePost(params)),
  );

  server.registerTool(
    "get_post_generation_status",
    {
      description: "Check the status of an async post generation job. Returns job status and event log.",
      annotations: { title: "Get Post Generation Status", readOnlyHint: true },
      inputSchema: getPostGenerationStatusSchema,
      outputSchema: apiOutputSchema("getPostGeneration"),
    },
    ({ jobId }) => handleError(() => client.getPostGenerationStatus(jobId)),
  );
}
