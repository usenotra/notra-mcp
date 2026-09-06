import assert from "node:assert/strict";
import { test } from "vitest";
import { parseChatStream } from "../src/utils/chat-stream.ts";

test("chat streams concatenate both delta formats and retain the first chat ID", () => {
  const stream = [
    ": keepalive",
    'data: {"type":"text-delta","delta":"Hello "}',
    'data: {"type":"text-delta","textDelta":"world"}',
    'data: {"messageMetadata":{"chatId":"chat-1"}}',
    'data: {"messageMetadata":{"chatId":"chat-2"}}',
    "data: [DONE]",
  ].join("\r\n");
  assert.deepEqual(parseChatStream(stream), { text: "Hello world", chatId: "chat-1" });
});

test("malformed and unrelated frames do not swallow valid assistant text", () => {
  const stream = [
    "data: not-json",
    "data: null",
    "data: 42",
    'data: {"type":"reasoning-delta","delta":"private"}',
    'data: {"type":"text-delta","delta":42}',
    'data: {"messageMetadata":{"chatId":""}}',
    'data: {"type":"text-delta","delta":"answer"}',
  ].join("\n");
  assert.deepEqual(parseChatStream(stream), { text: "answer", chatId: null });
});

test("empty and unrecognized streams preserve the raw response as fallback text", () => {
  for (const stream of ["", "plain response", 'data: {"type":"new-format"}']) {
    assert.deepEqual(parseChatStream(stream), { text: stream, chatId: null });
  }
});
