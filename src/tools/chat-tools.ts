import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";

const chatModelSchema = z.enum([
  "auto",
  "anthropic/claude-opus-4.8",
  "anthropic/claude-sonnet-4.6",
  "anthropic/claude-haiku-4.5",
  "openai/gpt-5.4",
  "openai/gpt-5.5",
]);

const chatContextSchema = z.array(
  z.union([
    z.object({
      type: z.literal("github-repo"),
      integrationId: z.string().describe("GitHub integration ID"),
      owner: z.string().describe("GitHub repository owner"),
      repo: z.string().describe("GitHub repository name"),
    }),
    z.object({
      type: z.literal("linear-team"),
      integrationId: z.string().describe("Linear integration ID"),
      teamName: z.string().optional().describe("Optional Linear team name"),
    }),
  ]),
);

const externalChannelIdSchema = z
  .object({
    source: z.enum(["discord", "slack", "dashboard"]).describe("External channel source"),
    id: z.string().max(200).optional().describe("External channel ID"),
  })
  .nullable();

const sendChatMessageSchema = {
  message: z.string().min(1).max(50000).describe("Message to send"),
  model: chatModelSchema.optional().describe("Model to use for the reply"),
  enableThinking: z.boolean().optional().describe("Whether to enable model thinking"),
  thinkingLevel: z.enum(["off", "low", "medium", "high"]).optional().describe("Thinking budget level"),
  timezone: z.string().min(1).max(100).optional().describe("IANA timezone for contextual responses"),
  context: chatContextSchema.optional().describe("Repository or Linear context to attach to the chat"),
  externalChannelId: externalChannelIdSchema.optional().describe("External channel to associate with the chat"),
} as const;

export function registerChatTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_chats",
    {
      description: "List chat sessions for your organization",
      inputSchema: {},
    },
    async () => {
      return handleError(() => client.listChats());
    },
  );

  server.registerTool(
    "get_chat",
    {
      description: "Get a single chat session with its messages",
      inputSchema: {
        chatId: z.string().min(1).describe("The chat ID to retrieve"),
      },
    },
    async ({ chatId }) => {
      return handleError(() => client.getChat(chatId));
    },
  );

  server.registerTool(
    "get_chat_by_external_channel",
    {
      description: "Get a chat session by Discord or Slack external channel ID",
      inputSchema: {
        source: z.enum(["discord", "slack"]).describe("External channel source"),
        id: z.string().min(1).max(200).describe("External channel ID"),
      },
    },
    async ({ source, id }) => {
      return handleError(() => client.getChatByExternalChannel(source, id));
    },
  );

  server.registerTool(
    "create_chat",
    {
      description: "Start a new chat and return the streamed response as text with the chat ID when available",
      inputSchema: sendChatMessageSchema,
    },
    async (params) => {
      return handleError(() => client.createChat(params));
    },
  );

  server.registerTool(
    "post_chat_message",
    {
      description: "Post a message to an existing chat and return the streamed response as text",
      inputSchema: {
        chatId: z.string().min(1).describe("The chat ID to send a message to"),
        ...sendChatMessageSchema,
      },
    },
    async ({ chatId, ...body }) => {
      return handleError(() => client.postChatMessage(chatId, body));
    },
  );
}
