import * as z from "zod";
import { WEBHOOK_DELIVERY_STATUS_FILTER_VALUES } from "../constants/webhook.js";

const endpointIdSchema = z.string().min(1).describe("ID of the webhook endpoint, from list_webhook_endpoints");
const deliveryIdSchema = z.string().min(1).describe("ID of the webhook delivery, from list_webhook_deliveries");

export const listWebhookEndpointsSchema = z.object({});

export const deleteWebhookEndpointSchema = z.object({ endpointId: endpointIdSchema });

export const listWebhookDeliveriesSchema = z.object({
  offset: z
    .number()
    .int()
    .min(0)
    .max(100_000)
    .optional()
    .describe(
      "How many of the newest deliveries to skip, for paging. Add the number of deliveries already received while hasMore is true. Omit to start at the newest.",
    ),
  status: z
    .enum(WEBHOOK_DELIVERY_STATUS_FILTER_VALUES)
    .optional()
    .describe(
      "Only return deliveries in this state. Pass failed to find deliveries worth retrying. Omit or pass all for every state.",
    ),
});

export const getWebhookDeliverySchema = z.object({ deliveryId: deliveryIdSchema });
export const retryWebhookDeliverySchema = z.object({ deliveryId: deliveryIdSchema });
