import {
  listChatsSchema,
  getChatSchema,
  getChatByExternalChannelSchema,
  sendChatMessageSchema,
  postChatMessageSchema,
  chatStreamOutputSchema,
} from "../schemas/chat.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerChatTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_chats",
    {
      description: "List chat sessions for your organization",
      annotations: { title: "List Chats", readOnlyHint: true },
      inputSchema: listChatsSchema,
      outputSchema: apiOutputSchema("listChats"),
    },
    () => handleError(() => client.listChats()),
  );

  server.registerTool(
    "get_chat",
    {
      description: "Get a single chat session with its messages",
      annotations: { title: "Get Chat", readOnlyHint: true },
      inputSchema: getChatSchema,
      outputSchema: apiOutputSchema("getChat"),
    },
    ({ chatId }) => handleError(() => client.getChat(chatId)),
  );

  server.registerTool(
    "get_chat_by_external_channel",
    {
      description: "Get a chat session by Discord or Slack external channel ID",
      annotations: { title: "Get Chat by External Channel", readOnlyHint: true },
      inputSchema: getChatByExternalChannelSchema,
      outputSchema: apiOutputSchema("getChatByExternalChannel"),
    },
    ({ source, id }) => handleError(() => client.getChatByExternalChannel(source, id)),
  );

  server.registerTool(
    "create_chat",
    {
      description: "Start a new chat and return the assistant's reply text with the chat ID when available",
      annotations: { title: "Create Chat", destructiveHint: false },
      inputSchema: sendChatMessageSchema,
      outputSchema: chatStreamOutputSchema,
    },
    (params) => handleError(() => client.createChat(params)),
  );

  server.registerTool(
    "post_chat_message",
    {
      description: "Post a message to an existing chat and return the assistant's reply text",
      annotations: { title: "Post Chat Message", destructiveHint: false },
      inputSchema: postChatMessageSchema,
      outputSchema: chatStreamOutputSchema,
    },
    ({ chatId, ...body }) => handleError(() => client.postChatMessage(chatId, body)),
  );
}
