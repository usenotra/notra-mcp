import * as z from "zod";
import { CONTENT_TYPE_VALUES, POST_STATUS_VALUES } from "./types.js";

function parseCommaSeparatedFilter(value: unknown): unknown {
  if (value === undefined) {
    return value;
  }

  if (typeof value === "string") {
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) =>
      typeof entry === "string" ? entry.split(",").map((part) => part.trim()).filter(Boolean) : [entry]
    );
  }

  return value;
}

function createCommaSeparatedEnumFilterSchema<const T extends readonly [string, ...string[]]>(
  values: T,
  description: string
) {
  return z
    .preprocess(parseCommaSeparatedFilter, z.array(z.enum(values)).min(1))
    .optional()
    .describe(description);
}

export const statusFilterSchema = createCommaSeparatedEnumFilterSchema(
  POST_STATUS_VALUES,
  "Filter by status using a comma-separated list"
);

export const contentTypeFilterSchema = createCommaSeparatedEnumFilterSchema(
  CONTENT_TYPE_VALUES,
  "Filter by content type using a comma-separated list"
);

export const brandIdentityIdFilterSchema = z
  .preprocess(parseCommaSeparatedFilter, z.array(z.string().min(1)).min(1))
  .optional()
  .describe("Filter by brand identity ID using a comma-separated list");
