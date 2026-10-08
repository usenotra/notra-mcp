import type { McpServer } from "@modelcontextprotocol/server";
import type { NotraClient } from "../notra-client.js";
import { postScheduleParamsSchema, schedulePostSchema } from "../schemas/post-schedule.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerPostScheduleTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "get_post_schedule",
    {
      description:
        "Get a post's publishing schedule and the state of every destination. Returns a null schedule when nothing is scheduled.",
      annotations: { title: "Get Post Schedule", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(postScheduleParamsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getPostSchedule")),
    },
    ({ postId }) => handleError(() => client.getPostSchedule(postId)),
  );

  server.registerTool(
    "schedule_post",
    {
      description:
        "Schedule an existing post for publishing in Notra and optionally GitHub, X, or LinkedIn. Replaces a schedule that has not started; later post edits are included when publishing runs, within about a minute of scheduledAt.",
      annotations: { title: "Schedule Post", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(schedulePostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("schedulePost")),
    },
    ({ postId, ...body }) => handleError(() => client.schedulePost(postId, body)),
  );

  server.registerTool(
    "cancel_post_schedule",
    {
      description:
        "Cancel pending publishing destinations and clear failed ones. Already-publishing destinations cannot be interrupted; inProgress reports whether any are still running.",
      annotations: { title: "Cancel Post Schedule", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(postScheduleParamsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("cancelPostSchedule")),
    },
    ({ postId }) => handleError(() => client.cancelPostSchedule(postId)),
  );
}
