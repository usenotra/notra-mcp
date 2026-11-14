import * as z from "zod";
import { feedbackToolInputSchema, feedbackToolOutputSchema } from "@usenotra/geo/feedback";
import { FEEDBACK_KIND_VALUES, FEEDBACK_STATUS_VALUES } from "../constants/feedback.js";

export const submitFeedbackSchema = z.object({
  message: feedbackToolInputSchema.message.describe(
    "What the user wants to tell the product team, with steps or URLs when reporting a problem. Send only content the user approved, without conversation history, personal records, payment data or credentials.",
  ),
  title: feedbackToolInputSchema.title.describe(
    "One-line summary of the feedback, used as its headline. Omit to send the message alone.",
  ),
  kind: feedbackToolInputSchema.kind.describe("Category of the feedback. Omit if unsure."),
  sentiment: feedbackToolInputSchema.sentiment.describe(
    "Overall tone of the feedback toward the product. Omit if unsure.",
  ),
});

export const submitFeedbackOutputSchema = z.object(feedbackToolOutputSchema);

export const listFeedbackSchema = z.object({
  status: z
    .enum(FEEDBACK_STATUS_VALUES)
    .optional()
    .describe(
      "Only return entries in this triage state, such as new for feedback nobody has looked at. Omit for all states.",
    ),
  kind: z
    .enum(FEEDBACK_KIND_VALUES)
    .optional()
    .describe("Only return entries of this category, such as bug. Omit for all kinds."),
  projectId: z
    .string()
    .min(1)
    .optional()
    .describe("Only return entries attached to this project, by ID from list_projects. Omit for all projects."),
  limit: z.number().int().min(1).max(100).optional().describe("Number of feedback entries per page. Defaults to 25."),
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe("Which page of results to return, starting at 1; follow pagination.nextPage from the previous response"),
});

export const getFeedbackSchema = z.object({
  feedbackId: z.string().min(1).describe("ID of the feedback entry, from list_feedback"),
});

export const updateFeedbackSchema = getFeedbackSchema.extend({
  status: z.enum(FEEDBACK_STATUS_VALUES).describe("Triage status to set on the entry"),
});
