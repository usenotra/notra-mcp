import {
  listChatsSchema,
  getChatSchema,
  getChatByExternalChannelSchema,
  sendChatMessageSchema,
  postChatMessageSchema,
} from "../schemas/chat.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";

export function registerChatTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_chats",
    {
      description: "List chat sessions for your organization",
      annotations: { title: "List Chats", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: listChatsSchema,
    },
    () => handleError(() => client.listChats()),
  );

  server.registerTool(
    "get_chat",
    {
      description: "Get a single chat session with its messages",
      annotations: { title: "Get Chat", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: getChatSchema,
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
      inputSchema: getChatByExternalChannelSchema,
    },
    ({ source, id }) => handleError(() => client.getChatByExternalChannel(source, id)),
  );

  server.registerTool(
    "create_chat",
    {
      description:
        "Start a new Notra agent chat and return the assistant's reply text with the chat ID when available. Uses AI credits. The agent can research the web, create or update posts, create writing skills, add brand references, and invoke connected MCP tools that may modify or delete data or act on external services.",
      annotations: { title: "Create Chat", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: sendChatMessageSchema,
    },
    (params) => handleError(() => client.createChat(params)),
  );

  server.registerTool(
    "post_chat_message",
    {
      description:
        "Send a message to an existing Notra agent chat and return the assistant's reply text. Uses AI credits. The agent can research the web, create or update posts, create writing skills, add brand references, and invoke connected MCP tools that may modify or delete data or act on external services.",
      annotations: { title: "Post Chat Message", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: postChatMessageSchema,
    },
    ({ chatId, ...body }) => handleError(() => client.postChatMessage(chatId, body)),
  );
}
