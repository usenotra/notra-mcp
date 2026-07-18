import * as z from "zod";
import { FEEDBACK_MAX_MESSAGE_LENGTH } from "../constants/feedback.js";

export const feedbackSentimentSchema = z.enum(["sad_crying", "sad", "happy", "excited"]);

export const submitFeedbackInputSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1)
    .max(FEEDBACK_MAX_MESSAGE_LENGTH)
    .describe("Feedback, bug report, or feature request to send to the Notra team"),
  sentiment: feedbackSentimentSchema.optional().describe("Optional sentiment accompanying the feedback"),
});
