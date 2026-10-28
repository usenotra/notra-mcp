import {
  listSchedulesSchema,
  schedulePayloadSchema,
  updateScheduleSchema,
  deleteScheduleSchema,
  runScheduleSchema,
  listScheduleRunsSchema,
} from "../schemas/schedule.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerScheduleTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_schedules",
    {
      description: "List scheduled content generation jobs, optionally filtered by repository IDs",
      annotations: { title: "List Schedules", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listSchedulesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listSchedules")),
    },
    ({ repositoryIds }) => handleError(() => client.listSchedules({ repositoryIds })),
  );

  server.registerTool(
    "create_schedule",
    {
      description:
        "Create a content generation schedule using a cron-style daily, weekly, or monthly trigger. Generation uses AI credits. When autoPublish is true, generated content is automatically published to outputConfig.publishDestination.",
      annotations: { title: "Create Schedule", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(schedulePayloadSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createSchedule")),
    },
    (params) => handleError(() => client.createSchedule(params)),
  );

  server.registerTool(
    "update_schedule",
    {
      description:
        "Update an existing content generation schedule. When autoPublish is true, future generated content is automatically published to outputConfig.publishDestination.",
      annotations: {
        title: "Update Schedule",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateScheduleSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateSchedule")),
    },
    ({ scheduleId, ...body }) => handleError(() => client.updateSchedule(scheduleId, body)),
  );

  server.registerTool(
    "delete_schedule",
    {
      description: "Delete a content generation schedule by its ID",
      annotations: {
        title: "Delete Schedule",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteScheduleSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteSchedule")),
    },
    ({ scheduleId }) => handleError(() => client.deleteSchedule(scheduleId)),
  );

  server.registerTool(
    "run_schedule",
    {
      description:
        "Run an enabled content generation schedule once right now, outside its cron timing. Generation uses AI credits, and when the schedule has autoPublish on the result is published like a scheduled run. Returns a runId; follow it with list_schedule_runs until its status leaves running.",
      annotations: { title: "Run Schedule", readOnlyHint: false, openWorldHint: true, destructiveHint: false },
      inputSchema: shareJsonSchema(runScheduleSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("runSchedule")),
    },
    ({ scheduleId }) => handleError(() => client.runSchedule(scheduleId)),
  );

  server.registerTool(
    "list_schedule_runs",
    {
      description:
        "List a schedule's most recent runs, newest first, with status, error message and the draft post each run created (use get_post with postId)",
      annotations: { title: "List Schedule Runs", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listScheduleRunsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listScheduleRuns")),
    },
    ({ scheduleId, limit }) => handleError(() => client.listScheduleRuns(scheduleId, { limit })),
  );
}
