import { GEO_CSV_IMPORT_MAX_LENGTH } from "./geo.js";

export const SESSION_TTL_MS = 30 * 60 * 1000;
export const SESSION_SWEEP_INTERVAL_MS = 60 * 1000;
export const DEFAULT_MAX_SESSIONS = 1000;
export const DEFAULT_MAX_SESSIONS_PER_PRINCIPAL = 50;
export const SESSION_RETRY_AFTER_SECONDS = 60;

// CSV imports allow 1,048,576 UTF-16 code units, which take up to 3 bytes each in
// UTF-8 (for example CJK text). Leave room for that plus the JSON-RPC envelope.
export const MCP_JSON_BODY_LIMIT_BYTES = GEO_CSV_IMPORT_MAX_LENGTH * 4;
