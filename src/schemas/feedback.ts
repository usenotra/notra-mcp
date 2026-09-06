import * as z from "zod";
import { feedbackToolInputSchema } from "@usenotra/geo/feedback";

export const submitFeedbackSchema = z.object(feedbackToolInputSchema);
