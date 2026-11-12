import * as z from "zod";
import {
  EVENT_TRIGGER_EVENT_TYPE_VALUES,
  EVENT_TRIGGER_OUTPUT_TYPE_VALUES,
  EVENT_TRIGGER_PUBLISH_DESTINATION_VALUES,
  EVENT_TRIGGER_SOURCE_TYPE_VALUES,
} from "../constants/event-trigger.js";

export const triggerIdSchema = z.string().min(1).describe("The event trigger ID (see list_event_triggers)");

export const eventTriggerBodyShape = {
  sourceType: z
    .enum(EVENT_TRIGGER_SOURCE_TYPE_VALUES)
    .describe(
      "Where the events that fire the trigger come from: GitHub webhooks from the repositories in targets.repositoryIds",
    ),
  sourceConfig: z
    .object({
      eventTypes: z
        .array(z.enum(EVENT_TRIGGER_EVENT_TYPE_VALUES))
        .min(1)
        .describe("GitHub events that fire the trigger: release when a release is published, push when commits land"),
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
        .describe(
          "Deprecated and ignored. Auto-published content is only marked as published in Notra; publish to GitHub or a Notra site from the post instead.",
        ),
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
  repositoryIds: z
    .array(z.string().min(1))
    .optional()
    .describe(
      "Only return triggers that listen to these GitHub integration IDs, from the github array of list_integrations. Omit to list all triggers.",
    ),
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
