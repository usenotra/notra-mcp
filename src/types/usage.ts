import type { CallToolRequest, HandlerResultTypeMap, ServerContext } from "@modelcontextprotocol/server";

export type ToolCallHandler = (
  request: CallToolRequest,
  context: ServerContext,
) => HandlerResultTypeMap["tools/call"] | Promise<HandlerResultTypeMap["tools/call"]>;

export type McpUsageEvent = {
  event: "mcp_tool_called";
  timestamp: string;
  transport: "http";
  server_version: string;
  protocol_version: string | undefined;
  tool_name: string;
  client_name: string;
  client_version: string | undefined;
  auth_kind: "oauth" | "apiKey";
  organization_id: string | undefined;
  user_id: string | undefined;
  outcome: "success" | "error" | "cancelled";
  duration_ms: number;
};
