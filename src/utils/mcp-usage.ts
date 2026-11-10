import { trackMcpTransport } from "@usenotra/geo/mcp";
import type { McpAnalyticsOptions, McpPeerInfo, McpTransportLike } from "@usenotra/geo/mcp";
import type { OAuthAuthInfo } from "mcp-use/oauth";
import type { AuthContext } from "../types/auth.js";
import type { NotraMcpServer } from "../types/server.js";

async function track<T>(
  options: McpAnalyticsOptions,
  request: { method: string; params: unknown; authInfo: OAuthAuthInfo | undefined },
  run: () => Promise<T>,
  toResult: (value: T) => unknown,
): Promise<T> {
  const sink: McpTransportLike = { onmessage: () => {}, send: async () => {} };
  const transport = trackMcpTransport(sink, options);
  transport.onmessage?.(
    { jsonrpc: "2.0", id: 0, method: request.method, params: request.params },
    { authInfo: request.authInfo },
  );
  try {
    const value = await run();
    await transport.send({ jsonrpc: "2.0", id: 0, result: toResult(value) });
    return value;
  } catch (error) {
    await transport.send({
      jsonrpc: "2.0",
      id: 0,
      error: { code: -32603, message: error instanceof Error ? error.message : "Internal error" },
    });
    throw error;
  }
}

export function instrumentMcpUsage(
  server: NotraMcpServer,
  serverInfo: McpPeerInfo,
  isKnownTool: (name: string) => boolean,
): void {
  const options: McpAnalyticsOptions = {
    token: process.env.NOTRA_GEO_TOKEN ?? "",
    identify: ({ authInfo }) => {
      const auth = authInfo?.extra?.auth as AuthContext | undefined;
      return auth?.kind === "oauth" ? auth.userId : undefined;
    },
    beforeSend: (event) => ({
      ...event,
      server: event.server ?? serverInfo,
      target:
        event.method === "tools/call" && event.target !== undefined && !isKnownTool(event.target)
          ? "unknown"
          : event.target,
    }),
    onError: () => console.warn("MCP usage delivery failed"),
  };

  server.use("mcp:tools/list", (ctx, next) =>
    track(options, { method: "tools/list", params: ctx.params, authInfo: ctx.auth }, next, (tools) => ({ tools })),
  );
  server.use("mcp:tools/call", (ctx, next) =>
    track(options, { method: "tools/call", params: ctx.params, authInfo: ctx.auth }, next, (result) => result),
  );
}
