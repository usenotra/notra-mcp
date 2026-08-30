import { McpServer } from "@modelcontextprotocol/server";
import { FEEDBACK_AGENT_CLIENT, FEEDBACK_PRODUCT_NAME, FEEDBACK_URL } from "./constants/feedback.js";
import { SERVER_INSTRUCTIONS } from "./constants/server.js";
import { NotraClient } from "./notra-client.js";
import { registerBrandIdentityTools } from "./tools/brand-identity-tools.js";
import { registerChatTools } from "./tools/chat-tools.js";
import { registerFeedbackTools } from "./tools/feedback-tools.js";
import { registerGeoAgentReadinessTools } from "./tools/geo-agent-readiness-tools.js";
import { registerGeoBriefTools } from "./tools/geo-brief-tools.js";
import { registerGeoCompetitorTools } from "./tools/geo-competitor-tools.js";
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
import type { AuthContext } from "./types/auth.js";

const SERVER_VERSION = "1.1.0";

export function createServer(auth: string | AuthContext): McpServer {
  const client = new NotraClient(auth);

  const server = new McpServer(
    {
      name: "notra",
      version: SERVER_VERSION,
    },
    { instructions: SERVER_INSTRUCTIONS },
  );

  registerPostTools(server, client);
  registerBrandIdentityTools(server, client);
  registerIntegrationTools(server, client);
  registerScheduleTools(server, client);
  registerChatTools(server, client);
  registerSkillTools(server, client);
  registerProjectTools(server, client);
  registerGeoSettingsTools(server, client);
  registerGeoPromptTools(server, client);
  registerGeoSequenceTools(server, client);
  registerGeoCompetitorTools(server, client);
  registerGeoScanTools(server, client);
  registerGeoVisibilityTools(server, client);
  registerGeoBriefTools(server, client);
  registerGeoAgentReadinessTools(server, client);
  registerGeoTrafficTools(server, client);
  registerFeedbackTools(server, {
    url: FEEDBACK_URL,
    productName: FEEDBACK_PRODUCT_NAME,
    defaults: { agentClient: FEEDBACK_AGENT_CLIENT, toolVersion: SERVER_VERSION },
  });

  return server;
}
