import {
  listSkillsSchema,
  getSkillSchema,
  skillPayloadSchema,
  updateSkillSchema,
  deleteSkillSchema,
} from "../schemas/skill.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerSkillTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_skills",
    {
      description: "List reusable writing skills for your organization",
      annotations: { title: "List Skills", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listSkillsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listSkills")),
    },
    () => handleError(() => client.listSkills()),
  );

  server.registerTool(
    "get_skill",
    {
      description: "Get a single reusable writing skill by name",
      annotations: { title: "Get Skill", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getSkillSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getSkill")),
    },
    ({ name }) => handleError(() => client.getSkill(name)),
  );

  server.registerTool(
    "create_skill",
    {
      description: "Create a reusable writing skill",
      annotations: { title: "Create Skill", readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(skillPayloadSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createSkill")),
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
      inputSchema: shareJsonSchema(updateSkillSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("patchSkill")),
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
      inputSchema: shareJsonSchema(deleteSkillSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteSkill")),
    },
    ({ name }) => handleError(() => client.deleteSkill(name)),
  );
}
