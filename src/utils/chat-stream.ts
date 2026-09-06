import type { ChatStreamResponse } from "../types/api.js";
import { chatStreamFrameSchema } from "../schemas/chat-stream.js";

/**
 * Parses a Vercel AI-SDK UI message SSE stream (newline-separated `data: {json}`
 * frames terminated by `data: [DONE]`) into the assistant's reply text.
 *
 * Tolerant by design: unknown frame types and unparseable lines are skipped.
 * If no text can be extracted from a non-empty stream, the raw stream is
 * returned as `text` so a protocol change degrades to the previous behavior,
 * never to an empty reply.
 */
export function parseChatStream(stream: string): ChatStreamResponse {
  let text = "";
  let chatId: string | null = null;

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
  }

  return { text: text || stream, chatId };
}
