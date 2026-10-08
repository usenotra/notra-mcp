export function formatMcpError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  // Only expand Node fetch failures, not arbitrary application-error causes.
  if (!(error instanceof TypeError) || message !== "fetch failed" || !(error.cause instanceof Error)) {
    return message;
  }

  const cause = error.cause;
  const code =
    "code" in cause && typeof cause.code === "string" && /^[A-Z][A-Z0-9_]*$/.test(cause.code) ? cause.code : undefined;
  const detail = [code, cause.message]
    .filter(Boolean)
    .join(": ")
    .replace(/\u001b(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, "");
  return detail ? `${message}: ${detail}` : message;
}
