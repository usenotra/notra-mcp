import "zod/compile";
import { McpServer } from "@modelcontextprotocol/server";
import { SERVER_INSTRUCTIONS } from "./constants/server.js";
import { NotraClient } from "./notra-client.js";
import { registerAgentTools } from "./tools/agent-tools.js";
import { registerBrandIdentityTools } from "./tools/brand-identity-tools.js";
import { registerChatTools } from "./tools/chat-tools.js";
import { registerEventTriggerTools } from "./tools/event-trigger-tools.js";
import { registerFeedbackInboxTools, registerFeedbackTools } from "./tools/feedback-tools.js";
import { registerGeoAgentReadinessTools } from "./tools/geo-agent-readiness-tools.js";
import { registerGeoBriefTools } from "./tools/geo-brief-tools.js";
import { registerGeoCompetitorTools } from "./tools/geo-competitor-tools.js";
import { registerGeoDiagnosticTools } from "./tools/geo-diagnostic-tools.js";
import { registerGeoPromptTools } from "./tools/geo-prompt-tools.js";
import { registerGeoScanTools } from "./tools/geo-scan-tools.js";
import { registerGeoSequenceTools } from "./tools/geo-sequence-tools.js";
import { registerGeoSettingsTools } from "./tools/geo-settings-tools.js";
import { registerGeoTrafficTools } from "./tools/geo-traffic-tools.js";
import { registerGeoVisibilityTools } from "./tools/geo-visibility-tools.js";
import { registerIntegrationTools } from "./tools/integration-tools.js";
import { registerPostTools } from "./tools/post-tools.js";
import { registerProjectTools } from "./tools/project-tools.js";
import { registerScheduleTools } from "./tools/schedule-tools.js";
import { registerSkillTools } from "./tools/skill-tools.js";
import { registerWorkspaceTools } from "./tools/workspace-tools.js";
import type { AuthContext } from "./types/auth.js";
import type { CreateServerOptions } from "./types/server.js";
import type { Toolset } from "./types/toolset.js";
import { parseToolsets } from "./utils/toolsets.js";

export const SERVER_VERSION = "1.1.0";

type Registrar = (server: McpServer, client: NotraClient) => void;

const CONTENT_REGISTRARS: readonly Registrar[] = [
  registerPostTools,
  registerBrandIdentityTools,
  registerIntegrationTools,
  registerScheduleTools,
  registerEventTriggerTools,
  registerChatTools,
  registerAgentTools,
  registerSkillTools,
  registerFeedbackInboxTools,
];

const GEO_REGISTRARS: readonly Registrar[] = [
  registerProjectTools,
  registerGeoSettingsTools,
  registerGeoPromptTools,
  registerGeoSequenceTools,
  registerGeoCompetitorTools,
  registerGeoDiagnosticTools,
  registerGeoScanTools,
  registerGeoVisibilityTools,
  registerGeoBriefTools,
  registerGeoAgentReadinessTools,
  registerGeoTrafficTools,
];

const SHARED_REGISTRARS: readonly Registrar[] = [
  registerWorkspaceTools,
  (server) =>
    registerFeedbackTools(server, {
      url: "https://api.usenotra.com/v1/feedback/notra",
      productName: "Notra",
      defaults: { agentClient: "notra-mcp", toolVersion: SERVER_VERSION },
    }),
];

/**
 * Maps every tool name to the registrar that registers it, learned once at
 * module load by running our own registrars against a recording stand-in
 * (registrars only ever call `server.registerTool`; their handlers capture
 * the client without calling it). HTTP builds a server per request, so the
 * modern path uses this to register only the module owning the called tool
 * instead of all ~100 — registration dominates per-request CPU otherwise.
 */
const TOOL_OWNERS: ReadonlyMap<string, { registrar: Registrar; toolset?: Toolset }> = (() => {
  const owners = new Map<string, { registrar: Registrar; toolset?: Toolset }>();
  const probeClient = new NotraClient("tool-owner-probe");
  const learn = (registrar: Registrar, toolset?: Toolset) => {
    const probe = {
      registerTool: (name: string) => {
        owners.set(name, { registrar, toolset });
      },
    } as unknown as McpServer;
    registrar(probe, probeClient);
  };
  for (const registrar of CONTENT_REGISTRARS) learn(registrar, "content");
  for (const registrar of GEO_REGISTRARS) learn(registrar, "geo");
  for (const registrar of SHARED_REGISTRARS) learn(registrar);
  return owners;
})();

export function createServer(auth: string | AuthContext, options: CreateServerOptions = {}): McpServer {
  const client = new NotraClient(auth);
  const toolsets = options.toolsets ?? parseToolsets(process.env.NOTRA_MCP_TOOLSETS);

  const server = new McpServer(
    {
      name: "notra",
      version: SERVER_VERSION,
    },
    { instructions: SERVER_INSTRUCTIONS },
  );

  // A tools/call needs only the module owning that tool. Unknown or
  // toolset-filtered names fall through to full registration so the SDK
  // answers with its standard "tool not found" error.
  const owner = options.onlyTool ? TOOL_OWNERS.get(options.onlyTool) : undefined;
  if (owner && (owner.toolset === undefined || toolsets.has(owner.toolset))) {
    owner.registrar(server, client);
    return server;
  }

  if (toolsets.has("content")) {
    for (const registrar of CONTENT_REGISTRARS) registrar(server, client);
  }
  if (toolsets.has("geo")) {
    for (const registrar of GEO_REGISTRARS) registrar(server, client);
  }
  for (const registrar of SHARED_REGISTRARS) registrar(server, client);

  return server;
}
