import type { ChatStreamResponse } from "../types/api.js";
import { chatStreamFrameSchema } from "../schemas/chat-stream.js";

/**
 * Parses a Vercel AI-SDK UI message SSE stream (newline-separated `data: {json}`
 * frames terminated by `data: [DONE]`) into the assistant's reply text.
 * Explicit failures and unresolved approvals are errors, even when the stream
 * contains progress text, so callers cannot mistake them for completed work.
 *
 * Tolerant by design: unknown frame types and unparseable lines are skipped.
 * If no text can be extracted from a non-empty stream, the raw stream is
 * returned as `text` so a protocol change degrades to the previous behavior,
 * never to an empty reply.
 */
export function parseChatStream(stream: string, fallbackChatId: string | null = null): ChatStreamResponse {
  let text = "";
  let chatId: string | null = null;
  const toolNames = new Map<string, string>();
  const pendingApprovals = new Set<string>();
  let streamError: string | undefined;

  for (const line of stream.split(/\r?\n/)) {
    if (!line.startsWith("data: ")) {
      continue;
    }

    const payload = line.slice("data: ".length).trim();
    if (payload === "[DONE]") {
      continue;
    }

    let data: unknown;
    try {
      data = JSON.parse(payload);
    } catch {
      continue;
    }

    const parsed = chatStreamFrameSchema.safeParse(data);
    if (!parsed.success) continue;
    const frame = parsed.data;
    const fragment = frame.delta ?? frame.textDelta;
    if (frame.type === "text-delta" && fragment !== undefined) {
      text += fragment;
    }

    chatId ??= frame.messageMetadata?.chatId ?? null;
    if (frame.toolCallId && frame.toolName) {
      toolNames.set(frame.toolCallId, frame.toolName);
    }
    if (frame.type === "tool-approval-request") {
      pendingApprovals.add(frame.toolCallId ?? "unknown tool");
    }
    if (
      frame.toolCallId &&
      ["tool-output-available", "tool-output-error", "tool-output-denied"].includes(frame.type ?? "")
    ) {
      pendingApprovals.delete(frame.toolCallId);
    }
    if (frame.type === "error" || frame.type === "abort") {
      streamError = frame.errorText || (frame.type === "abort" ? "Generation stopped" : "Chat stream failed");
    }
    if (frame.type === "tool-output-error" || frame.type === "tool-output-denied") {
      const name = frame.toolName ?? toolNames.get(frame.toolCallId ?? "") ?? frame.toolCallId ?? "unknown tool";
      streamError = `${name}: ${frame.errorText || (frame.type === "tool-output-denied" ? "Tool execution denied" : "Tool execution failed")}`;
    }
  }

  chatId ??= fallbackChatId;
  const chatContext = chatId ? ` (chat ${chatId})` : "";
  if (streamError) {
    throw new Error(`Notra chat failed${chatContext}: ${streamError}`);
  }
  if (pendingApprovals.size > 0) {
    const names = [...pendingApprovals].map((id) => toolNames.get(id) ?? id).join(", ");
    throw new Error(
      `Notra chat requires approval${chatContext}: ${names}. These tool calls have not executed. ` +
        "The chat API cannot submit approval responses. Use the direct MCP write tool for the requested action, " +
        "and verify the saved record before reporting completion. Sending another chat message does not approve the pending call.",
    );
  }
  return { text: text || stream, chatId };
}
