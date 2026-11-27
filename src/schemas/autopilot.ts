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

const longIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/);

const JOB_KINDS = [
  "readiness",
  "keywords",
  "commits",
  "prompts",
  "competitors",
  "refresh",
  "comparisons",
  "rendering",
  "links",
  "landing",
  "outreach",
] as const;
const JOB_KIND_DESCRIPTION =
  "readiness: Agent Readiness fixes. keywords: posts for AI search gaps. commits: posts about shipped releases. prompts: suggests prompts to pause. refresh: updates stale pages. comparisons: comparison pages. rendering: makes pages readable by AI crawlers. links: internal links. landing: landing page copy.";

function autopilotJobsSchema(outreachEnabled: boolean) {
  return z
    .partialRecord(
      z.enum(JOB_KINDS.filter((kind) => kind !== "competitors" && (outreachEnabled || kind !== "outreach"))),
      z.boolean(),
    )
    .optional()
    .describe(
      `Automations to turn on (true) or off (false); omitted ones keep their setting. ${JOB_KIND_DESCRIPTION}${outreachEnabled ? " outreach: pitches to pages AI cites." : ""}`,
    );
}

const approvalModeSchema = z
  .enum(["ask", "auto"])
  .describe("ask: a person merges it. auto: Autopilot publishes it on its own.");
const repositorySchema = z
  .string()
  .max(201)
  .regex(/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/);

export const updateAutopilotSettingsSchema = z
  .strictObject({
    enabled: z.boolean().optional().describe("false pauses Autopilot entirely, true turns it back on."),
    dailyBrief: z
      .boolean()
      .optional()
      .describe("false stops the daily brief for the whole workspace; drafts are then emailed."),
    briefHour: z
      .number()
      .int()
      .min(0)
      .max(23)
      .optional()
      .describe("Hour of day (0-23) the daily run and brief happen."),
    timezone: z.string().trim().min(1).max(64).optional().describe("IANA timezone such as Europe/Berlin."),
    jobs: autopilotJobsSchema(true),
    approvals: z
      .strictObject({
        posts: approvalModeSchema.optional().describe("New posts."),
        updates: approvalModeSchema.optional().describe("Updates to existing pages."),
        fixes: approvalModeSchema.optional().describe("Technical fixes."),
      })
      .optional()
      .describe(
        "Whether Autopilot waits for a person or publishes on its own, per kind of change. Omitted kinds stay.",
      ),
    stalePullRequestDays: z
      .union([z.literal(7), z.literal(14), z.literal(30)])
      .nullable()
      .optional()
      .describe("Days before an untouched draft pull request is closed; null never closes it."),
    contentPath: z
      .string()
      .trim()
      .max(200)
      .nullable()
      .optional()
      .describe("Repository folder new posts go into, e.g. content/blog; null lets Autopilot find it."),
    draftEmails: z
      .enum(["without_slack", "always"])
      .optional()
      .describe(
        "without_slack: no separate email, the daily brief announces drafts. always: an email for each draft right away as well.",
      ),
    reviewers: z
      .array(z.string().trim().min(1).max(140))
      .max(10)
      .optional()
      .describe(
        "The whole list of GitHub logins and org/team names asked to review Autopilot's pull requests; it replaces the current list from get_autopilot_status. [] removes them all.",
      ),
    releaseFilters: z
      .strictObject({
        excludedAuthors: z
          .array(z.string().trim().min(1).max(50))
          .max(50)
          .optional()
          .describe("GitHub logins whose pull requests are never written about."),
        paths: z
          .record(repositorySchema, z.array(z.string().trim().min(1).max(200)).max(20))
          .optional()
          .describe("Per repository (owner/name), only pull requests touching these paths or globs count."),
        repositories: z
          .array(repositorySchema)
          .max(15)
          .optional()
          .describe("Repositories (owner/name) whose releases are read; [] picks them automatically."),
      })
      .optional()
      .describe(
        "Which pull requests the commits automation writes about. Each field named replaces its current value.",
      ),
  })
  .refine((value) => Object.keys(value).length > 0, { message: "Change at least one setting" });

export const updateAutopilotSettingsWithoutOutreachSchema = updateAutopilotSettingsSchema.safeExtend({
  jobs: autopilotJobsSchema(false),
});

export const listAutopilotFindingsSchema = z.strictObject({
  status: z
    .enum(["suggested", "open", "proposed", "merged", "dismissed", "expired", "failed"])
    .optional()
    .describe(
      "suggested: an idea not written yet. open: being written. proposed: a pull request waits for review. merged, dismissed, expired, failed.",
    ),
  kind: z
    .enum(JOB_KINDS.filter((kind) => kind !== "outreach") as [string, ...string[]])
    .optional()
    .describe("Only this automation's findings."),
  limit: z.number().int().min(1).max(100).optional().describe("Newest first; default 25, at most 100."),
});

export const autopilotFindingSchema = z.strictObject({
  findingId: longIdSchema.describe("A finding's id from list_autopilot_findings or get_autopilot_status."),
});

export const dismissAutopilotFindingSchema = autopilotFindingSchema.extend({
  reason: z
    .string()
    .trim()
    .max(300)
    .optional()
    .describe("Why, in the user's words. A stated preference becomes a standing rule."),
});

export const mergeAutopilotFindingSchema = autopilotFindingSchema.extend({
  method: z.enum(["squash", "merge", "rebase"]).optional().describe("Omit for the first method the repository allows."),
  headSha: z
    .string()
    .trim()
    .min(7)
    .max(64)
    .describe(
      "headSha from get_autopilot_finding, the commit you reviewed. The merge is refused if the branch moved past it.",
    ),
});

export const requestAutopilotChangesSchema = autopilotFindingSchema.extend({
  instruction: z
    .string()
    .trim()
    .min(2)
    .max(2000)
    .describe("What to change. Posted as a public comment on the pull request under the user's name."),
});

export const addAutopilotRuleSchema = z.strictObject({
  text: z.string().trim().min(3).max(300).describe("A standing preference, e.g. 'Never write about pricing'."),
});

export const deleteAutopilotRuleSchema = z.strictObject({
  ruleId: longIdSchema.describe("A rule's id from get_autopilot_status."),
});

export const setAutopilotWorkflowEnabledSchema = runAutopilotWorkflowSchema.extend({
  enabled: z.boolean().describe("false stops the workflow's schedule."),
});

export const deleteAutopilotWorkflowSchema = runAutopilotWorkflowSchema;

export const listAutopilotRunsSchema = z.strictObject({
  limit: z.number().int().min(1).max(50).optional().describe("Newest first; default 10, at most 50."),
});

export const getAutopilotRunSchema = z.strictObject({
  runId: longIdSchema.describe("A run's id from list_autopilot_runs or get_autopilot_status."),
});

export const getAutopilotBriefSchema = z.strictObject({});

const pitchIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .regex(/^[A-Za-z0-9_-]+$/)
  .describe("A pitch's id from list_outreach_pitches.");
const stageSchema = z
  .enum(["drafted", "sent", "no_reply", "replied", "negotiating", "accepted", "declined"])
  .describe("Where the conversation stands; negotiating means they want payment.");

export const listOutreachPitchesSchema = z.strictObject({
  status: z
    .enum(["draft", "scheduled", "sent", "listed", "expired", "skipped"])
    .optional()
    .describe(
      "draft: waiting to be sent. scheduled: queued to send later. sent: out. listed: the page lists the brand. expired: no listing weeks after sending. skipped: deleted or passed on.",
    ),
  stage: stageSchema.optional(),
  followUpDue: z.boolean().optional().describe("true: only sent pitches whose follow-up is due now."),
  search: z.string().trim().max(200).optional().describe("Matches the contact, address, site, page title or subject."),
});

export const outreachPitchSchema = z.strictObject({ pitchId: pitchIdSchema });

export const editOutreachPitchSchema = outreachPitchSchema.extend({
  to: z
    .union([z.literal(""), z.email().max(254)])
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
});

export const sendOutreachPitchSchema = outreachPitchSchema.extend({
  sendAt: z
    .union([z.iso.datetime({ offset: true }), z.literal("suggested")])
    .optional()
    .describe(
      "Omit to send now. An ISO time up to 30 days ahead schedules it; suggested uses the pitch's suggestedSendAt, a weekday morning in the recipient's time zone.",
    ),
});

export const setOutreachPitchLaterSchema = outreachPitchSchema.extend({
  later: z.boolean().describe("true puts a draft off until the next daily brief; false undoes that."),
});

export const updateOutreachPitchDetailsSchema = outreachPitchSchema.extend({
  stage: stageSchema
    .nullable()
    .optional()
    .describe("Set the stage by hand, or null to go back to what the thread says."),
  followUpAt: z
    .union([z.iso.datetime({ offset: true }), z.literal("auto")])
    .nullable()
    .optional()
    .describe("When to follow up; null for never, auto for a few days after the last message."),
  deal: z
    .strictObject({
      decision: z.enum(["free", "paid", "declined", "undecided"]),
      amount: z.number().nonnegative().max(1_000_000).nullable(),
      currency: z
        .string()
        .trim()
        .regex(/^[A-Za-z]{3}$/)
        .nullable()
        .describe("ISO 4217, e.g. USD."),
      terms: z.string().trim().max(500).nullable(),
      placementUrl: z.url().max(2000).nullable().describe("Where the listing is live."),
    })
    .nullable()
    .optional()
    .describe("What they asked for in return."),
});

export const getOutreachMailboxSchema = z.strictObject({});
export const disconnectOutreachMailboxSchema = z.strictObject({});
