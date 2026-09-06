import {
  listPostsSchema,
  getPostSchema,
  updatePostSchema,
  deletePostSchema,
  generatePostSchema,
  getPostGenerationStatusSchema,
} from "../schemas/post.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";

import { handleError } from "../utils/mcp.js";

export function registerPostTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_posts",
    {
      description:
        "List posts from Notra with optional filters for sorting, pagination, status, content type, and brand identity",
      annotations: { title: "List Posts", readOnlyHint: true },
      inputSchema: listPostsSchema,
    },
    (params) => handleError(() => client.listPosts(params)),
  );

  server.registerTool(
    "get_post",
    {
      description: "Get a single post by its ID, including full content in HTML and markdown",
      annotations: { title: "Get Post", readOnlyHint: true },
      inputSchema: getPostSchema,
    },
    ({ postId }) => handleError(() => client.getPost(postId)),
  );

  server.registerTool(
    "update_post",
    {
      description: "Update a post's title, markdown content, or publication status",
      annotations: { title: "Update Post", destructiveHint: true, idempotentHint: true },
      inputSchema: updatePostSchema,
    },
    ({ postId, ...body }) => handleError(() => client.updatePost(postId, body)),
  );

  server.registerTool(
    "delete_post",
    {
      description: "Delete a post by its ID",
      annotations: { title: "Delete Post", destructiveHint: true, idempotentHint: true },
      inputSchema: deletePostSchema,
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
    },
    (params) => handleError(() => client.generatePost(params)),
  );

  server.registerTool(
    "get_post_generation_status",
    {
      description: "Check the status of an async post generation job. Returns job status and event log.",
      annotations: { title: "Get Post Generation Status", readOnlyHint: true },
      inputSchema: getPostGenerationStatusSchema,
    },
    ({ jobId }) => handleError(() => client.getPostGenerationStatus(jobId)),
  );
}
