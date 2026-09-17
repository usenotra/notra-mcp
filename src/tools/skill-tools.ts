import {
  listSkillsSchema,
  getSkillSchema,
  skillPayloadSchema,
  updateSkillSchema,
  deleteSkillSchema,
} from "../schemas/skill.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";

export function registerSkillTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_skills",
    {
      description: "List reusable writing skills for your organization",
      annotations: { title: "List Skills", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: listSkillsSchema,
    },
    () => handleError(() => client.listSkills()),
  );

  server.registerTool(
    "get_skill",
    {
      description: "Get a single reusable writing skill by name",
      annotations: { title: "Get Skill", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: getSkillSchema,
    },
    ({ name }) => handleError(() => client.getSkill(name)),
  );

  server.registerTool(
    "create_skill",
    {
      description: "Create a reusable writing skill",
      annotations: { title: "Create Skill", readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      inputSchema: skillPayloadSchema,
    },
    (params) => handleError(() => client.createSkill(params)),
  );

  server.registerTool(
    "update_skill",
    {
      description: "Update a reusable writing skill by name",
      annotations: {
        title: "Update Skill",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: updateSkillSchema,
    },
    ({ currentName, ...body }) => handleError(() => client.updateSkill(currentName, body)),
  );

  server.registerTool(
    "delete_skill",
    {
      description: "Delete a reusable writing skill by name",
      annotations: {
        title: "Delete Skill",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: deleteSkillSchema,
    },
    ({ name }) => handleError(() => client.deleteSkill(name)),
  );
}
