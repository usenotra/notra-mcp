import { z } from "zod";

const postIdSchema = z
  .string()
  .min(1)
  .describe("ID of a blog post or changelog, as returned by list_posts or list_commented_posts");

export const listCommentedPostsSchema = z.object({
  link: z
    .string()
    .max(2000)
    .optional()
    .describe(
      "A post's Notra Sites preview link or its link in Notra, as the user pasted it. Leave out to list the posts with open comments.",
    ),
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe(
      "Page of posts with open comments, 20 per page, starting at 1. Ask for the next one when hasMore is true.",
    ),
});

export const listPostCommentsSchema = z.object({
  postId: postIdSchema,
  status: z
    .enum(["open", "all"])
    .optional()
    .describe("open (default) lists unresolved threads; all includes resolved ones"),
});

export const resolvePostCommentsSchema = z.object({
  postId: postIdSchema,
  threadIds: z
    .array(z.string().min(1))
    .min(1)
    .max(50)
    .describe("IDs of the threads your change addressed, from list_post_comments"),
});

export const replyToPostCommentSchema = z.object({
  postId: postIdSchema,
  threadId: z.string().min(1).describe("ID of the thread to answer, from list_post_comments"),
  body: z
    .string()
    .trim()
    .min(1)
    .max(10000)
    .describe("The reply, shown under the user's name: what you changed, or why you left it as it is"),
});
