import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import type { NotraClient } from "../notra-client.js";
import {
  createEventTriggerSchema,
  deleteEventTriggerSchema,
  getEventTriggerSchema,
  listEventTriggersSchema,
  updateEventTriggerSchema,
} from "../schemas/event-trigger.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerEventTriggerTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_event_triggers",
    {
      description:
        "List event triggers that generate content automatically from GitHub releases or pushes. repositoryMap labels each targeted GitHub integration ID with its owner/repo.",
      annotations: { title: "List Event Triggers", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listEventTriggersSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listEventTriggers")),
    },
    (params) => handleError(() => client.listEventTriggers(params)),
  );

  server.registerTool(
    "get_event_trigger",
    {
      description: "Get a single event trigger by its ID",
      annotations: { title: "Get Event Trigger", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getEventTriggerSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getEventTrigger")),
    },
    ({ triggerId }) => handleError(() => client.getEventTrigger(triggerId)),
  );

  server.registerTool(
    "create_event_trigger",
    {
      description:
        "Create an event trigger that generates content whenever a GitHub release or push happens in the targeted repositories. Generated content uses AI credits each time the trigger fires.",
      annotations: { title: "Create Event Trigger", readOnlyHint: false, openWorldHint: true, destructiveHint: false },
      inputSchema: shareJsonSchema(createEventTriggerSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createEventTrigger")),
    },
    (body) => handleError(() => client.createEventTrigger(body)),
  );

  server.registerTool(
    "update_event_trigger",
    {
      description:
        "Replace an event trigger's configuration. The API takes the full definition, so read it with get_event_trigger first and send every field back.",
      annotations: {
        title: "Update Event Trigger",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateEventTriggerSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateEventTrigger")),
    },
    // The API rejects outputConfig: null, which get_event_trigger returns for triggers without one.
    ({ triggerId, outputConfig, ...body }) =>
      handleError(() => client.updateEventTrigger(triggerId, { ...body, ...(outputConfig && { outputConfig }) })),
  );

  server.registerTool(
    "delete_event_trigger",
    {
      description: "Delete an event trigger",
      annotations: {
        title: "Delete Event Trigger",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteEventTriggerSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteEventTrigger")),
    },
    ({ triggerId }) => handleError(() => client.deleteEventTrigger(triggerId)),
  );
}
