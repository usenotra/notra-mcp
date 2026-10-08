import * as z from "zod";
import { geoResourceIdSchema } from "./geo-fields.js";

export const postScheduleParamsSchema = z.object({
  postId: geoResourceIdSchema.describe("The existing post ID (see list_posts)"),
});

export const schedulePostRequestSchema = z.object({
  scheduledAt: z.iso
    .datetime({ offset: true })
    .describe(
      "ISO 8601 publishing time with a UTC offset. At most one year ahead; up to five minutes in the past publishes immediately.",
    ),
  timeZone: z.string().min(1).max(100).optional().describe("IANA time zone for display and emails (default UTC)"),
  destinations: z
    .array(
      z.discriminatedUnion("destination", [
        z.object({
          destination: z.literal("github"),
          repositoryId: geoResourceIdSchema.describe(
            "GitHub integration ID from list_integrations; blog posts and changelogs only",
          ),
          merge: z
            .boolean()
            .optional()
            .describe("Merge the pull request at publishing time (default true); false only opens or updates it"),
        }),
        z.object({
          destination: z.literal("social"),
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
