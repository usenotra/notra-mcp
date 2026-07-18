import type * as z from "zod";
import type { feedbackSentimentSchema, submitFeedbackInputSchema } from "../schemas/feedback.js";

export type FeedbackSentiment = z.infer<typeof feedbackSentimentSchema>;

export type SubmitFeedbackRequest = z.infer<typeof submitFeedbackInputSchema>;

export interface SubmitFeedbackResponse {
  success: true;
}
