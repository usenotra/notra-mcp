import { trackMcpTransport } from "@usenotra/geo/mcp";
import type { McpAnalyticsOptions, McpPeerInfo, McpTransportLike } from "@usenotra/geo/mcp";
import type { Context, HonoRequest, Next } from "hono";
import type { OAuthAuthInfo } from "mcp-use/oauth";
import type { AuthContext } from "../types/auth.js";
import type { NotraMcpServer } from "../types/server.js";

const CLIENT_INFO_META_KEY = "io.modelcontextprotocol/clientInfo";

type UsageRequest = {
  method: string;
  params: unknown;
  authInfo?: OAuthAuthInfo;
  headers?: Headers;
  client?: McpPeerInfo;
};

function readPeer(value: unknown): McpPeerInfo | undefined {
  if (!value || typeof value !== "object") return undefined;
  const { name, version } = value as Record<string, unknown>;
  if (typeof name !== "string" || name.length === 0) return undefined;
  return { name, version: typeof version === "string" ? version : "" };
}

function metaClient(params: unknown): McpPeerInfo | undefined {
  if (!params || typeof params !== "object") return undefined;
  const meta = (params as { _meta?: Record<string, unknown> })._meta;
  return readPeer(meta?.[CLIENT_INFO_META_KEY]);
}

async function bodyClient(request: HonoRequest | undefined): Promise<McpPeerInfo | undefined> {
  const body: unknown = await request?.json().catch(() => undefined);
  if (!body || typeof body !== "object" || Array.isArray(body)) return undefined;
  return metaClient((body as { params?: unknown }).params);
}

function usageOptions(serverInfo: McpPeerInfo, isKnownTool: (name: string) => boolean): McpAnalyticsOptions {
  return {
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
}

async function track<T>(
  options: McpAnalyticsOptions,
  request: UsageRequest,
  run: () => Promise<T>,
  toResult: (value: T) => unknown,
): Promise<T> {
  const client = request.client ?? metaClient(request.params);
  const protocolVersion = request.headers?.get("mcp-protocol-version") ?? undefined;
  const sink: McpTransportLike = { onmessage: () => {}, send: async () => {} };
  const transport = trackMcpTransport(sink, {
    ...options,
    beforeSend: (event) =>
      options.beforeSend?.({
        ...event,
        client: event.client ?? client,
        protocolVersion: event.protocolVersion ?? protocolVersion,
      }) ?? null,
  });
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
  const options = usageOptions(serverInfo, isKnownTool);
  server.use("mcp:tools/list", async (ctx, next) =>
    track(
      options,
      {
        method: "tools/list",
        params: ctx.params,
        authInfo: ctx.auth,
        headers: ctx.req?.raw.headers,
        client: await bodyClient(ctx.req),
      },
      next,
      (tools) => ({ tools }),
    ),
  );
  server.use("mcp:tools/call", async (ctx, next) =>
    track(
      options,
      {
        method: "tools/call",
        params: ctx.params,
        authInfo: ctx.auth,
        headers: ctx.req?.raw.headers,
        client: await bodyClient(ctx.req),
      },
      next,
      (result) => result,
    ),
  );
}

export function trackInitialize(serverInfo: McpPeerInfo) {
  const options = usageOptions(serverInfo, () => true);
  return async (c: Context, next: Next) => {
    if (c.req.method !== "POST") return next();
    const body: unknown = await c.req.raw
      .clone()
      .json()
      .catch(() => undefined);
    const message = body && typeof body === "object" ? (body as { method?: unknown; params?: unknown }) : undefined;
    if (message?.method !== "initialize") return next();
    const params = (message.params ?? {}) as { protocolVersion?: unknown };
    return track(
      options,
      { method: "initialize", params },
      async () => {
        await next();
        if (!c.res.ok) throw new Error(`HTTP ${c.res.status}`);
      },
      () => ({ protocolVersion: params.protocolVersion, serverInfo }),
    );
  };
}
