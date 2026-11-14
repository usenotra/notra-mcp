import * as z from "zod";
import { geoResourceIdSchema } from "./geo-fields.js";

export const postScheduleParamsSchema = z.object({
  postId: geoResourceIdSchema.describe("The existing post ID (see list_posts)"),
});

export const schedulePostRequestSchema = z.object({
  scheduledAt: z.iso
    .datetime({ offset: true })
    .describe(
      "When to publish, including a UTC offset, such as 2026-10-06T08:00:00Z. At most one year ahead; up to five minutes in the past publishes immediately.",
    ),
  timeZone: z
    .string()
    .min(1)
    .max(100)
    .optional()
    .describe(
      "IANA time zone the schedule was picked in, such as Europe/Berlin, used only to show the scheduled time in Notra and in notification emails. It does not shift scheduledAt. Omit to use UTC.",
    ),
  destinations: z
    .array(
      z.discriminatedUnion("destination", [
        z.object({
          destination: z
            .literal("github")
            .describe("Publish a blog post or changelog to a connected GitHub repository through a pull request"),
          repositoryId: geoResourceIdSchema.describe(
            "GitHub integration ID from list_integrations; blog posts and changelogs only",
          ),
          merge: z
            .boolean()
            .optional()
            .describe("Merge the pull request at publishing time (default true); false only opens or updates it"),
        }),
        z.object({
          destination: z
            .literal("social")
            .describe("Post to a connected X or LinkedIn account that matches the post's platform"),
          accountId: geoResourceIdSchema.describe("Connected X or LinkedIn account ID matching the post's platform"),
        }),
      ]),
    )
    .max(2)
    .optional()
    .describe("Optional publishing destinations besides Notra. The post is always published in Notra."),
});

export const schedulePostSchema = z.object({
  ...postScheduleParamsSchema.shape,
  ...schedulePostRequestSchema.shape,
});
