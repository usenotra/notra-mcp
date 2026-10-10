import * as z from "zod";

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

export const sendChatMessageSchema = z.object({
  message: z.string().min(1).max(50000).describe("Message to send"),
  model: chatModelSchema.optional().describe("Model to use for the reply"),
  enableThinking: z.boolean().optional().describe("Whether to enable model thinking"),
  thinkingLevel: z.enum(["off", "low", "medium", "high"]).optional().describe("Thinking budget level"),
  timezone: z.string().min(1).max(100).optional().describe("IANA timezone for contextual responses"),
  context: chatContextSchema.optional().describe("Repository or Linear context to attach to the chat"),
  externalChannelId: externalChannelIdSchema.optional().describe("External channel to associate with the chat"),
});

export const listChatsSchema = z.object({});

export const getChatSchema = z.object({
  chatId: z.string().min(1).describe("The chat ID to retrieve"),
});

export const getChatByExternalChannelSchema = z.object({
  source: z.enum(["discord", "slack"]).describe("External channel source"),
  id: z.string().min(1).max(200).describe("External channel ID"),
});

export const postChatMessageSchema = z.object({
  chatId: z.string().min(1).describe("The chat ID to send a message to"),
  ...sendChatMessageSchema.shape,
});

export const respondToChatApprovalsSchema = z.object({
  chatId: z.string().min(1).describe("The chat ID whose latest reply is waiting for approval"),
  approvals: z
    .array(
      z.object({
        approvalId: z.string().min(1).max(500).describe("approvalId from pendingApprovals"),
        approved: z.boolean().describe("The user's decision: true to run the action, false to deny it"),
        reason: z.string().max(2000).optional().describe("Optional note from the user, passed to the agent"),
      }),
    )
    .min(1)
    .max(50)
    .describe("One decision per pending approval in the latest reply"),
  model: chatModelSchema.optional().describe("Model to use for the continued reply"),
  timezone: z.string().min(1).max(100).optional().describe("IANA timezone for contextual responses"),
});

export const chatStreamOutputSchema = z.object({
  chatId: z
    .string()
    .nullable()
    .describe("ID of the chat the reply belongs to, null when the stream did not report one"),
  text: z.string().describe("Assistant reply text"),
  pendingApprovals: z
    .array(
      z.object({
        approvalId: z.string(),
        toolCallId: z.string(),
        toolName: z.string().nullable().describe("Tool the agent wants to run, including connected MCP tools"),
        input: z.unknown().describe("Exact input the tool will run with"),
      }),
    )
    .describe(
      "Actions the agent paused on. None of them has run. Empty when the reply is complete. Show each one to the user and send their decision with respond_to_chat_approvals.",
    ),
});
