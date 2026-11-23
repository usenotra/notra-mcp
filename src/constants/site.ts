export const SITE_AUTHOR_PAGE_LAYOUT_VALUES = ["inline", "stacked"] as const;

/** blog.json author ids: what posts write as `author:` and the author page path segment. */
export const SITE_AUTHOR_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

/** Mirrors the API's SITE_AUTHOR_AVATAR: a site path with one leading slash, or an https URL. */
export const SITE_AUTHOR_AVATAR_PATTERN = /^(?:\/(?!\/)|https:\/\/)/;
export const SITE_PATH_PATTERN = /^\/(?!\/)/;

export const SITE_AUTHOR_LINK_FIELDS = [
  "url",
  "x",
  "linkedin",
  "github",
  "youtube",
  "bluesky",
  "mastodon",
  "threads",
  "instagram",
] as const;

/** Publishing writes to GitHub; the API gives it up to 60 seconds. */
export const SITE_PUBLISH_TIMEOUT_MS = 70_000;

/**
 * The API gives every Sites call up to 60 seconds, so writes wait a bit longer
 * instead of reporting a failure while the deployment is still being queued.
 */
export const SITE_WRITE_TIMEOUT_MS = 70_000;

/** get_site_post_preview waits at most this long, below common MCP client timeouts. */
export const POST_PREVIEW_MAX_WAIT_SECONDS = 45;
export const POST_PREVIEW_POLL_MS = 3_000;
/** A preview build that ended without going live. */
export const POST_PREVIEW_STOPPED_STATUSES = new Set(["failed", "canceled", "expired", "superseded", "skipped"]);
