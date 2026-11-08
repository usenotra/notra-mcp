import * as z from "zod";
import { SITE_AUTHOR_ID_PATTERN, SITE_AUTHOR_PAGE_LAYOUT_VALUES } from "../constants/site.js";

const siteIdSchema = z.string().min(1).describe("Site ID from list_sites");

const siteAuthorIdSchema = z
  .string()
  .regex(SITE_AUTHOR_ID_PATTERN)
  .describe(
    "The author's id in blog.json: 1 to 40 lowercase letters, digits and dashes, starting and ending with a letter or digit, e.g. jane-doe. Posts name the author with it and its author page is {blogMount}/author/{id}.",
  );

const httpsLinkSchema = (label: string) =>
  z
    .url({ protocol: /^https$/ })
    .nullable()
    .optional()
    .describe(`${label} as a full https:// URL`);

export const listSitesSchema = z.object({});

export const listSiteAuthorsSchema = z.object({
  siteId: siteIdSchema,
});

export const upsertSiteAuthorSchema = z.object({
  siteId: siteIdSchema,
  authorId: siteAuthorIdSchema,
  name: z.string().trim().min(1).max(80).describe("Display name (up to 80 characters)"),
  title: z.string().trim().max(80).nullable().optional().describe("Role or job title (up to 80 characters)"),
  bio: z.string().trim().max(300).nullable().optional().describe("Short bio (up to 300 characters)"),
  avatar: z
    .string()
    .trim()
    .nullable()
    .optional()
    .describe("Avatar image: a path in the site's public folder such as /images/jane.png, or an https:// URL"),
  url: httpsLinkSchema("Website"),
  x: httpsLinkSchema("X profile"),
  linkedin: httpsLinkSchema("LinkedIn profile"),
  github: httpsLinkSchema("GitHub profile"),
  youtube: httpsLinkSchema("YouTube channel"),
  bluesky: httpsLinkSchema("Bluesky profile"),
  mastodon: httpsLinkSchema("Mastodon profile"),
  threads: httpsLinkSchema("Threads profile"),
  instagram: httpsLinkSchema("Instagram profile"),
  previousId: siteAuthorIdSchema
    .optional()
    .describe("Current id when renaming an author to authorId. Posts that name the old id lose the link."),
  force: z
    .boolean()
    .optional()
    .describe(
      "Confirm renaming an author that is live or credited on Notra posts. Only set it after the user agreed, once a call without it returned SITE_AUTHOR_IN_USE.",
    ),
});

export const deleteSiteAuthorSchema = z.object({
  siteId: siteIdSchema,
  authorId: siteAuthorIdSchema,
  force: z
    .boolean()
    .optional()
    .describe(
      "Confirm deleting an author that is live or credited on Notra posts; those posts then show the id as a plain name. Only set it after the user agreed.",
    ),
});

export const importSiteAuthorsSchema = z.object({
  siteId: siteIdSchema,
  authorIds: z
    .array(z.string().min(1))
    .min(1)
    .max(100)
    .optional()
    .describe("Notra author IDs to import. Omit to import every Notra author whose slug is not in blog.json yet."),
  replace: z
    .boolean()
    .optional()
    .describe("Replace blog.json authors that already use an imported author's slug instead of skipping them"),
});

export const setSiteAuthorPageSchema = z.object({
  siteId: siteIdSchema,
  layout: z
    .enum(SITE_AUTHOR_PAGE_LAYOUT_VALUES)
    .describe("inline puts the avatar beside the name and title; stacked puts it above them"),
});

export const publishSiteDesignSchema = z.object({
  siteId: siteIdSchema,
  message: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .describe("Commit message. Written from the changes if omitted."),
});
