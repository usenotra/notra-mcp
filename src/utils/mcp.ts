export function textResult<T>(data: T) {
  const result = {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };

  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return { ...result, structuredContent: data as Record<string, unknown> };
  }

  return result;
}

export async function handleError<T>(fn: () => Promise<T>) {
  try {
    const data = await fn();
    return textResult(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      isError: true as const,
      content: [{ type: "text" as const, text: message }],
    };
  }
}
