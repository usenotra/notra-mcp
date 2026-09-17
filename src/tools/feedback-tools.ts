import type { McpServer } from "@modelcontextprotocol/server";
import {
  buildFeedbackToolDescription,
  createFeedbackToolHandler,
  type FeedbackToolOptions,
} from "@usenotra/geo/feedback";
import type { NotraClient } from "../notra-client.js";
import {
  getFeedbackSchema,
  listFeedbackSchema,
  submitFeedbackSchema,
  updateFeedbackSchema,
} from "../schemas/feedback.js";
import { handleError } from "../utils/mcp.js";

/**
 * Registers the `submit_feedback` tool from `@usenotra/geo`. Mirrors the package's own
 * `registerFeedbackTool`, but goes through `McpServer.registerTool` directly so the input
 * schema is typed as a zod shape instead of the package's loose `Record<string, unknown>`.
 */
export function registerFeedbackTools(server: McpServer, options: FeedbackToolOptions) {
  const handle = createFeedbackToolHandler(options);

  server.registerTool(
    options.toolName ?? "submit_feedback",
    {
      description: options.description ?? buildFeedbackToolDescription(options.productName),
      annotations: {
        title: "Submit feedback",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: submitFeedbackSchema,
    },
    // Spread into a fresh object: the SDK's CallToolResult carries an index signature that
    // the package's FeedbackToolResult interface lacks.
    async (args) => ({ ...(await handle(args)) }),
  );
}

export function registerFeedbackInboxTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_feedback",
    {
      description:
        "List feedback your organization received through its feedback URL, MCP servers or SDKs, filtered by triage status, kind or project",
      annotations: { title: "List Feedback", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: listFeedbackSchema,
    },
    (params) => handleError(() => client.listFeedback(params)),
  );

  server.registerTool(
    "get_feedback",
    {
      description: "Get a single feedback entry with its full message, agent metadata and context URL",
      annotations: { title: "Get Feedback", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: getFeedbackSchema,
    },
    ({ feedbackId }) => handleError(() => client.getFeedback(feedbackId)),
  );

  server.registerTool(
    "update_feedback",
    {
      description: "Set the triage status of a feedback entry: new, triaged, resolved or archived",
      annotations: {
        title: "Update Feedback",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: updateFeedbackSchema,
    },
    ({ feedbackId, status }) => handleError(() => client.updateFeedback(feedbackId, { status })),
  );
}
