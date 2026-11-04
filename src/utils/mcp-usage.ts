import type { McpServer } from "@modelcontextprotocol/server";
import { trackMcpTransport } from "@usenotra/geo/mcp";
import type { AuthContext } from "../types/auth.js";

export function instrumentMcpUsage(server: McpServer, auth: AuthContext, isKnownTool: (name: string) => boolean): void {
  const connect = server.connect.bind(server);
  server.connect = (transport) =>
    connect(
      trackMcpTransport(transport, {
        token: process.env.NOTRA_GEO_TOKEN ?? "",
        identify: () => (auth.kind === "oauth" ? auth.userId : undefined),
        beforeSend: (event) =>
          event.method === "tools/call" && event.target !== undefined && !isKnownTool(event.target)
            ? { ...event, target: "unknown" }
            : event,
        onError: () => console.warn("MCP usage delivery failed"),
      }),
    );
}
