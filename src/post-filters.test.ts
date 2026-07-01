import { describe, expect, it } from "vitest";
import { brandIdentityIdFilterSchema, contentTypeFilterSchema, statusFilterSchema } from "./post-filters.js";

describe("statusFilterSchema", () => {
  it("parses a comma-separated string into an array", () => {
    expect(statusFilterSchema.parse("draft,published")).toEqual(["draft", "published"]);
  });

  it("passes an array of values through unchanged", () => {
    expect(statusFilterSchema.parse(["draft", "published"])).toEqual(["draft", "published"]);
  });

  it("flattens array entries containing comma-separated strings", () => {
    expect(statusFilterSchema.parse(["draft,published"])).toEqual(["draft", "published"]);
  });

  it("rejects unknown enum values", () => {
    expect(() => statusFilterSchema.parse("bogus")).toThrow();
  });

  it("rejects an empty array", () => {
    expect(() => statusFilterSchema.parse([])).toThrow();
  });

  it("keeps undefined as undefined", () => {
    expect(statusFilterSchema.parse(undefined)).toBeUndefined();
  });
});

describe("contentTypeFilterSchema", () => {
  it("parses a comma-separated string into an array", () => {
    expect(contentTypeFilterSchema.parse("changelog,blog_post")).toEqual(["changelog", "blog_post"]);
  });

  it("rejects unknown enum values", () => {
    expect(() => contentTypeFilterSchema.parse("bogus")).toThrow();
  });
});

describe("brandIdentityIdFilterSchema", () => {
  it("splits on commas and trims whitespace", () => {
    expect(brandIdentityIdFilterSchema.parse(" a , b ")).toEqual(["a", "b"]);
  });

  it("keeps undefined as undefined", () => {
    expect(brandIdentityIdFilterSchema.parse(undefined)).toBeUndefined();
  });
});
