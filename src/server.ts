import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FEEDBACK_AGENT_CLIENT, FEEDBACK_PRODUCT_NAME, FEEDBACK_URL } from "./constants/feedback.js";
import { SERVER_INSTRUCTIONS } from "./constants/server.js";
import { NotraClient } from "./notra-client.js";
import { registerBrandIdentityTools } from "./tools/brand-identity-tools.js";
import { registerChatTools } from "./tools/chat-tools.js";
import { registerFeedbackTools } from "./tools/feedback-tools.js";
import { registerIntegrationTools } from "./tools/integration-tools.js";
import { registerPostTools } from "./tools/post-tools.js";
import { registerScheduleTools } from "./tools/schedule-tools.js";
import { registerSkillTools } from "./tools/skill-tools.js";
import type { AuthContext } from "./types/auth.js";

const SERVER_VERSION = "1.0.8";

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
  registerFeedbackTools(server, {
    url: FEEDBACK_URL,
    productName: FEEDBACK_PRODUCT_NAME,
    defaults: { agentClient: FEEDBACK_AGENT_CLIENT, toolVersion: SERVER_VERSION },
  });

  return server;
}
