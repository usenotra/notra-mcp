import {
  listSkillsSchema,
  getSkillSchema,
  skillPayloadSchema,
  updateSkillSchema,
  deleteSkillSchema,
} from "../schemas/skill.js";
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerSkillTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_skills",
      description:
        "List your organization's reusable writing skills with each skill's ID, name, description, whether it is a built-in system skill, and last update time. Use get_skill for a skill's full instructions.",
      annotations: {
        title: "List Skills",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listSkillsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listSkills")),
    },
    () => handleError(() => client.listSkills()),
  );

  server.tool(
    {
      name: "get_skill",
      description:
        "Get one reusable writing skill by name, including its description, full instruction content, whether it is a built-in system skill, and timestamps.",
      annotations: {
        title: "Get Skill",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getSkillSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getSkill")),
    },
    ({ name }) => handleError(() => client.getSkill(name)),
  );

  server.tool(
    {
      name: "create_skill",
      description:
        "Save a new reusable writing skill in your organization: a named set of writing instructions plus a short description of when to use it. Returns the created skill.",
      annotations: {
        title: "Create Skill",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(skillPayloadSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createSkill")),
    },
    (params) => handleError(() => client.createSkill(params)),
  );

  server.tool(
    {
      name: "update_skill",
      description:
        "Change a writing skill's name, description, or instructions, looked up by currentName. Only the fields you pass change; description and content are replaced in full and previous versions are not kept. Built-in system skills cannot be renamed. Returns the updated skill.",
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

  server.tool(
    {
      name: "delete_skill",
      description:
        "Permanently delete a writing skill by name; it cannot be restored. Built-in system skills cannot be deleted. Returns success.",
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
