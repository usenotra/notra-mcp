import { apiErrorSchema } from "../schemas/api.js";

/**
 * Builds the message an agent sees for a failed API call. Keeps the HTTP
 * status, the machine-readable `code`, the API's `recovery` hint and the
 * `Retry-After` delay, so an agent can tell "wait and retry" (409, 429) apart
 * from "needs a plan or credits" (402, 403) and "fix the input" (400).
 */
export function describeApiError(response: Response, data: unknown, describeMessage: (message: string) => string) {
  const body = apiErrorSchema.safeParse(data).data;
  const fallback = `HTTP ${response.status}: ${response.statusText}`;
  const message = body?.message ?? body?.error ?? fallback;
  const described = describeMessage(message);
  // Workspace-selection errors are already rewritten into full instructions.
  if (described !== message) {
    return described;
  }

  const parts = [message];
  if (message !== fallback) {
    parts[0] = `${message} (HTTP ${response.status}${body?.code ? `, ${body.code}` : ""})`;
  }
  if (body?.recovery) {
    parts.push(body.recovery);
  }
  const retryAfter = retryAfterSeconds(response.headers.get("retry-after"));
  if (retryAfter !== undefined) {
    parts.push(`Retry after ${retryAfter}s.`);
  }
  return parts.join(" ");
}

function retryAfterSeconds(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }
  const seconds = Number(value);
  if (Number.isFinite(seconds)) {
    return Math.max(0, Math.ceil(seconds));
  }
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, Math.ceil((date - Date.now()) / 1000));
}
