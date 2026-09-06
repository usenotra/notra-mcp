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
  .describe("Filter by status using a comma-separated list");

export const contentTypeFilterSchema = z
  .preprocess(parseCommaSeparatedFilter, z.array(z.enum(CONTENT_TYPE_VALUES)).min(1))
  .optional()
  .describe("Filter by content type using a comma-separated list");

export const brandIdentityIdFilterSchema = z
  .preprocess(parseCommaSeparatedFilter, z.array(z.string().min(1)).min(1))
  .optional()
  .describe("Filter by brand identity ID using a comma-separated list");
