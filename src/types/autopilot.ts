import type { infer as Infer } from "zod";
import type {
  editOutreachPitchSchema,
  listAutopilotFindingsSchema,
  listOutreachPitchesSchema,
  logOutreachContactSchema,
  runAutopilotSchema,
  updateAutopilotSettingsSchema,
  updateOutreachPitchDetailsSchema,
} from "../schemas/autopilot.js";

export type RunAutopilotRequest = Infer<typeof runAutopilotSchema>;
export type UpdateAutopilotSettingsRequest = Infer<typeof updateAutopilotSettingsSchema>;
export type ListAutopilotFindingsParams = Infer<typeof listAutopilotFindingsSchema>;
export type ListOutreachPitchesParams = Infer<typeof listOutreachPitchesSchema>;
export type LogOutreachContactRequest = Infer<typeof logOutreachContactSchema>;
export type EditOutreachPitchRequest = Omit<Infer<typeof editOutreachPitchSchema>, "pitchId">;
export type UpdateOutreachPitchDetailsRequest = Omit<Infer<typeof updateOutreachPitchDetailsSchema>, "pitchId">;

/** A JSON object response; its shape is checked by the tool's generated output schema. */
export type AutopilotApiObject = Record<string, unknown>;

export interface AutopilotStatusResponse {
  canManage: boolean;
  settings: {
    enabled: boolean;
    dailyBrief: boolean;
    briefHour: number;
    timezone: string;
    jobs: Record<string, boolean>;
    repository: string | null;
    slackChannelName: string | null;
    reviewers: string[];
    lastRunAt: string | null;
  } | null;
  activeRuns: (
    | {
        runId: string;
        type: "autopilot";
        trigger: "manual" | "cron" | "onboarding" | "github" | "suggestion";
        workflowKey: string | null;
        startedAt: string;
      }
    | { runId: string; type: "custom_workflow"; workflowId: string | null; status: "queued" | "running" }
  )[];
  workflows: {
    id: string;
    name: string;
    enabled: boolean;
    schedule: {
      frequency: "daily" | "weekly" | "monthly";
      hour: number;
      minute: number;
      dayOfWeek?: number;
      dayOfMonth?: number;
    } | null;
    lastRunAt: string | null;
  }[];
  openFindings: {
    id: string;
    kind: string;
    title: string;
    status: "suggested" | "open" | "proposed";
    pullRequestUrl: string | null;
  }[];
  rules: { id: string; text: string }[];
}

export interface StartAutopilotRunResponse {
  runId: string;
  alreadyRunning: boolean;
}

export interface StopAutopilotRunResponse {
  stopped: "autopilot" | "custom_workflow";
}

export interface StartAutopilotWorkflowRunResponse {
  runId: string;
}
