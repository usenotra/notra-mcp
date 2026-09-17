import type { McpServer } from "@modelcontextprotocol/server";
import type { NotraClient } from "../notra-client.js";
import { listAgentChatsSchema } from "../schemas/agent.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerAgentTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_agent_chats",
    {
      description:
        "List durable agent sessions started from the Notra dashboard or the agent API, with their status and linked chat ID",
      annotations: { title: "List Agent Sessions", readOnlyHint: true },
      inputSchema: listAgentChatsSchema,
      outputSchema: apiOutputSchema("listAgentChats"),
    },
    async (params) => {
      return handleError(() => client.listAgentChats(params));
    },
  );
}
