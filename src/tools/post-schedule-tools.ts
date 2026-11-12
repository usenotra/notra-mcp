import type { ToolRegistry } from "../types/server.js";
import type { NotraClient } from "../notra-client.js";
import { postScheduleParamsSchema, schedulePostSchema } from "../schemas/post-schedule.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerPostScheduleTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "get_post_schedule",
      description:
        "Get a post's publishing schedule and the state of every destination. Returns a null schedule when nothing is scheduled.",
      annotations: {
        title: "Get Post Schedule",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(postScheduleParamsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getPostSchedule")),
    },
    ({ postId }) => handleError(() => client.getPostSchedule(postId)),
  );

  server.tool(
    {
      name: "schedule_post",
      description:
        "Schedule an existing post to publish in Notra at scheduledAt, and optionally to GitHub (a pull request that is merged by default) or a connected X or LinkedIn account. Replaces any schedule that has not started. Use cancel_post_schedule to stop destinations before they run; once a post reaches GitHub or social media it cannot be unpublished from here, so confirm with the user. Later post edits are included when publishing runs, within about a minute of scheduledAt. Returns the schedule and its destinations.",
      annotations: {
        title: "Schedule Post",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(schedulePostSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("schedulePost")),
    },
    ({ postId, ...body }) => handleError(() => client.schedulePost(postId, body)),
  );

  server.tool(
    {
      name: "cancel_post_schedule",
      description:
        "Cancel a post's pending publishing destinations and clear failed ones. Returns canceled, the number of destinations that were canceled or cleared, and inProgress, which is true when a destination was already publishing; those cannot be interrupted and finish on their own.",
      annotations: {
        title: "Cancel Post Schedule",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(postScheduleParamsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("cancelPostSchedule")),
    },
    ({ postId }) => handleError(() => client.cancelPostSchedule(postId)),
  );
}
