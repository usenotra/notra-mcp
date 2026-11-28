import { GEO_CSV_IMPORT_MAX_LENGTH } from "./geo.js";

export const MCP_BASE_PATH = "/mcp";

// CSV imports allow 1,048,576 UTF-16 code units, which take up to 3 bytes each in
// UTF-8 (for example CJK text). Leave room for that plus the JSON-RPC envelope.
export const MCP_JSON_BODY_LIMIT_BYTES = GEO_CSV_IMPORT_MAX_LENGTH * 4;

/** Public URL of the hosted server; workspace-scoped connections append `/<workspace>`. */
export const MCP_HOSTED_URL = "https://mcp.usenotra.com/mcp";

export const MCP_STDIO_URL = MCP_HOSTED_URL;
