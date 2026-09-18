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

test("pending skill approval is a failure even after reassuring progress text", () => {
  const stream = [
    'data: {"type":"text-delta","delta":"Creating marketplace-review-voice now."}',
    'data: {"type":"tool-input-available","toolCallId":"save-1","toolName":"createSkill"}',
    'data: {"type":"tool-approval-request","toolCallId":"save-1","approvalId":"approval-1"}',
    'data: {"messageMetadata":{"chatId":"chat-1"}}',
    'data: {"type":"finish"}',
    "data: [DONE]",
  ].join("\n");
  assert.throws(() => parseChatStream(stream), /requires approval \(chat chat-1\): createSkill.*have not executed/);
});

test("completed approvals do not block successful tool results", () => {
  const stream = [
    'data: {"type":"tool-approval-request","toolCallId":"save-1"}',
    'data: {"type":"tool-output-available","toolCallId":"save-1","output":{"status":"created"}}',
    'data: {"type":"text-delta","delta":"Saved."}',
  ].join("\n");
  assert.deepEqual(parseChatStream(stream), { text: "Saved.", chatId: null });
});

test("stream errors and aborts cannot be hidden by progress text", () => {
  for (const frame of [{ type: "error", errorText: "Save failed" }, { type: "abort" }]) {
    const stream = 'data: {"type":"text-delta","delta":"Creating the skill"}\n' + `data: ${JSON.stringify(frame)}`;
    assert.throws(() => parseChatStream(stream, "header-chat"), /Notra chat failed \(chat header-chat\)/);
  }
});
