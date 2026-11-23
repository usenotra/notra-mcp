import type { Organization } from "./api.js";

export interface CommentedPost {
  postId: string;
  title: string;
  openThreads: number;
  lastCommentAt: string | null;
  /** Set when looking up a preview link: the Site to rebuild the preview on. */
  siteId?: string;
}

export interface CommentedPostsResponse {
  posts: CommentedPost[];
  organization: Organization;
}

export interface PostCommentReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface PostCommentThread {
  id: string;
  quote: string | null;
  author: string;
  body: string;
  leftOn: "preview" | "editor";
  resolved: boolean;
  deleted: boolean;
  createdAt: string;
  replies: PostCommentReply[];
}

export interface PostCommentsResponse {
  threads: PostCommentThread[];
  openThreads: number;
  organization: Organization;
}

export interface ResolvePostCommentsResponse {
  resolved: string[];
  skipped: string[];
}

export interface ReplyToPostCommentResponse {
  id: string;
}
