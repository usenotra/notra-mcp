import * as z from "zod";
import {
  SITE_AUTHOR_AVATAR_PATTERN,
  SITE_AUTHOR_ID_PATTERN,
  SITE_AUTHOR_PAGE_LAYOUT_VALUES,
} from "../constants/site.js";

const siteIdSchema = z.string().min(1).describe("ID of the Notra Site, as returned by list_sites");

const siteAuthorIdSchema = z
  .string()
  .regex(SITE_AUTHOR_ID_PATTERN)
  .describe(
    "The author's id in the site's blog.json, such as jane-doe; list_site_authors shows existing ids. Posts name the author with it and its author page is {blogMount}/author/{id}.",
  );

const httpsLinkSchema = (label: string) =>
  z
    .url({ protocol: /^https$/ })
    .nullable()
    .optional()
    .describe(`${label} linked from the author page. Leave it out to show no link.`);

export const listSitesSchema = z.object({});

export const listSiteAuthorsSchema = z.object({
  siteId: siteIdSchema,
});

export const upsertSiteAuthorSchema = z.object({
  siteId: siteIdSchema,
  authorId: siteAuthorIdSchema,
  name: z.string().trim().min(1).max(80).describe("Author name shown on posts and on the author page"),
  title: z
    .string()
    .trim()
    .max(80)
    .nullable()
    .optional()
    .describe("Role or job title shown with the name, such as Head of Engineering. Leave it out to show none."),
  bio: z
    .string()
    .trim()
    .max(300)
    .nullable()
    .optional()
    .describe("Short biography shown on the author page. Leave it out to show none."),
  avatar: z
    .string()
    .trim()
    .regex(SITE_AUTHOR_AVATAR_PATTERN)
    .nullable()
    .optional()
    .describe(
      "Author photo: a path to an image in the site's public folder, such as /images/jane.png, or an image URL. Leave it out for no avatar.",
    ),
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
    .describe(
      "The author's existing id, only when renaming it to authorId. Posts that still name the old id lose their link to the author. Omit when not renaming.",
    ),
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

export const updateSiteSectionsSchema = z.object({
  siteId: siteIdSchema,
  blog: z.string().min(1).optional().describe("Path the blog is served at, like /blog. Omit to turn the blog off."),
  changelog: z
    .string()
    .min(1)
    .optional()
    .describe("Path the changelog is served at, like /changelog. Omit to turn the changelog off."),
});

export const publishSiteDesignSchema = z.object({
  siteId: siteIdSchema,
  message: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .describe("Commit message for the published design changes. Omit to have Notra write one from the changes."),
});

const deploymentIdSchema = z
  .string()
  .min(1)
  .describe("ID of the deployment to inspect, as returned by list_site_deployments");
const postIdSchema = z.string().min(1).describe("ID of a saved blog post or changelog (see list_posts)");

export const siteSchema = z.object({ siteId: siteIdSchema });

export const listSiteDeploymentsSchema = z.object({
  siteId: siteIdSchema,
  limit: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe(
      "How many of the newest deployments to return. Defaults to 20. Live deployments are always included on top of these.",
    ),
});

export const siteDeploymentSchema = z.object({ siteId: siteIdSchema, deploymentId: deploymentIdSchema });

export const createSitePostPreviewSchema = z.object({
  siteId: siteIdSchema,
  postId: postIdSchema,
  lifetime: z.enum(["1h", "1d", "3d", "7d"]).optional().describe("How long the preview stays open (default 1d)"),
});

export const sitePostSchema = z.object({ siteId: siteIdSchema, postId: postIdSchema });
