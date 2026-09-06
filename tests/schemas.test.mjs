import assert from "node:assert/strict";
import { test } from "vitest";
import {
  statusFilterSchema,
  contentTypeFilterSchema,
  brandIdentityIdFilterSchema,
} from "../src/schemas/post-filters.ts";
import { geoCompetitorImportSchema, geoPromptImportSchema } from "../src/schemas/geo-import.ts";
import { geoResourceIdSchema } from "../src/schemas/geo-fields.ts";
import { toImportSource } from "../src/utils/import-source.ts";

test("post filters accept comma-separated strings and arrays without losing values", () => {
  assert.deepEqual(statusFilterSchema.parse(" draft, published , "), ["draft", "published"]);
  assert.deepEqual(statusFilterSchema.parse(["draft,published", " draft "]), ["draft", "published", "draft"]);
  assert.deepEqual(contentTypeFilterSchema.parse("blog_post,image"), ["blog_post", "image"]);
  assert.deepEqual(brandIdentityIdFilterSchema.parse("brand-1, brand-2"), ["brand-1", "brand-2"]);
  assert.equal(statusFilterSchema.parse(undefined), undefined);
  for (const input of ["", [], [42], "unknown", null]) {
    assert.equal(statusFilterSchema.safeParse(input).success, false);
  }
});

test("GEO resource IDs reject path separators, whitespace and oversized IDs", () => {
  assert.equal(geoResourceIdSchema.parse(" project_1-a "), "project_1-a");
  for (const input of ["", "a/b", "../project", "a b", "x".repeat(101)]) {
    assert.equal(geoResourceIdSchema.safeParse(input).success, false);
  }
});

test("imports require exactly one nonempty source and enforce API row limits", () => {
  for (const [schema, row, max] of [
    [geoPromptImportSchema, { prompt: "How does this product work?" }, 500],
    [geoCompetitorImportSchema, { name: "Competitor" }, 25],
  ]) {
    const rows = Array.from({ length: max }, () => row);
    assert.equal(schema.safeParse({ projectId: "p", rows }).success, true);
    assert.equal(schema.safeParse({ projectId: "p", csv: "name\nCompetitor" }).success, true);
    for (const source of [
      {},
      { rows: [] },
      { csv: "" },
      { rows, csv: "data" },
      { rows: [...rows, row] },
      { csv: "x".repeat(1024 * 1024 + 1) },
    ]) {
      assert.equal(schema.safeParse({ projectId: "p", ...source }).success, false);
    }
    assert.deepEqual(toImportSource(rows, undefined), { rows });
  }
  assert.deepEqual(toImportSource(undefined, "csv"), { csv: "csv" });
  assert.throws(() => toImportSource(undefined, undefined), /exactly one/);
  assert.throws(() => toImportSource([], "csv"), /exactly one/);
});

test("import rows validate prompt length and competitor aliases", () => {
  assert.equal(geoPromptImportSchema.safeParse({ projectId: "p", rows: [{ prompt: "short" }] }).success, false);
  assert.equal(
    geoCompetitorImportSchema.safeParse({ projectId: "p", rows: [{ name: "Acme", synonyms: Array(9).fill("alias") }] })
      .success,
    false,
  );
});

test("GEO dates must exist in the calendar, including leap years", async () => {
  const { geoDaySchema } = await import("../src/schemas/geo-fields.ts");
  assert.equal(geoDaySchema.parse("2024-02-29"), "2024-02-29");
  for (const date of ["2025-02-29", "2026-13-01", "2026-04-31", "2026-1-01"])
    assert.equal(geoDaySchema.safeParse(date).success, false);
});

test("both schedule creation and update require the day for weekly/monthly runs", async () => {
  const { schedulePayloadSchema, updateScheduleSchema } = await import("../src/schemas/schedule.ts");
  const body = {
    name: "Weekly summary",
    sourceType: "cron",
    targets: { repositoryIds: ["repo-1"] },
    outputType: "blog_post",
    enabled: true,
  };
  for (const schema of [schedulePayloadSchema, updateScheduleSchema]) {
    for (const [frequency, day] of [
      ["daily", {}],
      ["weekly", { dayOfWeek: 0 }],
      ["monthly", { dayOfMonth: 31 }],
    ]) {
      const input = {
        ...body,
        scheduleId: "schedule-1",
        sourceConfig: { cron: { frequency, hour: 12, minute: 30, ...day } },
      };
      assert.equal(schema.safeParse(input).success, true);
      if (frequency !== "daily") {
        input.sourceConfig.cron = { frequency, hour: 12, minute: 30 };
        assert.equal(schema.safeParse(input).success, false);
      }
    }
  }
});

test("GEO updates reject empty patches while accepting explicit false values", async () => {
  const { updateProjectSchema } = await import("../src/schemas/project.ts");
  const { createGeoSequenceSchema, updateGeoSequenceSchema } = await import("../src/schemas/geo-sequence.ts");
  assert.equal(updateProjectSchema.safeParse({ projectId: "p" }).success, false);
  assert.equal(updateProjectSchema.safeParse({ projectId: "p", name: "Renamed" }).success, true);
  assert.equal(updateGeoSequenceSchema.safeParse({ projectId: "p", sequenceId: "s" }).success, false);
  assert.equal(updateGeoSequenceSchema.safeParse({ projectId: "p", sequenceId: "s", enabled: false }).success, true);
  for (const steps of [[], Array(6).fill("A sufficiently long prompt")]) {
    assert.equal(createGeoSequenceSchema.safeParse({ projectId: "p", name: "Sequence", steps }).success, false);
  }
});

test("GEO settings require a complete configuration and allowed scan intervals", async () => {
  const { updateGeoSettingsSchema } = await import("../src/schemas/geo-settings.ts");
  const settings = {
    projectId: "p",
    companyName: "Acme",
    aliases: [],
    languages: ["English"],
    engines: ["engine-1"],
    enforceZdr: true,
    nonZdrApprovedEngines: [],
    enabled: false,
    scanIntervalHours: 24,
  };
  assert.equal(updateGeoSettingsSchema.safeParse(settings).success, true);
  for (const changes of [
    { engines: [] },
    { languages: [] },
    { scanIntervalHours: 25 },
    { aliases: Array(11).fill("Acme") },
    { enabled: undefined },
  ]) {
    assert.equal(updateGeoSettingsSchema.safeParse({ ...settings, ...changes }).success, false);
  }
});

test("post updates validate slugs and skill names cannot contain paths", async () => {
  const { updatePostSchema } = await import("../src/schemas/post.ts");
  const { skillPayloadSchema } = await import("../src/schemas/skill.ts");
  assert.equal(updatePostSchema.safeParse({ postId: "p", slug: null }).success, true);
  assert.equal(updatePostSchema.safeParse({ postId: "p", slug: "valid-slug" }).success, true);
  for (const slug of ["a/b", "Uppercase", "-leading", "double--hyphen"])
    assert.equal(updatePostSchema.safeParse({ postId: "p", slug }).success, false);
  for (const name of ["../file", "trailing-", "with space", "UPPERCASE"])
    assert.equal(
      skillPayloadSchema.safeParse({ name, description: "Description", content: "Instructions" }).success,
      false,
    );
});
