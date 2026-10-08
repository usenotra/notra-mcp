import type * as z from "zod";
import type { schedulePostRequestSchema } from "../schemas/post-schedule.js";
import type { Organization } from "./api.js";

export type SchedulePostRequest = z.infer<typeof schedulePostRequestSchema>;

interface ScheduledPublication {
  id: string;
  destination: "notra" | "github" | "social";
  config:
    | { destination: "notra" }
    | { destination: "github"; repositoryId: string; merge: boolean }
    | { destination: "social"; accountId: string };
  status: "scheduled" | "publishing" | "published" | "failed" | "canceled";
  scheduledAt: string;
  timeZone: string;
  attempts: number;
  errorCode: string | null;
  lastError: string | null;
  resultUrl: string | null;
  publishedAt: string | null;
}

export interface PostScheduleResponse {
  organization: Organization;
  schedule: {
    postId: string;
    scheduledAt: string;
    timeZone: string;
    publications: ScheduledPublication[];
  } | null;
}

export interface CancelPostScheduleResponse {
  organization: Organization;
  canceled: number;
  inProgress: boolean;
}
