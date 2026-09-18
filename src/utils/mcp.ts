export async function handleError<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    const result = {
      content: [{ type: "text" as const, text: JSON.stringify(data) }],
    };

    if (typeof data === "object" && data !== null && !Array.isArray(data)) {
      return { ...result, structuredContent: data as Record<string, unknown> };
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      isError: true as const,
      content: [{ type: "text" as const, text: message }],
    };
  }
}
