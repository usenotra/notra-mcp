export const SITE_AUTHOR_PAGE_LAYOUT_VALUES = ["inline", "stacked"] as const;

/** blog.json author ids: what posts write as `author:` and the author page path segment. */
export const SITE_AUTHOR_ID_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

/** Mirrors the API's SITE_AUTHOR_AVATAR: a site path with one leading slash, or an https URL. */
export const SITE_AUTHOR_AVATAR_PATTERN = /^(?:\/(?!\/)|https:\/\/)/;

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
