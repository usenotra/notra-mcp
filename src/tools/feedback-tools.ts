import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import {
  buildFeedbackToolDescription,
  createFeedbackToolHandler,
  type FeedbackToolOptions,
} from "@usenotra/geo/feedback";
import type { NotraClient } from "../notra-client.js";
import {
  getFeedbackSchema,
  listFeedbackSchema,
  submitFeedbackOutputSchema,
  submitFeedbackSchema,
  updateFeedbackSchema,
} from "../schemas/feedback.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

/**
 * Registers the `submit_feedback` tool from `@usenotra/geo`. Mirrors the package's own
 * `registerFeedbackTool`, but goes through `MCPServer.tool` directly so the input
 * schema is typed as a zod shape instead of the package's loose `Record<string, unknown>`.
 */
export function registerFeedbackTools(server: ToolRegistry, options: FeedbackToolOptions) {
  const handle = createFeedbackToolHandler(options);

  server.tool(
    {
      name: options.toolName ?? "submit_feedback",
      description: options.description ?? buildFeedbackToolDescription(options.productName),
      annotations: {
        title: "Submit feedback",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(submitFeedbackSchema),
      outputSchema: shareJsonSchema(submitFeedbackOutputSchema),
    },
    // Spread into a fresh object: the SDK's CallToolResult carries an index signature that
    // the package's FeedbackToolResult interface lacks.
    async (args) => {
      const { structuredContent, ...result } = await handle(args);
      return structuredContent ? { ...result, structuredContent } : { ...result, isError: true as const };
    },
  );
}

export function registerFeedbackInboxTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_feedback",
      description:
        "List feedback your organization received through its feedback URL, MCP servers or SDKs, filtered by triage status, kind or project. Returns feedback (each entry's id, projectId, source, kind, sentiment, status, title, message, agent details, contextUrl, metadata and timestamps) and pagination (limit, currentPage, nextPage, previousPage, totalPages, totalItems).",
      annotations: {
        title: "List Feedback",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listFeedbackSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listFeedback")),
    },
    (params) => handleError(() => client.listFeedback(params)),
  );

  server.tool(
    {
      name: "get_feedback",
      description:
        "Get one feedback entry by ID. Returns feedback with its id, projectId, full message, title, kind, sentiment, triage status, source, agentClient, agentModel, toolVersion, userAgent, contextUrl, metadata, resolvedAt, createdAt and updatedAt.",
      annotations: {
        title: "Get Feedback",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getFeedbackSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getFeedback")),
    },
    ({ feedbackId }) => handleError(() => client.getFeedback(feedbackId)),
  );

  server.tool(
    {
      name: "update_feedback",
      description:
        "Set a feedback entry's triage status. Only the status changes, the feedback itself is untouched, and the status can be set back at any time. Get feedbackId from list_feedback. Returns the updated feedback entry, with the same fields as get_feedback.",
      annotations: {
        title: "Update Feedback",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateFeedbackSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateFeedback")),
    },
    ({ feedbackId, status }) => handleError(() => client.updateFeedback(feedbackId, { status })),
  );
}
