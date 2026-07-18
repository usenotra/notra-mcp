import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { NotraClient } from "../notra-client.js";
import { submitFeedbackInputSchema } from "../schemas/feedback.js";
import { handleError } from "../utils/mcp.js";

export function registerFeedbackTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "submit_feedback",
    {
      description: "Send product feedback, a bug report, or a feature request to the Notra team",
      annotations: { title: "Submit Feedback", destructiveHint: false },
      inputSchema: submitFeedbackInputSchema.shape,
    },
    async (params) => {
      return handleError(() => client.submitFeedback(params));
    },
  );
}
