import * as z from "zod";
import { GENERATABLE_CONTENT_TYPE_VALUES } from "../constants/post.js";

const scheduleCronConfigSchema = z
  .object({
    frequency: z
      .enum(["daily", "weekly", "monthly"])
      .describe("How often the schedule runs: daily, weekly on dayOfWeek, or monthly on dayOfMonth"),
    hour: z.number().int().min(0).max(23).describe("Hour of the day the schedule runs, in UTC"),
    minute: z.number().int().min(0).max(59).describe("Minute past the hour the schedule runs, in UTC"),
    dayOfWeek: z
      .number()
      .int()
      .min(0)
      .max(6)
      .optional()
      .describe(
        "Day of the week a weekly schedule runs, in UTC, where 0 is Sunday and 6 is Saturday. Required when frequency is weekly.",
      ),
    dayOfMonth: z
      .number()
      .int()
      .min(1)
      .max(31)
      .optional()
      .describe("Day of the month a monthly schedule runs, in UTC. Required when frequency is monthly."),
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
const repositoryIdsDescription =
  "GitHub integration IDs to generate from, taken from the github array of list_integrations";
const linearIntegrationIdsDescription =
  "Linear integration IDs to generate from, taken from the linear array of list_integrations";

const scheduleSourceConfigSchema = z
  .object({
    cron: scheduleCronConfigSchema,
  })
  .describe("Cron trigger configuration");

const outputTypeSchema = z
  .enum(GENERATABLE_CONTENT_TYPE_VALUES)
  .describe("Kind of post each run writes, such as a changelog or a LinkedIn post");
const publishDestinationDescription =
  "Where generated content is sent when autoPublish is true: a Webflow or Framer CMS, or a custom destination. Not used while autoPublish is false.";
const publishDestinationSchema = z.enum(["webflow", "framer", "custom"]).describe(publishDestinationDescription);
const lookbackWindowSchema = z
  .enum(["current_day", "yesterday", "last_7_days", "last_14_days", "last_30_days"])
  .describe(
    "How far back each run looks for GitHub and Linear activity to write about. The last 7 days are used when it is not set.",
  );

export const schedulePayloadSchema = z.object({
  name: z.string().min(1).max(120).describe("Label for the schedule shown in Notra"),
  sourceType: z
    .literal("cron")
    .describe("How the schedule is triggered. cron is the only option and runs it on the timing in sourceConfig.cron."),
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
      brandVoiceId: z
        .string()
        .min(1)
        .optional()
        .describe(
          "Brand identity ID, from list_brand_identities, whose voice each run writes in. Omit to use the default brand identity.",
        ),
    })
    .optional()
    .describe("Optional publishing and voice settings"),
  enabled: z.boolean().describe("true to run the schedule on its timing, false to create it paused"),
  autoPublish: z.boolean().optional().describe("Whether to auto-publish generated content (default false)"),
  lookbackWindow: lookbackWindowSchema.optional(),
});

export const listSchedulesSchema = z.object({
  repositoryIds: z
    .array(z.string().min(1))
    .optional()
    .describe(
      "Only return schedules that read from these GitHub integration IDs, from the github array of list_integrations. Omit to list all schedules.",
    ),
});

export const updateScheduleSchema = z
  .object({
    scheduleId: z.string().min(1).describe("ID of the schedule to change, as returned by list_schedules"),
    name: z.string().min(1).max(120).optional().describe("New label for the schedule. Omit to keep the current name."),
    sourceConfig: scheduleSourceConfigSchema.optional().describe("Replaces the cron configuration as a whole"),
    targets: z
      .object({
        repositoryIds: integrationIdsSchema
          .optional()
          .describe(`${repositoryIdsDescription}. Replaces the current GitHub targets; omit to keep them.`),
        linearIntegrationIds: integrationIdsSchema
          .optional()
          .describe(
            `${linearIntegrationIdsDescription}. Replaces the current Linear targets; omit to keep them, [] removes them.`,
          ),
      })
      .optional()
      .describe("Data source changes; the schedule must keep at least one GitHub or Linear integration"),
    outputType: outputTypeSchema.optional(),
    outputConfig: z
      .object({
        publishDestination: publishDestinationSchema
          .nullable()
          .optional()
          .describe(`${publishDestinationDescription} null clears it; omit to keep it.`),
        brandVoiceId: z
          .string()
          .min(1)
          .nullable()
          .optional()
          .describe(
            "Brand identity ID, from list_brand_identities, whose voice each run writes in. null switches to the default brand identity; omit to keep it.",
          ),
      })
      .nullable()
      .optional()
      .describe("Merged field by field into the current settings; null clears a field, or all of them"),
    enabled: z.boolean().optional().describe("false pauses the schedule and true resumes it. Omit to leave it as is."),
    autoPublish: z.boolean().optional().describe("Whether to auto-publish generated content"),
    lookbackWindow: lookbackWindowSchema.optional(),
  })
  .refine(({ scheduleId: _scheduleId, ...fields }) => Object.values(fields).some((value) => value !== undefined), {
    message: "Pass at least one field to update",
  });

export const deleteScheduleSchema = z.object({
  scheduleId: z.string().min(1).describe("ID of the schedule to delete, as returned by list_schedules"),
});

export const runScheduleSchema = z.object({
  scheduleId: z.string().min(1).describe("ID of the enabled schedule to run now, as returned by list_schedules"),
});

export const listScheduleRunsSchema = z.object({
  scheduleId: z.string().min(1).describe("ID of the schedule whose runs to list, as returned by list_schedules"),
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe("How many of the most recent runs to return. Defaults to 10."),
});
