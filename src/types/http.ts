import type { NodeStreamableHTTPServerTransport } from "@modelcontextprotocol/node";
import type { AuthContext } from "./auth.js";

export type Session = {
  transport: NodeStreamableHTTPServerTransport;
  tokenDigest: Buffer;
  auth: AuthContext;
  /** Who owns the session: an OAuth user in an organization, or an API key digest. */
  principal: string;
  lastSeen: number;
};

/** The subset of Express body-parser errors the MCP endpoint maps to JSON-RPC. */
export type BodyParserError = {
  status?: number;
  type?: string;
};
