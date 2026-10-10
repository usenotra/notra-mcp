import { POST_EXCERPT_LENGTH } from "../constants/post.js";
import type { Post, PostListResponse, PostSummary, PostSummaryListResponse } from "../types/api.js";

function excerptOf(markdown: string | null): string | null {
  const text = markdown?.replace(/\s+/g, " ").trim();
  if (!text) return null;
  return text.length > POST_EXCERPT_LENGTH ? `${text.slice(0, POST_EXCERPT_LENGTH).trimEnd()}…` : text;
}

function toPostSummary(post: Post): PostSummary {
  const isImage = post.contentType === "image";
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: isImage ? null : excerptOf(post.markdown),
    imageUrl: isImage ? post.content || null : null,
    contentType: post.contentType,
    status: post.status,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export function toPostSummaryList(response: PostListResponse): PostSummaryListResponse {
  return {
    organization: response.organization,
    posts: response.posts.map(toPostSummary),
    pagination: response.pagination,
  };
}
