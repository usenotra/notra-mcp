export function textResult<T>(data: T) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
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
