export const POST_STATUS_VALUES = ["draft", "published"] as const;

export const CONTENT_TYPE_VALUES = [
  "changelog",
  "linkedin_post",
  "twitter_post",
  "blog_post",
  "investor_update",
  "image",
] as const;

export const GENERATABLE_CONTENT_TYPE_VALUES = ["changelog", "blog_post", "linkedin_post", "twitter_post"] as const;

export const CREATABLE_CONTENT_TYPE_VALUES = ["blog_post", "changelog", "linkedin_post", "twitter_post"] as const;

export const POST_EXCERPT_LENGTH = 280;

/** The API's limits for a post's title, slug and markdown, the same on create and update. */
export const POST_TITLE_MAX_LENGTH = 120;
export const POST_SLUG_MAX_LENGTH = 160;
export const POST_MARKDOWN_MAX_LENGTH = 100_000;
export const POST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** The API gives opening a post's pull request up to 150 seconds. */
export const POST_PULL_REQUEST_TIMEOUT_MS = 160_000;
