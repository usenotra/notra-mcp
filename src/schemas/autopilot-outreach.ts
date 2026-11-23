import * as z from "zod";
import { autopilotIdSchema } from "./autopilot.js";

const OUTREACH_STAGES = ["drafted", "sent", "no_reply", "replied", "negotiating", "accepted", "declined"] as const;
const OUTREACH_STATUSES = ["draft", "scheduled", "sent", "listed", "expired", "skipped"] as const;
const OUTREACH_DECISIONS = ["free", "paid", "declined", "undecided"] as const;

const pitchIdSchema = autopilotIdSchema.describe("A pitch's id from list_outreach_pitches.");

const pitchSchema = z.strictObject({ pitchId: pitchIdSchema });

export const listOutreachPitchesSchema = z.strictObject({
  status: z
    .enum(OUTREACH_STATUSES)
    .optional()
    .describe(
      "Only pitches in this status. draft: waiting to be sent. scheduled: queued to send later. sent: out. listed: the page lists the brand. expired: no listing weeks after sending. skipped: deleted or passed on (left out unless asked for).",
    ),
  stage: z
    .enum(OUTREACH_STAGES)
    .optional()
    .describe("Only pitches at this conversation stage. negotiating means they want payment."),
  followUpDue: z.boolean().optional().describe("true: only sent pitches whose follow-up is due now."),
  search: z.string().trim().max(200).optional().describe("Matches the contact, address, site, page title or subject."),
});

export const getOutreachPitchSchema = pitchSchema;

export const editOutreachPitchSchema = z
  .strictObject({
    pitchId: pitchIdSchema,
    to: z
      .string()
      .trim()
      .max(254)
      .optional()
      .describe("One email address to send to. Empty sends to the address found on the page."),
    subject: z.string().trim().min(1).max(200).optional(),
    body: z
      .string()
      .trim()
      .min(1)
      .max(5000)
      .optional()
      .describe("Plain text. The unsubscribe line is added when it is sent; don't write one."),
  })
  .refine(({ pitchId: _pitchId, ...fields }) => Object.values(fields).some((value) => value !== undefined), {
    message: "Change at least one of to, subject or body",
  });

export const sendOutreachPitchSchema = z.strictObject({
  pitchId: pitchIdSchema,
  sendAt: z
    .union([z.iso.datetime({ offset: true }), z.literal("suggested")])
    .optional()
    .describe(
      "Omit to send now. An ISO time up to 30 days ahead schedules it; suggested uses the pitch's suggestedSendAt, a weekday morning in the recipient's time zone.",
    ),
});

export const cancelOutreachPitchSchema = pitchSchema;
export const markOutreachPitchSentSchema = pitchSchema;
export const markOutreachPitchListedSchema = pitchSchema;
export const deleteOutreachPitchSchema = pitchSchema;

export const updateOutreachPitchDetailsSchema = z
  .strictObject({
    pitchId: pitchIdSchema,
    stage: z
      .enum(OUTREACH_STAGES)
      .nullable()
      .optional()
      .describe(
        "Set the stage by hand, or null to go back to what the thread says. A newer reply from them replaces a stage set by hand.",
      ),
    followUpAt: z
      .union([z.iso.datetime({ offset: true }), z.literal("auto")])
      .nullable()
      .optional()
      .describe("When to follow up as an ISO time; null for never, auto for a few days after the last message."),
    deal: z
      .strictObject({
        decision: z.enum(OUTREACH_DECISIONS),
        amount: z.number().nonnegative().max(1_000_000).nullable(),
        currency: z
          .string()
          .regex(/^[A-Za-z]{3}$/)
          .nullable()
          .describe("ISO 4217, e.g. USD; either case"),
        terms: z.string().trim().max(500).nullable(),
        placementUrl: z
          .url({ protocol: /^https?$/ })
          .max(2000)
          .nullable()
          .describe("Where the listing is live"),
      })
      .nullable()
      .optional()
      .describe(
        "What they asked for in return; every field is required, use null for unknown. Kept over what Autopilot reads from later replies while their decision stays the same. null clears it.",
      ),
  })
  .refine(({ pitchId: _pitchId, ...fields }) => Object.values(fields).some((value) => value !== undefined), {
    message: "Change at least one of stage, followUpAt or deal",
  });

export const getOutreachMailboxSchema = z.strictObject({});
export const disconnectOutreachMailboxSchema = z.strictObject({});
