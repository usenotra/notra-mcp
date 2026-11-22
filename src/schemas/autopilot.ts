import * as z from "zod";

const autopilotIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/);

export const getAutopilotStatusSchema = z.strictObject({});

export const runAutopilotSchema = z.strictObject({
  kind: z
    .enum(["readiness", "keywords", "commits", "refresh", "comparisons", "rendering", "links", "landing"])
    .optional()
    .describe("Run only this built-in automation. Omit for a full run."),
});

export const stopAutopilotRunSchema = z.strictObject({
  runId: autopilotIdSchema.describe("An active run's runId from get_autopilot_status."),
});

export const runAutopilotWorkflowSchema = z.strictObject({
  workflowId: autopilotIdSchema.describe("A custom workflow's id from get_autopilot_status."),
});
