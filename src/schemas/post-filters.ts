import * as z from "zod";
import { CONTENT_TYPE_VALUES, POST_STATUS_VALUES } from "../constants/post.js";

function parseCommaSeparatedFilter(value: unknown): unknown {
  if (typeof value === "string") {
    value = [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) =>
      typeof entry === "string"
        ? entry
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
        : [entry],
    );
  }

  return value;
}

export const statusFilterSchema = z
  .preprocess(parseCommaSeparatedFilter, z.array(z.enum(POST_STATUS_VALUES)).min(1))
  .optional()
  .describe(
    "Only return posts in these statuses. Pass one value, an array, or a comma-separated string such as draft,published. Omit to include all statuses.",
  );

export const contentTypeFilterSchema = z
  .preprocess(parseCommaSeparatedFilter, z.array(z.enum(CONTENT_TYPE_VALUES)).min(1))
  .optional()
  .describe(
    "Only return posts of these content types. Pass one value, an array, or a comma-separated string such as blog_post,changelog. Omit to include all types.",
  );

export const brandIdentityIdFilterSchema = z
  .preprocess(parseCommaSeparatedFilter, z.array(z.string().min(1)).min(1))
  .optional()
  .describe(
    "Only return posts written for these brand identities, by ID from list_brand_identities. Pass one ID, an array, or a comma-separated string. Omit to include all.",
  );
