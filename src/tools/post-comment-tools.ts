import type { NotraClient } from "../notra-client.js";
import {
  listCommentedPostsSchema,
  listPostCommentsSchema,
  replyToPostCommentSchema,
  resolvePostCommentsSchema,
} from "../schemas/post-comment.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

const READ = {
  readOnlyHint: true,
  openWorldHint: false,
  destructiveHint: false,
  idempotentHint: true,
};

/**
 * Team comments on a post, left in the editor or on its Notra Sites preview,
 * so an agent can work the feedback in: list, revise, answer, resolve,
 * rebuild the preview.
 */
export function registerPostCommentTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_commented_posts",
      description:
        'Find the posts teammates left open comments on, newest first. Use it when the user asks to "fix the comments" or "work in the feedback" without naming a post: pass the preview or post link they gave as link, or leave it out to see every post with open comments (work on the only one, ask which if several). Returns posts (postId, title, openThreads, lastCommentAt, and siteId for a preview link: pass it to preview_post_on_site to rebuild; otherwise find the site with list_sites), hasMore (another page follows), total (posts with open comments across all pages: use it when asked how many) and the organization.',
      annotations: { title: "List Commented Posts", ...READ },
      inputSchema: shareJsonSchema(listCommentedPostsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listCommentedPosts")),
    },
    // An empty link means none, not a filter that matches nothing.
    ({ link, page }) => handleError(() => client.listCommentedPosts({ link: link || undefined, page })),
  );

  server.tool(
    {
      name: "list_post_comments",
      description:
        "Read the comment threads teammates left on a post, in the editor or on its site preview. Each thread quotes the passage it is about and includes its replies; deleted marks a thread whose first comment was removed (act on its replies). To work the feedback in: read the open threads, revise the post with update_post, then reply in every thread you worked on with reply_to_post_comment (one or two sentences: what you changed, or why you left it, including for questions you leave open), resolve the ones your edit handled with resolve_post_comments, and rebuild the preview with preview_post_on_site so the team sees the new version. The team reads your replies on the page, so don't skip them. Returns threads, openThreads and the organization.",
      annotations: { title: "List Post Comments", ...READ },
      inputSchema: shareJsonSchema(listPostCommentsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listPostComments")),
    },
    ({ postId, status }) => handleError(() => client.listPostComments(postId, status)),
  );

  server.tool(
    {
      name: "reply_to_post_comment",
      description:
        "Answer an open comment thread, shown under the signed-in user's name. After revising a post for its comments, reply in every thread you worked on: say what you changed, or why you left it (for a question you can't answer, say it's left for the team). Do this before resolving. Needs an OAuth sign-in or account key; organization keys have no person to write as. Returns the reply's id.",
      annotations: {
        title: "Reply to Post Comment",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(replyToPostCommentSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("replyToPostComment")),
    },
    ({ postId, threadId, body }) => handleError(() => client.replyToPostComment(postId, threadId, body)),
  );

  server.tool(
    {
      name: "resolve_post_comments",
      description:
        "Mark comment threads done after your edit addressed them and you replied in them. Pass only threads your change actually handled; leave questions and anything you didn't change open. Returns resolved and skipped thread IDs (skipped: already resolved, replies, or not on this post).",
      annotations: {
        title: "Resolve Post Comments",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(resolvePostCommentsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("resolvePostComments")),
    },
    ({ postId, threadIds }) => handleError(() => client.resolvePostComments(postId, threadIds)),
  );
}
