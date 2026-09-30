import type {
  EVENT_TRIGGER_EVENT_TYPE_VALUES,
  EVENT_TRIGGER_OUTPUT_TYPE_VALUES,
  EVENT_TRIGGER_PUBLISH_DESTINATION_VALUES,
  EVENT_TRIGGER_SOURCE_TYPE_VALUES,
} from "../constants/event-trigger.js";
import type { Organization } from "./api.js";

export type EventTriggerSourceType = (typeof EVENT_TRIGGER_SOURCE_TYPE_VALUES)[number];
type EventTriggerEventType = (typeof EVENT_TRIGGER_EVENT_TYPE_VALUES)[number];
export type EventTriggerOutputType = (typeof EVENT_TRIGGER_OUTPUT_TYPE_VALUES)[number];
type EventTriggerPublishDestination = (typeof EVENT_TRIGGER_PUBLISH_DESTINATION_VALUES)[number];

export interface EventTriggerSourceConfig {
  eventTypes: EventTriggerEventType[];
  includePreReleases?: boolean;
  ignoreCommitPatterns?: string[];
}

export interface EventTriggerTargets {
  repositoryIds: string[];
}

export interface EventTriggerOutputConfig {
  publishDestination?: EventTriggerPublishDestination;
  brandVoiceId?: string;
}

export interface EventTrigger {
  id: string;
  organizationId: string;
  name: string;
  sourceType: EventTriggerSourceType;
  sourceConfig: EventTriggerSourceConfig;
  targets: EventTriggerTargets;
  outputType: EventTriggerOutputType;
  outputConfig?: EventTriggerOutputConfig | null;
  enabled: boolean;
  autoPublish: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Body for both create and update; the API replaces the whole trigger on PATCH. */
export interface EventTriggerRequest {
  sourceType: EventTriggerSourceType;
  sourceConfig: EventTriggerSourceConfig;
  targets: EventTriggerTargets;
  outputType: EventTriggerOutputType;
  outputConfig?: EventTriggerOutputConfig;
  enabled: boolean;
  autoPublish?: boolean;
}

export interface ListEventTriggersParams {
  repositoryIds?: string[];
}

export interface EventTriggerListResponse {
  eventTriggers: EventTrigger[];
  repositoryMap: Record<string, string>;
  organization: Organization;
}

export interface EventTriggerResponse {
  eventTrigger: EventTrigger;
  organization: Organization;
}

export interface EventTriggerDeleteResponse {
  id: string;
  organization: Organization;
}
