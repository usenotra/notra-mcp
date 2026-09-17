import {
  listSchedulesSchema,
  schedulePayloadSchema,
  updateScheduleSchema,
  deleteScheduleSchema,
} from "../schemas/schedule.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerScheduleTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_schedules",
    {
      description: "List scheduled content generation jobs, optionally filtered by repository IDs",
      annotations: { title: "List Schedules", readOnlyHint: true },
      inputSchema: listSchedulesSchema,
      outputSchema: apiOutputSchema("listSchedules"),
    },
    ({ repositoryIds }) => handleError(() => client.listSchedules({ repositoryIds })),
  );

  server.registerTool(
    "create_schedule",
    {
      description: "Create a content generation schedule using a cron-style daily, weekly, or monthly trigger",
      annotations: { title: "Create Schedule", destructiveHint: false },
      inputSchema: schedulePayloadSchema,
      outputSchema: apiOutputSchema("createSchedule"),
    },
    (params) => handleError(() => client.createSchedule(params)),
  );

  server.registerTool(
    "update_schedule",
    {
      description: "Update an existing content generation schedule",
      annotations: { title: "Update Schedule", destructiveHint: true, idempotentHint: true },
      inputSchema: updateScheduleSchema,
      outputSchema: apiOutputSchema("updateSchedule"),
    },
    ({ scheduleId, ...body }) => handleError(() => client.updateSchedule(scheduleId, body)),
  );

  server.registerTool(
    "delete_schedule",
    {
      description: "Delete a content generation schedule by its ID",
      annotations: { title: "Delete Schedule", destructiveHint: true, idempotentHint: true },
      inputSchema: deleteScheduleSchema,
      outputSchema: apiOutputSchema("deleteSchedule"),
    },
    ({ scheduleId }) => handleError(() => client.deleteSchedule(scheduleId)),
  );
}
