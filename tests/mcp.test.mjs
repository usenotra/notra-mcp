import assert from "node:assert/strict";
import { test } from "vitest";
import { handleError } from "../src/utils/mcp.ts";

test("object API responses include both MCP text and structured content", async () => {
  const data = { posts: [{ id: "post-1" }] };
  assert.deepEqual(await handleError(async () => data), {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  });
});

test("non-object responses do not become invalid MCP structured content", async () => {
  for (const data of [[], null, "answer", 0, false]) {
    assert.deepEqual(await handleError(async () => data), {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    });
  }
});

test("sync throws and async rejections become MCP tool errors", async () => {
  for (const fn of [
    () => {
      throw new Error("sync failure");
    },
    async () => {
      throw "async failure";
    },
  ]) {
    const result = await handleError(fn);
    assert.equal(result.isError, true);
    assert.match(result.content[0].text, /failure/);
    assert.equal(result.structuredContent, undefined);
  }
});
