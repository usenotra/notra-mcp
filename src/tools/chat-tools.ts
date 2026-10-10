import {
  listChatsSchema,
  getChatSchema,
  getChatByExternalChannelSchema,
  sendChatMessageSchema,
  postChatMessageSchema,
  chatStreamOutputSchema,
  respondToChatApprovalsSchema,
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
        "Start a new Notra agent chat and return the assistant's reply text with the chat ID when available. Uses AI credits. The agent can research the web, create or update posts, create writing skills, add brand references, and invoke connected MCP tools that may modify or delete data or act on external services. Side-effecting actions, including writes through connected MCP tools, pause before they run and are returned in pendingApprovals with the exact tool and input; show them to the user and only continue with respond_to_chat_approvals once the user has decided.",
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
        "Send a message to an existing Notra agent chat and return the assistant's reply text. Uses AI credits. The agent can research the web, create or update posts, create writing skills, add brand references, and invoke connected MCP tools that may modify or delete data or act on external services. Side-effecting actions, including writes through connected MCP tools, pause before they run and are returned in pendingApprovals with the exact tool and input; show them to the user and only continue with respond_to_chat_approvals once the user has decided.",
      annotations: { title: "Post Chat Message", readOnlyHint: false, openWorldHint: true, destructiveHint: true },
      inputSchema: shareJsonSchema(postChatMessageSchema),
      outputSchema: shareJsonSchema(chatStreamOutputSchema),
    },
    ({ chatId, ...body }) => handleError(() => client.postChatMessage(chatId, body)),
  );

  server.registerTool(
    "respond_to_chat_approvals",
    {
      description:
        "Approve or deny the actions a Notra agent chat paused on (pendingApprovals from create_chat, post_chat_message or a previous call). Only call this after showing the user every pending action with its tool name and input and receiving the user's explicit decision in this conversation; never approve on the user's behalf. Include one decision per pending approval. Approved actions run, then the agent continues and may pause again. Uses AI credits.",
      annotations: {
        title: "Respond to Chat Approvals",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
      },
      inputSchema: shareJsonSchema(respondToChatApprovalsSchema),
      outputSchema: shareJsonSchema(chatStreamOutputSchema),
    },
    ({ chatId, approvals, ...options }) =>
      handleError(() =>
        client.respondToChatApprovals(chatId, {
          approvals: approvals.map(({ approvalId, approved, reason }) => ({ id: approvalId, approved, reason })),
          ...options,
        }),
      ),
  );
}
