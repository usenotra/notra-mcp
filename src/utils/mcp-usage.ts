import type { McpServer } from "@modelcontextprotocol/server";
import {
  MCP_CLIENT_PATTERNS,
  POSTHOG_DEFAULT_HOST,
  USAGE_DELIVERY_TIMEOUT_MS,
  USAGE_MAX_PENDING_DELIVERIES,
} from "../constants/usage.js";
import type { AuthContext } from "../types/auth.js";
import type { McpUsageEvent, ToolCallHandler } from "../types/usage.js";
import { getRequestSignal } from "./request-signal.js";

const pendingDeliveries = new Set<Promise<void>>();

function emitUsage(event: McpUsageEvent): void {
  const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!posthogToken) {
    return;
  }
  if (pendingDeliveries.size >= USAGE_MAX_PENDING_DELIVERIES) {
    console.warn("MCP usage PostHog delivery dropped: pending delivery limit reached");
    return;
  }
  const delivery = (async () => {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_POSTHOG_HOST || POSTHOG_DEFAULT_HOST);
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
        throw new Error("Invalid usage destination");
      }
      url.pathname = `${url.pathname.replace(/\/$/, "")}/i/v0/e/`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: posthogToken,
          event: event.event,
          timestamp: event.timestamp,
          distinct_id: event.user_id ? `mcp:user:${event.user_id}` : "mcp:api-key",
          properties: {
            ...event,
            $process_person_profile: Boolean(event.user_id),
            $geoip_disable: true,
            ...(event.organization_id && { $groups: { organization: event.organization_id } }),
          },
        }),
        signal: AbortSignal.timeout(USAGE_DELIVERY_TIMEOUT_MS),
        redirect: "error",
      });
      await response.body?.cancel();
      if (!response.ok) {
        console.warn(`MCP usage PostHog delivery failed: HTTP ${response.status}`);
      }
    } catch {
      console.warn("MCP usage PostHog delivery failed");
    }
  })();
  pendingDeliveries.add(delivery);
  void delivery.finally(() => pendingDeliveries.delete(delivery));
}

export function instrumentMcpUsage(
  server: McpServer,
  auth: AuthContext,
  serverVersion: string,
  isKnownTool: (name: string) => boolean,
): void {
  const register = server.server.setRequestHandler.bind(server.server);
  server.server.setRequestHandler = ((method: string, ...args: unknown[]) => {
    if (method === "tools/call" && typeof args[0] === "function") {
      const handler = args[0] as ToolCallHandler;
      const tracked: ToolCallHandler = async (request, context) => {
        const startedAt = performance.now();
        let outcome: McpUsageEvent["outcome"] = "error";
        try {
          const result = await handler(request, context);
          outcome = result.isError === true ? "error" : "success";
          return result;
        } finally {
          const client = server.server.getClientVersion();
          emitUsage({
            event: "mcp_tool_called",
            timestamp: new Date().toISOString(),
            transport: "http",
            server_version: serverVersion,
            protocol_version: server.server.getNegotiatedProtocolVersion(),
            tool_name: isKnownTool(request.params.name) ? request.params.name : "unknown",
            client_name: client?.name
              ? (MCP_CLIENT_PATTERNS.find(({ pattern }) => pattern.test(client.name))?.name ?? "other")
              : "unknown",
            client_version:
              client?.version && /^\d{1,9}\.\d{1,9}\.\d{1,9}$/.test(client.version) ? client.version : undefined,
            auth_kind: auth.kind,
            organization_id: auth.kind === "oauth" ? auth.organizationId : undefined,
            user_id: auth.kind === "oauth" ? auth.userId : undefined,
            outcome: context.mcpReq.signal.aborted || getRequestSignal()?.aborted ? "cancelled" : outcome,
            duration_ms: Math.round(performance.now() - startedAt),
          });
        }
      };
      args[0] = tracked;
    }
    return Reflect.apply(register, server.server, [method, ...args]);
  }) as typeof server.server.setRequestHandler;
}
