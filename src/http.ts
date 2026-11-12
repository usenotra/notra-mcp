import "zod/compile";
import "dotenv/config";
import type { Context, Next } from "hono";
import { bodyLimit } from "hono/body-limit";
import { MCP_BASE_PATH, MCP_JSON_BODY_LIMIT_BYTES } from "./constants/http.js";
import { OAUTH_AUTHORIZATION_SERVER_METADATA_PATH, OAUTH_PROTECTED_RESOURCE_METADATA_PATH } from "./constants/oauth.js";
import { OPENAI_APPS_CHALLENGE_PATH, OPENAI_APPS_CHALLENGE_TOKEN } from "./constants/openai-apps.js";
import { ORGANIZATION_SCOPE_PATTERN } from "./constants/organization.js";
import { AI_CATALOG_CONTENT_TYPE, SERVER_CARD_CONTENT_TYPE, SERVER_ICON_SVG_URL } from "./constants/server.js";
import { createServer, SERVER_VERSION } from "./server.js";
import { authenticateBearerToken, parseBearerToken } from "./utils/auth.js";
import { trackInitialize } from "./utils/mcp-usage.js";
import { getMcpResourceUrl, getOAuthConfig, getProtectedResourceMetadata } from "./utils/oauth-config.js";
import { fetchAuthorizationServerMetadata } from "./utils/oauth-provider.js";
import { oauthTokenMatchesScope } from "./utils/oauth-scope.js";
import { runInRequestScope } from "./utils/request-scope.js";
import { getAiCatalog, getServerCard } from "./utils/server-card.js";
import { parseToolsets } from "./utils/toolsets.js";

const oauthConfig = getOAuthConfig();
const authorizationServerMetadata = await fetchAuthorizationServerMetadata(oauthConfig);
const server = createServer({ trackUsage: true, authorizationServerMetadata });

function jsonRpcError(c: Context, status: 400 | 403 | 404 | 413 | 502, code: number, message: string) {
  return c.json({ jsonrpc: "2.0", error: { code, message }, id: null }, status);
}

/** Reads `?toolsets=content,geo` (or repeated keys), falling back to `NOTRA_MCP_TOOLSETS`. */
async function validateToolsets(c: Context, next: Next) {
  const query = c.req.queries("toolsets");
  try {
    parseToolsets(query === undefined ? process.env.NOTRA_MCP_TOOLSETS : query.join(","));
  } catch (error) {
    return jsonRpcError(c, 400, -32602, error instanceof Error ? error.message : "Invalid toolsets");
  }
  await next();
}

const limitBody = bodyLimit({
  maxSize: MCP_JSON_BODY_LIMIT_BYTES,
  onError: (c) =>
    jsonRpcError(c, 413, -32600, `Request body exceeds the ${MCP_JSON_BODY_LIMIT_BYTES / (1024 * 1024)} MB limit`),
});

const publicOrigin = new URL(getMcpResourceUrl(oauthConfig)).origin;

function discoveryDocument(c: Context, body: unknown, contentType: string) {
  return c.body(JSON.stringify(body), 200, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
    "Cache-Control": "public, max-age=3600",
  });
}

for (const path of [
  `${MCP_BASE_PATH}/server-card`,
  "/.well-known/mcp/server-card.json",
  "/.well-known/mcp-server-card",
]) {
  server.get(path, (c) => discoveryDocument(c, getServerCard(publicOrigin, SERVER_VERSION), SERVER_CARD_CONTENT_TYPE));
}

server.get("/.well-known/ai-catalog.json", (c) =>
  discoveryDocument(c, getAiCatalog(publicOrigin), AI_CATALOG_CONTENT_TYPE),
);

for (const path of [MCP_BASE_PATH, `${MCP_BASE_PATH}/*`] as const) {
  server.use(path, limitBody, validateToolsets);
}
server.use(MCP_BASE_PATH, trackInitialize({ name: "notra", version: SERVER_VERSION }));

// Account API keys pick their workspace from the scoped URL. OAuth tokens are
// bound to their consent workspace, so a scoped URL naming another workspace
// is refused rather than silently acting on the token's workspace.
server.all(`${MCP_BASE_PATH}/:organization`, async (c) => {
  const scope = c.req.param("organization");
  if (!ORGANIZATION_SCOPE_PATTERN.test(scope)) {
    return jsonRpcError(c, 404, -32000, "Unknown workspace in the connection URL");
  }

  const token = parseBearerToken(c.req.header("authorization"));
  const auth = token ? await authenticateBearerToken(token, oauthConfig).catch(() => undefined) : undefined;
  if (auth?.kind === "oauth") {
    let matches: boolean;
    try {
      matches = await oauthTokenMatchesScope(auth, scope);
    } catch (error) {
      console.error("Error resolving the connection URL workspace:", error);
      return jsonRpcError(c, 502, -32000, "Could not verify the workspace in the connection URL, try again later");
    }
    if (!matches) {
      return jsonRpcError(
        c,
        403,
        -32000,
        `This connection URL is scoped to workspace "${scope}", but the OAuth authorization is for a different workspace. Reconnect and choose "${scope}" when authorizing, or use ${getMcpResourceUrl(oauthConfig)}.`,
      );
    }
  }

  const url = new URL(c.req.url);
  url.pathname = MCP_BASE_PATH;
  const headers = new Headers(c.req.raw.headers);
  if (token && !auth) headers.delete("authorization");
  const request = new Request(url, {
    method: c.req.method,
    headers,
    body: c.req.raw.body,
    signal: c.req.raw.signal,
    duplex: "half",
  } as RequestInit);
  return runInRequestScope({ organizationScope: scope }, () => server.fetch(request));
});

server.get(OAUTH_PROTECTED_RESOURCE_METADATA_PATH, (c) => c.json(getProtectedResourceMetadata(oauthConfig)));

// Workspace-scoped URLs announce the same registered resource as /mcp: AuthKit
// rejects unregistered resource indicators (`invalid_target`), and MCP clients
// accept a resource whose path is a prefix of the server URL. The workspace is
// still enforced through the token's consent claim.
server.get(`${OAUTH_PROTECTED_RESOURCE_METADATA_PATH}${MCP_BASE_PATH}/:organization`, (c) => {
  if (!ORGANIZATION_SCOPE_PATTERN.test(c.req.param("organization"))) {
    return jsonRpcError(c, 404, -32000, "Unknown workspace in the connection URL");
  }
  return c.json(getProtectedResourceMetadata(oauthConfig, getMcpResourceUrl(oauthConfig)));
});

server.get(`${OAUTH_AUTHORIZATION_SERVER_METADATA_PATH}${MCP_BASE_PATH}`, (c) => c.json(authorizationServerMetadata));

server.get(OPENAI_APPS_CHALLENGE_PATH, (c) => c.text(OPENAI_APPS_CHALLENGE_TOKEN));

server.get("/favicon.svg", (c) => c.redirect(SERVER_ICON_SVG_URL, 301));

server.get("/health", (c) => c.json({ status: "ok", commit: process.env.UNKEY_GIT_COMMIT_SHA ?? null }));

const { port } = await server.listen(undefined, { host: "0.0.0.0" });
console.log(`Notra MCP HTTP server listening on port ${port}`);
