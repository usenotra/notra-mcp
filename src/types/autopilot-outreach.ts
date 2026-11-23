import type { infer as Infer } from "zod";
import type {
  editOutreachPitchSchema,
  listOutreachPitchesSchema,
  sendOutreachPitchSchema,
  updateOutreachPitchDetailsSchema,
} from "../schemas/autopilot-outreach.js";

export type ListOutreachPitchesParams = Infer<typeof listOutreachPitchesSchema>;
export type EditOutreachPitchRequest = Omit<Infer<typeof editOutreachPitchSchema>, "pitchId">;
export type SendOutreachPitchRequest = Omit<Infer<typeof sendOutreachPitchSchema>, "pitchId">;
export type UpdateOutreachPitchDetailsRequest = Omit<Infer<typeof updateOutreachPitchDetailsSchema>, "pitchId">;

export type OutreachPitchStatus = "draft" | "scheduled" | "sent" | "listed" | "expired" | "skipped";
export type OutreachPitchStage = "drafted" | "sent" | "no_reply" | "replied" | "negotiating" | "accepted" | "declined";

export interface OutreachPitchSummary {
  id: string;
  status: OutreachPitchStatus;
  stage: OutreachPitchStage | null;
  page: { url: string; domain: string; title: string; publisher: string };
  recipient: { name: string; email: string | null };
  subject: string;
  problem: "bounced" | "complained" | "failed" | null;
  sentAt: string | null;
  scheduledAt: string | null;
  followUpAt: string | null;
  followUpDue: boolean;
  lastActivityAt: string;
  replyCount: number;
  deal: {
    decision: "free" | "paid" | "declined" | "undecided";
    amount: number | null;
    currency: string | null;
    terms: string | null;
    placementUrl: string | null;
    summary: string;
  } | null;
}

export interface OutreachPitch extends OutreachPitchSummary {
  body: string;
  from: string | null;
  reason: string;
  citedFor: string[];
  competitorsListed: string[];
  contactRoutes: { type: string; value: string; foundOn: string }[];
  suggestedSendAt: string | null;
  optedOut: boolean;
  thread: { at: string; from: string; kind: "answer" | "stop" | "autoreply" | "unrelated"; text: string }[];
}

export interface OutreachPitchListResponse {
  pitches: OutreachPitchSummary[];
}

export interface OutreachPitchResponse {
  pitch: OutreachPitch;
}

export interface SendOutreachPitchResponse extends OutreachPitchResponse {
  scheduledAt: string | null;
}

export interface DeleteOutreachPitchResponse {
  deleted: true;
}

export interface OutreachMailboxResponse {
  mailbox: {
    email: string;
    provider: "google" | "microsoft";
    status: "active" | "needs_reauth";
    lastSentAt: string | null;
  } | null;
  connectUrl: string;
}

export interface DisconnectOutreachMailboxResponse {
  disconnected: true;
}
