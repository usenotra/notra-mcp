import type { ToolRegistry } from "../types/server.js";
import type { NotraClient } from "../notra-client.js";
import { cancelPostScheduleSchema, postScheduleParamsSchema, schedulePostSchema } from "../schemas/post-schedule.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerPostScheduleTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "get_post_schedule",
      description:
        "Get a post's publishing schedule and the state of every destination. Returns schedule (postId, scheduledAt, timeZone, and publications: one entry per destination with its status, attempts, lastError and resultUrl once published) and the organization. schedule is null when nothing is scheduled.",
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
        "Schedule an existing post to publish in Notra at scheduledAt, and optionally to GitHub (a pull request that is merged by default) or a connected X or LinkedIn account. Replaces any schedule that has not started. Use cancel_post_schedule to stop destinations before they run; once a post reaches GitHub or social media it cannot be unpublished from here, so confirm with the user. Later post edits are included when publishing runs, within about a minute of scheduledAt. Returns schedule (postId, scheduledAt, timeZone, and publications with each destination's status) and the organization.",
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
        "Cancel a post's pending publishing destinations and clear failed ones. When the post has an open GitHub pull request, from scheduling, create_post_pull_request or publish_post_to_site, this returns 409 and changes nothing unless withdraw is true; with withdraw it also closes that pull request, so confirm with the user first. Returns the organization, canceled, the number of destinations that were canceled or cleared, inProgress, which is true when a destination was already publishing and finishes on its own, and withdrawn: the pull request withdraw acted on, or null when there was none. When withdrawn.merged is true, the pull request had already been merged and stayed merged, so the post is already live and nothing was closed.",
      annotations: {
        title: "Cancel Post Schedule",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(cancelPostScheduleSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("cancelPostSchedule")),
    },
    ({ postId, withdraw }) => handleError(() => client.cancelPostSchedule(postId, withdraw)),
  );
}
