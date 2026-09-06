import * as z from "zod";
import { GENERATABLE_CONTENT_TYPE_VALUES } from "../constants/post.js";

const scheduleCronConfigSchema = z
  .object({
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
  })
  .superRefine((cron, ctx) => {
    if (cron.frequency === "weekly" && cron.dayOfWeek === undefined) {
      ctx.addIssue({ code: "custom", path: ["dayOfWeek"], message: "Weekly schedules require dayOfWeek" });
    }
    if (cron.frequency === "monthly" && cron.dayOfMonth === undefined) {
      ctx.addIssue({ code: "custom", path: ["dayOfMonth"], message: "Monthly schedules require dayOfMonth" });
    }
  });

export const schedulePayloadSchema = z.object({
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
});

export const listSchedulesSchema = z.object({
  repositoryIds: z.array(z.string().min(1)).optional().describe("Only return schedules targeting these repository IDs"),
});

export const updateScheduleSchema = z.object({
  scheduleId: z.string().min(1).describe("The schedule ID to update"),
  ...schedulePayloadSchema.shape,
});

export const deleteScheduleSchema = z.object({
  scheduleId: z.string().min(1).describe("The schedule ID to delete"),
});
