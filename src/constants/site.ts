export const SITE_AUTHOR_PAGE_LAYOUT_VALUES = ["inline", "stacked"] as const;

/** blog.json author ids: what posts write as `author:` and the author page path segment. */
export const SITE_AUTHOR_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

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
