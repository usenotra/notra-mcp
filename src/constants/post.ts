export const POST_STATUS_VALUES = ["draft", "published"] as const;

export const CONTENT_TYPE_VALUES = [
  "changelog",
  "linkedin_post",
  "twitter_post",
  "blog_post",
  "investor_update",
  "image",
] as const;

export const GENERATABLE_CONTENT_TYPE_VALUES = [
  "changelog",
  "blog_post",
  "linkedin_post",
  "twitter_post",
  "image",
] as const;

export const CREATABLE_CONTENT_TYPE_VALUES = ["blog_post", "changelog", "linkedin_post", "twitter_post"] as const;

export const POST_EXCERPT_LENGTH = 280;
