import type { MCPServer } from "mcp-use";
import type { OAuthMetadata } from "mcp-use/oauth";
import type { AuthContext } from "./auth.js";

export type NotraMcpServer = MCPServer<AuthContext>;

export type ToolRegistry = Pick<NotraMcpServer, "tool">;

export type CreateServerOptions = {
  trackUsage?: boolean;
  authorizationServerMetadata?: OAuthMetadata;
  withoutViews?: boolean;
};
