import type { McpServer } from "@modelcontextprotocol/server";
import {
  buildFeedbackToolDescription,
  createFeedbackToolHandler,
  feedbackToolInputSchema,
  type FeedbackToolOptions,
} from "@usenotra/geo/feedback";
import * as z from "zod";

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
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
      inputSchema: z.object(feedbackToolInputSchema),
    },
    // Spread into a fresh object: the SDK's CallToolResult carries an index signature that
    // the package's FeedbackToolResult interface lacks.
    async (args) => ({ ...(await handle(args)) }),
  );
}
