export const WEBHOOK_EVENT_VALUES = [
  "post.generation.completed",
  "post.generation.failed",
  "post.generation.skipped",
  "brand_identity.generation.completed",
  "brand_identity.generation.failed",
  "post.published",
  "post.created",
  "post.updated",
  "post.deleted",
  "post.unpublished",
  "geo.scan.completed",
  "geo.scan.failed",
] as const;
export const WEBHOOK_DELIVERY_STATUS_VALUES = [
  "pending",
  "sending",
  "retrying",
  "succeeded",
  "failed",
  "cancelled",
] as const;
export const WEBHOOK_DELIVERY_STATUS_FILTER_VALUES = ["all", ...WEBHOOK_DELIVERY_STATUS_VALUES] as const;
