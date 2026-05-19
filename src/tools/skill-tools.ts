import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";

const skillNameSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/)
  .describe("Skill name. Lowercase letters, digits, and hyphens only.");

const skillPayloadSchema = {
  name: skillNameSchema,
  description: z.string().min(1).max(1000).describe("Short description of when the skill should be used"),
  content: z.string().min(1).max(200000).describe("Full skill instructions, typically Markdown"),
} as const;

export function registerSkillTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_skills",
    {
      description: "List reusable writing skills for your organization",
      inputSchema: {},
    },
    async () => {
      return handleError(() => client.listSkills());
    }
  );

  server.registerTool(
    "get_skill",
    {
      description: "Get a single reusable writing skill by name",
      inputSchema: {
        name: skillNameSchema,
      },
    },
    async ({ name }) => {
      return handleError(() => client.getSkill(name));
    }
  );

  server.registerTool(
    "create_skill",
    {
      description: "Create a reusable writing skill",
      inputSchema: skillPayloadSchema,
    },
    async (params) => {
      return handleError(() => client.createSkill(params));
    }
  );

  server.registerTool(
    "update_skill",
    {
      description: "Update a reusable writing skill by name",
      inputSchema: {
        currentName: skillNameSchema.describe("Current skill name to update"),
        name: skillNameSchema.optional().describe("New skill name"),
        description: z.string().min(1).max(1000).optional().describe("Updated short description"),
        content: z.string().min(1).max(200000).optional().describe("Updated full skill instructions"),
      },
    },
    async ({ currentName, ...body }) => {
      return handleError(() => client.updateSkill(currentName, body));
    }
  );

  server.registerTool(
    "delete_skill",
    {
      description: "Delete a reusable writing skill by name",
      inputSchema: {
        name: skillNameSchema,
      },
    },
    async ({ name }) => {
      return handleError(() => client.deleteSkill(name));
    }
  );
}
