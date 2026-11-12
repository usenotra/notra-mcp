import * as z from "zod";

const skillNameSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/)
  .describe(
    "Name that identifies the skill: lowercase letters, digits and hyphens, not starting or ending with a hyphen, at most 64 characters, such as release-notes-style. list_skills shows existing names",
  );

export const skillPayloadSchema = z.object({
  name: skillNameSchema,
  description: z.string().min(1).max(1000).describe("Short description of when the skill should be used"),
  content: z
    .string()
    .min(1)
    .max(200000)
    .describe("The full instructions the skill carries, usually Markdown, such as style rules and examples to follow"),
});

export const listSkillsSchema = z.object({});

export const getSkillSchema = z.object({
  name: skillNameSchema,
});

export const updateSkillSchema = z.object({
  currentName: skillNameSchema.describe("Existing name of the skill to change, from list_skills"),
  name: skillNameSchema
    .optional()
    .describe(
      "New name to rename the skill to. Omit to keep the current name; built-in system skills cannot be renamed.",
    ),
  description: z
    .string()
    .min(1)
    .max(1000)
    .optional()
    .describe("Replacement summary of when the skill should be used. Omit to keep the current description."),
  content: z
    .string()
    .min(1)
    .max(200000)
    .optional()
    .describe(
      "Replacement for the skill's full instructions; it overwrites the whole text. Omit to keep the current content.",
    ),
});

export const deleteSkillSchema = z.object({
  name: skillNameSchema,
});
