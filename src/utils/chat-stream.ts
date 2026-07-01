export interface ParsedChatStream {
  /** Concatenated assistant text fragments. */
  text: string;
  /** Chat ID from frame metadata, if present. */
  chatId: string | null;
  /** The original stream, untouched. */
  raw: string;
}

interface ChatStreamFrame {
  type?: unknown;
  delta?: unknown;
  textDelta?: unknown;
  messageMetadata?: { chatId?: unknown };
}

/**
 * Parses a Vercel AI-SDK UI message SSE stream (newline-separated `data: {json}`
 * frames terminated by `data: [DONE]`) into the assistant's reply text.
 *
 * Tolerant by design: unknown frame types and unparseable lines are skipped.
 * If no text can be extracted from a non-empty stream, the raw stream is
 * returned as `text` so a protocol change degrades to the previous behavior,
 * never to an empty reply.
 */
export function parseChatStream(stream: string): ParsedChatStream {
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

    let frame: ChatStreamFrame;
    try {
      const parsed: unknown = JSON.parse(payload);
      if (typeof parsed !== "object" || parsed === null) {
        continue;
      }
      frame = parsed as ChatStreamFrame;
    } catch {
      continue;
    }

    const fragment = frame.delta ?? frame.textDelta;
    if (frame.type === "text-delta" && typeof fragment === "string") {
      text += fragment;
    }

    if (chatId === null) {
      const metadataChatId = frame.messageMetadata?.chatId;
      if (typeof metadataChatId === "string" && metadataChatId.length > 0) {
        chatId = metadataChatId;
      }
    }
  }

  if (text.length === 0 && stream.length > 0) {
    return { text: stream, chatId, raw: stream };
  }

  return { text, chatId, raw: stream };
}
