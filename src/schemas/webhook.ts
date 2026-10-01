import * as z from "zod";
import { WEBHOOK_DELIVERY_STATUS_FILTER_VALUES, WEBHOOK_EVENT_VALUES } from "../constants/webhook.js";

const endpointIdSchema = z.string().min(1).describe("The webhook endpoint ID (see list_webhook_endpoints)");
const deliveryIdSchema = z.string().min(1).describe("The webhook delivery ID (see list_webhook_deliveries)");

export const listWebhookEndpointsSchema = z.object({});

export const createWebhookEndpointSchema = z.object({
  url: z.url().max(2048).describe("HTTPS URL that receives event POSTs"),
  events: z
    .array(z.enum(WEBHOOK_EVENT_VALUES))
    .min(1)
    .max(WEBHOOK_EVENT_VALUES.length)
    .describe("Notra events to send to the endpoint"),
});

export const deleteWebhookEndpointSchema = z.object({ endpointId: endpointIdSchema });

export const listWebhookDeliveriesSchema = z.object({
  offset: z.number().int().min(0).max(100_000).optional().describe("Number of deliveries to skip (default 0)"),
  status: z
    .enum(WEBHOOK_DELIVERY_STATUS_FILTER_VALUES)
    .optional()
    .describe("Only deliveries with this status (default all)"),
});

export const getWebhookDeliverySchema = z.object({ deliveryId: deliveryIdSchema });
export const retryWebhookDeliverySchema = z.object({ deliveryId: deliveryIdSchema });
