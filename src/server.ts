import "zod/compile";
import type { HonoRequest } from "hono";
import { MCPServer, registerViews } from "mcp-use";
import type { OAuthAuthInfo } from "mcp-use/oauth";
import { MCP_BASE_PATH } from "./constants/http.js";
import {
  SERVER_DESCRIPTION,
  SERVER_FAVICON_URL,
  SERVER_ICONS,
  SERVER_INSTRUCTIONS,
  SERVER_TITLE,
  SERVER_WEBSITE_URL,
} from "./constants/server.js";
import { NotraClient } from "./notra-client.js";
import { registerBrandIdentityTools } from "./tools/brand-identity-tools.js";
import { registerEventTriggerTools } from "./tools/event-trigger-tools.js";
import { registerFeedbackInboxTools, registerFeedbackTools } from "./tools/feedback-tools.js";
import { registerGeoAgentReadinessTools } from "./tools/geo-agent-readiness-tools.js";
import { registerGeoBriefTools } from "./tools/geo-brief-tools.js";
import { registerGeoCompetitorTools } from "./tools/geo-competitor-tools.js";
import { registerGeoDiagnosticTools } from "./tools/geo-diagnostic-tools.js";
import { registerGeoPersonaTools } from "./tools/geo-persona-tools.js";
import { registerGeoPromptTools } from "./tools/geo-prompt-tools.js";
import { registerGeoScanTools } from "./tools/geo-scan-tools.js";
import { registerGeoSequenceTools } from "./tools/geo-sequence-tools.js";
import { registerGeoSettingsTools } from "./tools/geo-settings-tools.js";
import { registerGeoTrafficTools } from "./tools/geo-traffic-tools.js";
import { registerGeoVisibilityTools } from "./tools/geo-visibility-tools.js";
import { registerGeoWebAnalyticsTools } from "./tools/geo-web-analytics-tools.js";
import { registerIntegrationTools } from "./tools/integration-tools.js";
import { registerPostTools } from "./tools/post-tools.js";
import { registerPostScheduleTools } from "./tools/post-schedule-tools.js";
import { registerProjectTools } from "./tools/project-tools.js";
import { registerScheduleTools } from "./tools/schedule-tools.js";
import { registerSiteTools } from "./tools/site-tools.js";
import { registerSkillTools } from "./tools/skill-tools.js";
import { registerWebhookTools } from "./tools/webhook-tools.js";
import { registerListWorkspacesTool, registerWhoAmITool } from "./tools/workspace-tools.js";
import type { AuthContext } from "./types/auth.js";
import type { CreateServerOptions, NotraMcpServer, ToolRegistry } from "./types/server.js";
import type { Toolset } from "./types/toolset.js";
import { parseToolsets } from "./utils/toolsets.js";
import { instrumentMcpUsage } from "./utils/mcp-usage.js";
import { getOAuthConfig } from "./utils/oauth-config.js";
import { createOAuthProvider } from "./utils/oauth-provider.js";
import { selectRequestOrganization } from "./utils/organization.js";
import { getOrganizationScope, getRequestAuth, runInRequestScope } from "./utils/request-scope.js";
import { loadViewsManifest } from "./utils/views.js";

export const SERVER_VERSION = "1.5.0";

process.env.MCP_USE_ANONYMIZED_TELEMETRY ??= "false";

type Registrar = (server: ToolRegistry, client: NotraClient) => void;

const CONTENT_REGISTRARS: readonly Registrar[] = [
  registerPostTools,
  registerPostScheduleTools,
  registerSiteTools,
  registerBrandIdentityTools,
  registerIntegrationTools,
  registerScheduleTools,
  registerEventTriggerTools,
  registerWebhookTools,
  registerSkillTools,
  registerFeedbackInboxTools,
];

const GEO_REGISTRARS: readonly Registrar[] = [
  registerProjectTools,
  registerGeoSettingsTools,
  registerGeoPromptTools,
  registerGeoSequenceTools,
  registerGeoPersonaTools,
  registerGeoCompetitorTools,
  registerGeoDiagnosticTools,
  registerGeoScanTools,
  registerGeoVisibilityTools,
  registerGeoBriefTools,
  registerGeoAgentReadinessTools,
  registerGeoTrafficTools,
  registerGeoWebAnalyticsTools,
];

const SHARED_REGISTRARS: readonly Registrar[] = [
  registerWhoAmITool,
  registerListWorkspacesTool,
  (server) =>
    registerFeedbackTools(server, {
      url: "https://api.usenotra.com/v1/feedback/notra",
      productName: "Notra",
      description:
        "Send feedback to the Notra team. Only call this when the user explicitly asks to send feedback, and only include content the user wants shared. Do not call it proactively after errors or unsupported requests.",
      defaults: { agentClient: "notra-mcp", toolVersion: SERVER_VERSION },
    }),
];

function requestToolsets(request: HonoRequest | undefined): ReadonlySet<Toolset> {
  const query = request?.queries("toolsets");
  return parseToolsets(query === undefined ? process.env.NOTRA_MCP_TOOLSETS : query.join(","));
}

function requestAuth(authInfo: OAuthAuthInfo | undefined, headers: Headers | undefined): AuthContext {
  const auth = authInfo?.extra?.auth as AuthContext | undefined;
  if (!auth) {
    throw new Error("Authenticated MCP request is missing auth context");
  }
  // Account API keys pick their workspace per request, from the scoped URL or
  // else the header. OAuth tokens are bound to their consent workspace.
  if (auth.kind === "apiKey") {
    const organizationId = selectRequestOrganization(getOrganizationScope(), headers ?? new Headers());
    return organizationId ? { ...auth, organizationId } : auth;
  }
  return auth;
}

export function createServer(options: CreateServerOptions = {}): NotraMcpServer {
  const server = new MCPServer<AuthContext>({
    name: "notra",
    title: SERVER_TITLE,
    description: SERVER_DESCRIPTION,
    version: SERVER_VERSION,
    websiteUrl: SERVER_WEBSITE_URL,
    icons: SERVER_ICONS,
    favicon: SERVER_FAVICON_URL,
    instructions: SERVER_INSTRUCTIONS,
    basePath: MCP_BASE_PATH,
    oauth: createOAuthProvider(getOAuthConfig(), options.authorizationServerMetadata),
    publicLandingPage: true,
    logging: { enabled: false },
  });

  const client = new NotraClient(getRequestAuth);
  const toolOwners = new Map<string, Toolset | undefined>();
  const register = (registrars: readonly Registrar[], toolset?: Toolset) => {
    const registry: ToolRegistry = {
      tool: (definition, callback) => {
        toolOwners.set(definition.name, toolset);
        return server.tool(definition, callback);
      },
    };
    for (const registrar of registrars) registrar(registry, client);
  };

  register(CONTENT_REGISTRARS, "content");
  register(GEO_REGISTRARS, "geo");
  register(SHARED_REGISTRARS);

  const views = options.withoutViews ? undefined : loadViewsManifest();
  if (views) server[registerViews](views);

  // The connection URL is scoped to one workspace (`/mcp/{organization}`), so
  // workspace discovery is hidden like Sentry's org-scoped MCP URLs.
  const isVisible = (name: string, enabled: ReadonlySet<Toolset>) => {
    if (!toolOwners.has(name)) return true;
    if (name === "list_workspaces" && getOrganizationScope() !== undefined) return false;
    const toolset = toolOwners.get(name);
    return toolset === undefined || enabled.has(toolset);
  };

  if (options.trackUsage) {
    instrumentMcpUsage(server, { name: "notra", version: SERVER_VERSION }, (name) => toolOwners.has(name));
  }

  server.use("mcp:tools/list", async (ctx, next) => {
    const enabled = requestToolsets(ctx.req);
    return (await next()).filter((tool) => isVisible(tool.name, enabled));
  });

  server.use("mcp:tools/call", async (ctx, next) => {
    if (!isVisible(ctx.params.name, requestToolsets(ctx.req))) {
      return { isError: true, content: [{ type: "text", text: `Tool ${ctx.params.name} not found` }] };
    }
    return runInRequestScope({ auth: requestAuth(ctx.auth, ctx.req?.raw.headers), signal: ctx.req?.raw.signal }, next);
  });

  return server;
}
