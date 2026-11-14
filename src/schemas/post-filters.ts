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
  .describe("Statuses to include; a post matches if it has any of them. Omit to include all statuses.");

export const contentTypeFilterSchema = z
  .preprocess(parseCommaSeparatedFilter, z.array(z.enum(CONTENT_TYPE_VALUES)).min(1))
  .optional()
  .describe("Content types to include; a post matches if it has any of them. Omit to include all types.");

export const brandIdentityIdFilterSchema = z
  .preprocess(parseCommaSeparatedFilter, z.array(z.string().min(1)).min(1))
  .optional()
  .describe(
    "Brand identity IDs from list_brand_identities; only posts written for one of them are returned. Omit to include all.",
  );
