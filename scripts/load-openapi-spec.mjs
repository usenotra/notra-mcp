import { readFile } from "node:fs/promises";

const SPEC_FETCH_ATTEMPTS = 3;
const SPEC_FETCH_RETRY_DELAY_MS = 2_000;

export async function loadSpec() {
  if (process.env.NOTRA_OPENAPI_FILE) {
    return JSON.parse(await readFile(process.env.NOTRA_OPENAPI_FILE, "utf8"));
  }
  const base = process.env.NOTRA_API_BASE ?? "https://api.usenotra.com";
  const url = process.env.NOTRA_OPENAPI_URL ?? `${base}/openapi.json`;
  for (let attempt = 1; ; attempt++) {
    let response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    } catch (error) {
      if (attempt === SPEC_FETCH_ATTEMPTS) throw error;
      await waitBeforeRetry(attempt, error instanceof Error ? error.message : String(error));
      continue;
    }
    if (response.ok) {
      return response.json();
    }
    const message = `Failed to fetch ${url}: HTTP ${response.status}`;
    const retryable = response.status >= 500 || response.status === 429;
    if (!retryable || attempt === SPEC_FETCH_ATTEMPTS) throw new Error(message);
    await waitBeforeRetry(attempt, message);
  }
}

async function waitBeforeRetry(attempt, reason) {
  console.error(`${reason}; retrying (${attempt}/${SPEC_FETCH_ATTEMPTS - 1})`);
  await new Promise((resolve) => setTimeout(resolve, SPEC_FETCH_RETRY_DELAY_MS * attempt));
}
