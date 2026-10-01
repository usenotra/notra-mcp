import type {
  WEBHOOK_DELIVERY_STATUS_FILTER_VALUES,
  WEBHOOK_DELIVERY_STATUS_VALUES,
  WEBHOOK_EVENT_VALUES,
} from "../constants/webhook.js";

type WebhookEvent = (typeof WEBHOOK_EVENT_VALUES)[number];
type WebhookDeliveryStatus = (typeof WEBHOOK_DELIVERY_STATUS_VALUES)[number];
type WebhookDeliveryStatusFilter = (typeof WEBHOOK_DELIVERY_STATUS_FILTER_VALUES)[number];

interface WebhookEndpoint {
  id: string;
  organizationId: string;
  url: string;
  events: WebhookEvent[];
  enabled: boolean;
  createdAt: string;
}

export interface WebhookEndpointListResponse {
  endpoints: WebhookEndpoint[];
}

export interface CreateWebhookEndpointRequest {
  url: string;
  events: WebhookEvent[];
}

export interface CreateWebhookEndpointResponse {
  endpoint: WebhookEndpoint;
  secret: string;
}

export interface WebhookIdResponse {
  id: string;
}

interface WebhookDelivery {
  id: string;
  eventId: string;
  endpointId: string;
  url: string;
  eventType: WebhookEvent;
  status: WebhookDeliveryStatus;
  attemptCount: number;
  nextAttemptAt: string;
  createdAt: string;
  statusCode: number | null;
  error: string | null;
}

interface WebhookDeliveryAttempt {
  id: string;
  deliveryId: string;
  attemptNumber: number;
  startedAt: string;
  finishedAt: string | null;
  statusCode: number | null;
  error: string | null;
  durationMs: number | null;
}

interface WebhookDeliveryDetail extends WebhookDelivery {
  payload: string;
}

export interface ListWebhookDeliveriesParams {
  offset?: number;
  status?: WebhookDeliveryStatusFilter;
}

export interface WebhookDeliveryListResponse {
  deliveries: WebhookDelivery[];
  hasMore: boolean;
}

export interface WebhookDeliveryResponse {
  delivery: WebhookDeliveryDetail;
  attempts: WebhookDeliveryAttempt[];
}
