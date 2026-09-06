import * as z from "zod";

const skillNameSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/)
  .describe("Skill name. Lowercase letters, digits, and hyphens only.");

export const skillPayloadSchema = z.object({
  name: skillNameSchema,
  description: z.string().min(1).max(1000).describe("Short description of when the skill should be used"),
  content: z.string().min(1).max(200000).describe("Full skill instructions, typically Markdown"),
});

export const listSkillsSchema = z.object({});

export const getSkillSchema = z.object({
  name: skillNameSchema,
});

export const updateSkillSchema = z.object({
  currentName: skillNameSchema.describe("Current skill name to update"),
  name: skillNameSchema.optional().describe("New skill name"),
  description: z.string().min(1).max(1000).optional().describe("Updated short description"),
  content: z.string().min(1).max(200000).optional().describe("Updated full skill instructions"),
});

export const deleteSkillSchema = z.object({
  name: skillNameSchema,
});
