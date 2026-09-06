import * as z from "zod";

export const apiErrorSchema = z.object({
  message: z.string().optional().catch(undefined),
  error: z.string().optional().catch(undefined),
});

export const queryParameterSchema = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]);
