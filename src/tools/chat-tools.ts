import {
  listChatsSchema,
  getChatSchema,
  getChatByExternalChannelSchema,
  sendChatMessageSchema,
  postChatMessageSchema,
  chatStreamOutputSchema,
} from "../schemas/chat.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerChatTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_chats",
    {
      description: "List chat sessions for your organization",
      annotations: { title: "List Chats", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listChatsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listChats")),
    },
    () => handleError(() => client.listChats()),
  );

  server.registerTool(
    "get_chat",
    {
      description: "Get a single chat session with its messages",
      annotations: { title: "Get Chat", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getChatSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getChat")),
    },
    ({ chatId }) => handleError(() => client.getChat(chatId)),
  );

  server.registerTool(
    "get_chat_by_external_channel",
    {
      description: "Get a chat session by Discord or Slack external channel ID",
      annotations: {
        title: "Get Chat by External Channel",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(getChatByExternalChannelSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getChatByExternalChannel")),
    },
    ({ source, id }) => handleError(() => client.getChatByExternalChannel(source, id)),
  );

  server.registerTool(
    "create_chat",
    {
      description:
        "Start a new Notra agent chat and return the assistant's reply text with the chat ID when available. Uses AI credits. The agent can research the web, create or update posts, create writing skills, add brand references, and invoke connected MCP tools that may modify or delete data or act on external services.",
      annotations: { title: "Create Chat", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(sendChatMessageSchema),
      outputSchema: shareJsonSchema(chatStreamOutputSchema),
    },
    (params) => handleError(() => client.createChat(params)),
  );

  server.registerTool(
    "post_chat_message",
    {
      description:
        "Send a message to an existing Notra agent chat and return the assistant's reply text. Uses AI credits. The agent can research the web, create or update posts, create writing skills, add brand references, and invoke connected MCP tools that may modify or delete data or act on external services.",
      annotations: { title: "Post Chat Message", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(postChatMessageSchema),
      outputSchema: shareJsonSchema(chatStreamOutputSchema),
    },
    ({ chatId, ...body }) => handleError(() => client.postChatMessage(chatId, body)),
  );
}
