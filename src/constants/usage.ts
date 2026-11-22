// Matches Notra web analytics: a session ends after 30 minutes without a request.
export const USAGE_SESSION_IDLE_MS = 30 * 60 * 1000;

// Caps the in-memory session table so a burst of callers can't grow it without bound.
export const USAGE_SESSION_MAX_ENTRIES = 10_000;
