import type { ToolRegistry } from "../types/server.js";
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

export function registerEventTriggerTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_event_triggers",
      description:
        "List event triggers that generate content automatically from GitHub releases or pushes, with each trigger's ID, name, event types, target repositories, output type, publishing settings and enabled and autoPublish flags. repositoryMap labels each targeted GitHub integration ID with its owner/repo.",
      annotations: {
        title: "List Event Triggers",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listEventTriggersSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listEventTriggers")),
    },
    (params) => handleError(() => client.listEventTriggers(params)),
  );

  server.tool(
    {
      name: "get_event_trigger",
      description:
        "Get one event trigger by its ID with its full configuration: event types, pre-release and commit filters, target repositories, output type, outputConfig, enabled and autoPublish. Use it before update_event_trigger, which needs every field sent back.",
      annotations: {
        title: "Get Event Trigger",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getEventTriggerSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getEventTrigger")),
    },
    ({ triggerId }) => handleError(() => client.getEventTrigger(triggerId)),
  );

  server.tool(
    {
      name: "create_event_trigger",
      description:
        "Create an event trigger that generates content whenever a GitHub release or push happens in the targeted repositories. Generated content uses AI credits each time the trigger fires. When autoPublish is true, generated content is automatically published to outputConfig.publishDestination. An enabled trigger keeps firing until it is disabled with update_event_trigger or deleted. Returns the created trigger.",
      annotations: {
        title: "Create Event Trigger",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(createEventTriggerSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createEventTrigger")),
    },
    (body) => handleError(() => client.createEventTrigger(body)),
  );

  server.tool(
    {
      name: "update_event_trigger",
      description:
        "Replace an event trigger's whole configuration. Fields you leave out are reset, not kept, so read it with get_event_trigger first and send every field back. When autoPublish is true, future generated content is automatically published to outputConfig.publishDestination.",
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

  server.tool(
    {
      name: "delete_event_trigger",
      description:
        "Permanently delete an event trigger so new GitHub releases or pushes no longer generate content; it cannot be restored. To pause it instead, set enabled to false with update_event_trigger. Returns the deleted trigger's ID.",
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
