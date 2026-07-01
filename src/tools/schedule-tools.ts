import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { GENERATABLE_CONTENT_TYPE_VALUES } from "../types/api.js";
import { handleError } from "../utils/mcp.js";

const scheduleCronConfigSchema = z.object({
  frequency: z.enum(["daily", "weekly", "monthly"]).describe("How often the schedule should run"),
  hour: z.number().int().min(0).max(23).describe("UTC hour to run at (0-23)"),
  minute: z.number().int().min(0).max(59).describe("UTC minute to run at (0-59)"),
  dayOfWeek: z
    .number()
    .int()
    .min(0)
    .max(6)
    .optional()
    .describe("UTC weekday for weekly schedules (0=Sunday, 6=Saturday)"),
  dayOfMonth: z.number().int().min(1).max(31).optional().describe("UTC day of month for monthly schedules (1-31)"),
});

const schedulePayloadSchema = {
  name: z.string().min(1).max(120).describe("Schedule name (1-120 characters)"),
  sourceType: z.literal("cron").describe("Schedule trigger type"),
  sourceConfig: z
    .object({
      cron: scheduleCronConfigSchema,
    })
    .describe("Cron trigger configuration"),
  targets: z
    .object({
      repositoryIds: z
        .array(z.string().min(1))
        .min(1)
        .describe("Repository IDs to include in the scheduled generation"),
    })
    .describe("Repositories the schedule should target"),
  outputType: z.enum(GENERATABLE_CONTENT_TYPE_VALUES).describe("Type of content to generate"),
  outputConfig: z
    .object({
      publishDestination: z
        .enum(["webflow", "framer", "custom"])
        .optional()
        .describe("Where generated content should be published"),
      brandVoiceId: z.string().min(1).optional().describe("Brand voice ID to use for scheduled output"),
    })
    .optional()
    .describe("Optional publishing and voice settings"),
  enabled: z.boolean().describe("Whether the schedule is active"),
  autoPublish: z.boolean().optional().describe("Whether to auto-publish generated content (default false)"),
  lookbackWindow: z
    .enum(["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"])
    .optional()
    .describe("Time window for gathering data before generation (default: last_7_days)"),
} as const;

export function registerScheduleTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_schedules",
    {
      description: "List scheduled content generation jobs, optionally filtered by repository IDs",
      annotations: { title: "List Schedules", readOnlyHint: true },
      inputSchema: {
        repositoryIds: z
          .array(z.string().min(1))
          .optional()
          .describe("Only return schedules targeting these repository IDs"),
      },
    },
    async ({ repositoryIds }) => {
      return handleError(() => client.listSchedules({ repositoryIds }));
    },
  );

  server.registerTool(
    "create_schedule",
    {
      description: "Create a content generation schedule using a cron-style daily, weekly, or monthly trigger",
      annotations: { title: "Create Schedule", destructiveHint: false },
      inputSchema: schedulePayloadSchema,
    },
    async (params) => {
      return handleError(() => client.createSchedule(params));
    },
  );

  server.registerTool(
    "update_schedule",
    {
      description: "Update an existing content generation schedule",
      annotations: { title: "Update Schedule", destructiveHint: true, idempotentHint: true },
      inputSchema: {
        scheduleId: z.string().min(1).describe("The schedule ID to update"),
        ...schedulePayloadSchema,
      },
    },
    async ({ scheduleId, ...body }) => {
      return handleError(() => client.updateSchedule(scheduleId, body));
    },
  );

  server.registerTool(
    "delete_schedule",
    {
      description: "Delete a content generation schedule by its ID",
      annotations: { title: "Delete Schedule", destructiveHint: true, idempotentHint: true },
      inputSchema: {
        scheduleId: z.string().min(1).describe("The schedule ID to delete"),
      },
    },
    async ({ scheduleId }) => {
      return handleError(() => client.deleteSchedule(scheduleId));
    },
  );
}
