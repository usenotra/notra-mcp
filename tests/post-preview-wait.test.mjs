import assert from "node:assert/strict";
import { test } from "node:test";

const { waitForPostPreview } = await import("../build/utils/post-preview.js");

const preview = (status, latestLive = false) => ({
  organization: { id: "workspace-test" },
  preview: { status, live: true, latestLive, deleting: false, errorMessage: null },
});

function reader(...responses) {
  let calls = 0;
  const read = async () => responses[Math.min(calls++, responses.length - 1)];
  return { read, calls: () => calls };
}

test("waits until the latest build is live, not just ready", async () => {
  const { read, calls } = reader(preview("building"), preview("ready"), preview("ready", true));
  const result = await waitForPostPreview(read, 5, 1);
  assert.equal(result.preview.latestLive, true);
  assert.equal(calls(), 3);
});

test("stops at a failed build or a missing preview", async () => {
  const failed = reader(preview("building"), preview("failed"));
  assert.equal((await waitForPostPreview(failed.read, 5, 1)).preview.status, "failed");
  const none = reader({ organization: {}, preview: null });
  assert.equal((await waitForPostPreview(none.read, 5, 1)).preview, null);
  assert.equal(none.calls(), 1);
});

test("a wait shorter than the poll interval still reads again at its deadline", async () => {
  const { read, calls } = reader(preview("building"), preview("ready", true));
  const result = await waitForPostPreview(read, 0.05, 3_000);
  assert.equal(result.preview.latestLive, true);
  assert.equal(calls(), 2);
});

test("returns the current state when the wait runs out, and reads once without one", async () => {
  const slow = reader(preview("building"));
  const started = Date.now();
  assert.equal((await waitForPostPreview(slow.read, 0.05, 10)).preview.status, "building");
  assert.ok(Date.now() - started < 500);
  const once = reader(preview("building"));
  await waitForPostPreview(once.read, 0);
  assert.equal(once.calls(), 1);
});
