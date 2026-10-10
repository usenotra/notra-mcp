import * as z from "zod";

// Malformed optional fields must not discard valid text elsewhere in the frame.
export const chatStreamFrameSchema = z.object({
  type: z.string().optional().catch(undefined),
  delta: z.string().optional().catch(undefined),
  textDelta: z.string().optional().catch(undefined),
  toolCallId: z.string().min(1).optional().catch(undefined),
  toolName: z.string().min(1).optional().catch(undefined),
  input: z.unknown().optional(),
  approvalId: z.string().min(1).optional().catch(undefined),
  isAutomatic: z.boolean().optional().catch(undefined),
  messageMetadata: z
    .object({ chatId: z.string().min(1).optional().catch(undefined) })
    .optional()
    .catch(undefined),
});
