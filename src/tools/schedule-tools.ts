import {
  listSchedulesSchema,
  schedulePayloadSchema,
  updateScheduleSchema,
  deleteScheduleSchema,
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
}
