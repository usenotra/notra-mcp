import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NotraClient } from "./notra-client.js";
import { registerBrandIdentityTools } from "./tools/brand-identity-tools.js";
import { registerChatTools } from "./tools/chat-tools.js";
import { registerIntegrationTools } from "./tools/integration-tools.js";
import { registerPostTools } from "./tools/post-tools.js";
import { registerScheduleTools } from "./tools/schedule-tools.js";
import { registerSkillTools } from "./tools/skill-tools.js";
import type { AuthContext } from "./types/auth.js";

export function createServer(auth: string | AuthContext): McpServer {
  const client = new NotraClient(auth);

  const server = new McpServer({
    name: "notra",
    version: "1.0.5",
  });

  registerPostTools(server, client);
  registerBrandIdentityTools(server, client);
  registerIntegrationTools(server, client);
  registerScheduleTools(server, client);
  registerChatTools(server, client);
  registerSkillTools(server, client);

  return server;
}
