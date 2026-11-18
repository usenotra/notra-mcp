export const FEEDBACK_STATUS_VALUES = ["new", "triaged", "resolved", "archived"] as const;
export const FEEDBACK_KIND_VALUES = ["bug", "feature", "praise", "question", "other"] as const;

/** The sender lookup is best effort, so it never holds feedback up for long. */
export const FEEDBACK_SENDER_LOOKUP_TIMEOUT_MS = 3_000;
