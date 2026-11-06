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

const integrationIdsSchema = z.array(z.string().min(1));
const repositoryIdsDescription = "GitHub integration IDs from list_integrations (github array)";
const linearIntegrationIdsDescription = "Linear integration IDs from list_integrations (linear array)";

const scheduleSourceConfigSchema = z
  .object({
    cron: scheduleCronConfigSchema,
  })
  .describe("Cron trigger configuration");

const outputTypeSchema = z.enum(GENERATABLE_CONTENT_TYPE_VALUES).describe("Type of content to generate");
const publishDestinationSchema = z
  .enum(["webflow", "framer", "custom"])
  .describe("Where generated content should be published");
const lookbackWindowSchema = z
  .enum(["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"])
  .describe("Time window for gathering data before generation (default: last_7_days)");

export const schedulePayloadSchema = z.object({
  name: z.string().min(1).max(120).describe("Schedule name (1-120 characters)"),
  sourceType: z.literal("cron").describe("Schedule trigger type"),
  sourceConfig: scheduleSourceConfigSchema,
  targets: z
    .object({
      repositoryIds: integrationIdsSchema.optional().describe(repositoryIdsDescription),
      linearIntegrationIds: integrationIdsSchema.optional().describe(linearIntegrationIdsDescription),
    })
    .refine(
      ({ repositoryIds, linearIntegrationIds }) =>
        (repositoryIds?.length ?? 0) > 0 || (linearIntegrationIds?.length ?? 0) > 0,
      { message: "Set at least one GitHub or Linear integration" },
    )
    .describe("Data sources the schedule reads from: GitHub, Linear, or both"),
  outputType: outputTypeSchema,
  outputConfig: z
    .object({
      publishDestination: publishDestinationSchema.optional(),
      brandVoiceId: z.string().min(1).optional().describe("Brand voice ID to use for scheduled output"),
    })
    .optional()
    .describe("Optional publishing and voice settings"),
  enabled: z.boolean().describe("Whether the schedule is active"),
  autoPublish: z.boolean().optional().describe("Whether to auto-publish generated content (default false)"),
  lookbackWindow: lookbackWindowSchema.optional(),
});

export const listSchedulesSchema = z.object({
  repositoryIds: z.array(z.string().min(1)).optional().describe("Only return schedules targeting these repository IDs"),
});

export const updateScheduleSchema = z
  .object({
    scheduleId: z.string().min(1).describe("The schedule ID to update"),
    name: z.string().min(1).max(120).optional().describe("New schedule name (1-120 characters)"),
    sourceConfig: scheduleSourceConfigSchema.optional().describe("Replaces the cron configuration as a whole"),
    targets: z
      .object({
        repositoryIds: integrationIdsSchema
          .optional()
          .describe(`${repositoryIdsDescription}. Replaces the GitHub targets; omit to keep them`),
        linearIntegrationIds: integrationIdsSchema
          .optional()
          .describe(
            `${linearIntegrationIdsDescription}. Replaces the Linear targets; omit to keep them, [] removes them`,
          ),
      })
      .optional()
      .describe("Data source changes; the schedule must keep at least one GitHub or Linear integration"),
    outputType: outputTypeSchema.optional(),
    outputConfig: z
      .object({
        publishDestination: publishDestinationSchema.nullable().optional(),
        brandVoiceId: z.string().min(1).nullable().optional().describe("Brand voice ID to use for scheduled output"),
      })
      .nullable()
      .optional()
      .describe("Merged field by field into the current settings; null clears a field, or all of them"),
    enabled: z.boolean().optional().describe("Whether the schedule is active"),
    autoPublish: z.boolean().optional().describe("Whether to auto-publish generated content"),
    lookbackWindow: lookbackWindowSchema.optional(),
  })
  .refine(({ scheduleId: _scheduleId, ...fields }) => Object.values(fields).some((value) => value !== undefined), {
    message: "Pass at least one field to update",
  });

export const deleteScheduleSchema = z.object({
  scheduleId: z.string().min(1).describe("The schedule ID to delete"),
});

export const runScheduleSchema = z.object({
  scheduleId: z.string().min(1).describe("The schedule ID to run"),
});

export const listScheduleRunsSchema = z.object({
  scheduleId: z.string().min(1).describe("The schedule ID whose runs to list"),
  limit: z.number().int().min(1).max(50).optional().describe("Most recent runs to return (1-50, default 10)"),
});
