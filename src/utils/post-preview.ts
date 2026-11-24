import { POST_PREVIEW_POLL_MS, POST_PREVIEW_STOPPED_STATUSES } from "../constants/site.js";
import type { SitePostPreview, SitePostPreviewResponse } from "../types/site.js";

/** The latest build is serving, or it stopped: nothing left to wait for. */
export function postPreviewSettled(preview: SitePostPreview | null): boolean {
  return !preview || preview.latestLive || preview.deleting || POST_PREVIEW_STOPPED_STATUSES.has(preview.status);
}

/**
 * Polls until the preview settles or `waitSeconds` pass, so agents without a
 * shell can wait for a build in one call.
 */
export async function waitForPostPreview(
  read: () => Promise<SitePostPreviewResponse>,
  waitSeconds: number,
  pollMs = POST_PREVIEW_POLL_MS,
): Promise<SitePostPreviewResponse> {
  const deadline = Date.now() + waitSeconds * 1000;
  for (;;) {
    const result = await read();
    const remaining = deadline - Date.now();
    if (postPreviewSettled(result.preview) || remaining <= 0) {
      return result;
    }
    // A short wait still gets its read at the deadline.
    await new Promise((resolve) => setTimeout(resolve, Math.min(pollMs, remaining)));
  }
}
