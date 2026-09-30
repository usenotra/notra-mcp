import * as z from "zod";
import {
  EVENT_TRIGGER_EVENT_TYPE_VALUES,
  EVENT_TRIGGER_OUTPUT_TYPE_VALUES,
  EVENT_TRIGGER_PUBLISH_DESTINATION_VALUES,
  EVENT_TRIGGER_SOURCE_TYPE_VALUES,
} from "../constants/event-trigger.js";

const triggerIdSchema = z.string().min(1).describe("The event trigger ID (see list_event_triggers)");

const eventTriggerBodyShape = {
  sourceType: z.enum(EVENT_TRIGGER_SOURCE_TYPE_VALUES).describe("Event source. Only GitHub webhooks are supported."),
  sourceConfig: z
    .object({
      eventTypes: z
        .array(z.enum(EVENT_TRIGGER_EVENT_TYPE_VALUES))
        .min(1)
        .describe("GitHub events that fire the trigger"),
      includePreReleases: z
        .boolean()
        .optional()
        .describe("Also fire on pre-releases (release events only, default true)"),
      ignoreCommitPatterns: z
        .array(z.string().min(1))
        .optional()
        .describe("Commit message patterns that do not fire the trigger (push events only)"),
    })
    .describe("Which GitHub events fire the trigger"),
  targets: z
    .object({
      repositoryIds: z
        .array(z.string().min(1))
        .min(1)
        .describe("GitHub integration IDs from list_integrations to listen to"),
    })
    .describe("Repositories the trigger listens to"),
  outputType: z.enum(EVENT_TRIGGER_OUTPUT_TYPE_VALUES).describe("Content type to generate when the trigger fires"),
  outputConfig: z
    .object({
      publishDestination: z
        .enum(EVENT_TRIGGER_PUBLISH_DESTINATION_VALUES)
        .optional()
        .describe("Where auto-published content goes"),
      brandVoiceId: z.string().min(1).optional().describe("Brand identity ID from list_brand_identities"),
    })
    .optional()
    .describe("How generated content is styled and published"),
  enabled: z.boolean().describe("Whether the trigger fires"),
  autoPublish: z
    .boolean()
    .optional()
    .describe("Publish generated content immediately instead of saving a draft (default false)"),
};

export const listEventTriggersSchema = z.object({
  repositoryIds: z.array(z.string().min(1)).optional().describe("Only triggers targeting these GitHub integration IDs"),
});

export const getEventTriggerSchema = z.object({ triggerId: triggerIdSchema });
export const createEventTriggerSchema = z.object(eventTriggerBodyShape);
// PATCH replaces the whole trigger and applies defaults to omitted fields, so fields
// with defaults are required here. get_event_trigger returns outputConfig: null for
// triggers without one; accept it so the read result can be sent back unchanged.
export const updateEventTriggerSchema = z.object({
  triggerId: triggerIdSchema,
  ...eventTriggerBodyShape,
  outputConfig: eventTriggerBodyShape.outputConfig
    .unwrap()
    .nullable()
    .optional()
    .describe("How generated content is styled and published; null or omitted means none"),
  autoPublish: z
    .boolean()
    .describe("Publish generated content immediately instead of saving a draft. Send the current value back."),
});
export const deleteEventTriggerSchema = z.object({ triggerId: triggerIdSchema });
