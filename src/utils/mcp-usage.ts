import type { McpServer } from "@modelcontextprotocol/server";
import {
  AXIOM_DEFAULT_HOST,
  MCP_CLIENT_PATTERNS,
  POSTHOG_DEFAULT_HOST,
  USAGE_DELIVERY_TIMEOUT_MS,
  USAGE_MAX_PENDING_DELIVERIES,
} from "../constants/usage.js";
import type { AuthContext } from "../types/auth.js";
import type { McpUsageEvent, ToolCallHandler } from "../types/usage.js";
import { getRequestSignal } from "./request-signal.js";

const pendingDeliveries = new Set<Promise<void>>();

function deliver(sink: string, host: string, path: string, headers: Record<string, string>, body: unknown): void {
  if (pendingDeliveries.size >= USAGE_MAX_PENDING_DELIVERIES) {
    console.warn(`MCP usage ${sink} delivery dropped: pending delivery limit reached`);
    return;
  }
  const delivery = (async () => {
    try {
      const url = new URL(host);
      if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
        throw new Error("Invalid usage destination");
      }
      url.pathname = `${url.pathname.replace(/\/$/, "")}${path}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(USAGE_DELIVERY_TIMEOUT_MS),
        redirect: "error",
      });
      if (!response.ok) {
        await response.body?.cancel();
        console.warn(`MCP usage ${sink} delivery failed: HTTP ${response.status}`);
        return;
      }
      if (sink === "Axiom") {
        const acknowledgement = await response.json();
        if (acknowledgement.failed > 0) {
          console.warn("MCP usage Axiom delivery rejected event");
        }
      } else {
        await response.body?.cancel();
      }
    } catch {
      console.warn(`MCP usage ${sink} delivery failed`);
    }
  })();
  pendingDeliveries.add(delivery);
  void delivery.finally(() => pendingDeliveries.delete(delivery));
}

export async function flushMcpUsage(): Promise<void> {
  await Promise.all(pendingDeliveries);
}

function emitUsage(event: McpUsageEvent): void {
  try {
    console.log(JSON.stringify(event));
    const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (posthogToken) {
      deliver(
        "PostHog",
        process.env.NEXT_PUBLIC_POSTHOG_HOST || POSTHOG_DEFAULT_HOST,
        "/i/v0/e/",
        {},
        {
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
        },
      );
    }
    const axiomToken = process.env.AXIOM_TOKEN;
    const axiomDataset = process.env.AXIOM_MCP_DATASET;
    if (axiomToken && axiomDataset) {
      deliver(
        "Axiom",
        process.env.AXIOM_URL || AXIOM_DEFAULT_HOST,
        `/v1/datasets/${encodeURIComponent(axiomDataset)}/ingest`,
        {
          Authorization: `Bearer ${axiomToken}`,
          ...(process.env.AXIOM_ORG_ID && { "X-Axiom-Org-Id": process.env.AXIOM_ORG_ID }),
        },
        [{ _time: event.timestamp, ...event }],
      );
    }
  } catch {
    console.warn("MCP usage event could not be recorded");
  }
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
