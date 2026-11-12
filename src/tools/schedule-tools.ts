import {
  listSchedulesSchema,
  schedulePayloadSchema,
  updateScheduleSchema,
  deleteScheduleSchema,
  runScheduleSchema,
  listScheduleRunsSchema,
} from "../schemas/schedule.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerScheduleTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_schedules",
      description:
        "List content generation schedules with their name, cron timing, GitHub and Linear targets, output type, brand identity, publishing settings and enabled and autoPublish flags. repositoryMap labels each targeted GitHub integration ID with its owner/repo. Optionally filter by GitHub integration IDs.",
      annotations: {
        title: "List Schedules",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listSchedulesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listSchedules")),
    },
    ({ repositoryIds }) => handleError(() => client.listSchedules({ repositoryIds })),
  );

  server.tool(
    {
      name: "create_schedule",
      description:
        "Create a content generation schedule using a cron-style daily, weekly, or monthly trigger. It reads from GitHub repositories (targets.repositoryIds), Linear integrations (targets.linearIntegrationIds), or both; get IDs from list_integrations. Generation uses AI credits. When autoPublish is true, generated content is marked as published in Notra. An enabled schedule keeps running until it is paused with update_schedule or deleted. Returns the created schedule.",
      annotations: {
        title: "Create Schedule",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(schedulePayloadSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createSchedule")),
    },
    (params) => handleError(() => client.createSchedule(params)),
  );

  server.tool(
    {
      name: "update_schedule",
      description:
        "Update an existing content generation schedule. Only the fields you pass change, and fields you leave out stay as they are; for example { scheduleId, enabled: false } pauses it. targets and outputConfig merge field by field, sourceConfig replaces the cron as a whole, and null clears an outputConfig field. When autoPublish is true, future generated content is marked as published in Notra. Returns the updated schedule.",
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

  server.tool(
    {
      name: "delete_schedule",
      description:
        "Permanently delete a content generation schedule so it no longer runs; it cannot be restored. To stop it temporarily, set enabled to false with update_schedule instead. Returns the deleted schedule's ID.",
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

  server.tool(
    {
      name: "run_schedule",
      description:
        "Run an enabled content generation schedule once right now, outside its cron timing. Generation uses AI credits. When the schedule has autoPublish on, the result is marked as published in Notra, like a scheduled run. Returns a runId; follow it with list_schedule_runs until its status leaves running. If the call fails, check list_schedule_runs before retrying, because the run may have started anyway.",
      annotations: {
        title: "Run Schedule",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(runScheduleSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("runSchedule")),
    },
    ({ scheduleId }) => handleError(() => client.runSchedule(scheduleId)),
  );

  server.tool(
    {
      name: "list_schedule_runs",
      description:
        "List a schedule's most recent runs, newest first, with status, error message and the draft post each run created (use get_post with postId)",
      annotations: {
        title: "List Schedule Runs",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listScheduleRunsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listScheduleRuns")),
    },
    ({ scheduleId, limit }) => handleError(() => client.listScheduleRuns(scheduleId, { limit })),
  );
}
