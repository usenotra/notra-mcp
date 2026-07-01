import { describe, expect, it } from "vitest";
import { parseChatStream } from "./chat-stream.js";

// Modeled on a live capture from 2026-07-01 (AI-SDK UI message stream protocol).
const startFrame =
  'data: {"type":"start","messageMetadata":{"chatId":"c1ceeb2b-0000-0000-0000-000000000000","model":"anthropic/claude-sonnet-4.6","requestedModel":"auto","thinkingLevel":"medium","createdAt":1782939023220}}';

describe("parseChatStream", () => {
  it("concatenates text-delta frames and extracts the chat ID", () => {
    const stream = [
      startFrame,
      'data: {"type":"text-start","id":"t1"}',
      'data: {"type":"text-delta","id":"t1","delta":"po"}',
      'data: {"type":"text-delta","id":"t1","delta":"ng"}',
      'data: {"type":"text-end","id":"t1"}',
      'data: {"type":"finish"}',
      "data: [DONE]",
      "",
    ].join("\n");

    const parsed = parseChatStream(stream);
    expect(parsed.text).toBe("pong");
    expect(parsed.text).not.toContain("data: {");
    expect(parsed.chatId).toBe("c1ceeb2b-0000-0000-0000-000000000000");
    expect(parsed.raw).toBe(stream);
  });

  it("accepts the textDelta field name as a fallback", () => {
    const stream = 'data: {"type":"text-delta","textDelta":"hello"}\ndata: [DONE]\n';
    expect(parseChatStream(stream).text).toBe("hello");
  });

  it("falls back to the raw stream when no text frames are recognized", () => {
    const stream = 'data: {"type":"mystery","payload":"??"}\ndata: [DONE]\n';
    const parsed = parseChatStream(stream);
    expect(parsed.text).toBe(stream);
    expect(parsed.raw).toBe(stream);
  });

  it("returns empty text and null chatId for an empty stream", () => {
    expect(parseChatStream("")).toEqual({ text: "", chatId: null, raw: "" });
  });

  it("skips malformed JSON lines and parses the rest", () => {
    const stream = [
      startFrame,
      "data: {not json at all",
      'data: {"type":"text-delta","delta":"ok"}',
      "data: [DONE]",
    ].join("\n");

    const parsed = parseChatStream(stream);
    expect(parsed.text).toBe("ok");
    expect(parsed.chatId).toBe("c1ceeb2b-0000-0000-0000-000000000000");
  });
});
