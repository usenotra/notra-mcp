import * as z from "zod";
import { feedbackToolInputSchema } from "@usenotra/geo/feedback";
import { FEEDBACK_KIND_VALUES, FEEDBACK_STATUS_VALUES } from "../constants/feedback.js";

export const submitFeedbackSchema = z.strictObject({
  message: feedbackToolInputSchema.message.describe(
    "Task-specific product feedback approved by the user. Exclude conversation history, personal records, payment data, and credentials.",
  ),
  title: feedbackToolInputSchema.title,
  kind: feedbackToolInputSchema.kind,
});

export const listFeedbackSchema = z.object({
  status: z.enum(FEEDBACK_STATUS_VALUES).optional().describe("Only entries with this triage status"),
  kind: z.enum(FEEDBACK_KIND_VALUES).optional().describe("Only entries of this kind"),
  projectId: z.string().min(1).optional().describe("Only entries attached to this project"),
  limit: z.number().int().min(1).max(100).optional().describe("Items per page"),
  page: z.number().int().min(1).optional().describe("Page number"),
});

export const getFeedbackSchema = z.object({
  feedbackId: z.string().min(1).describe("The feedback entry ID (see list_feedback)"),
});

export const updateFeedbackSchema = getFeedbackSchema.extend({
  status: z.enum(FEEDBACK_STATUS_VALUES).describe("New triage status"),
});
