import type { CallToolResult } from "mcp-use";
import { formatMcpError } from "./mcp-error.js";

type HandledResult = (CallToolResult & { structuredContent: any }) | (CallToolResult & { isError: true });

export async function handleError<T>(fn: () => Promise<T>): Promise<HandledResult> {
  try {
    const data = await fn();
    const result = {
      content: [{ type: "text" as const, text: JSON.stringify(data) }],
    };

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      return { ...result, structuredContent: data as Record<string, unknown> };
    }

    return { ...result, structuredContent: undefined };
  } catch (error) {
    const message = formatMcpError(error);
    return {
      isError: true as const,
      content: [{ type: "text" as const, text: message }],
    };
  }
}
