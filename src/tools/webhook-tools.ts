import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import type { NotraClient } from "../notra-client.js";
import {
  deleteWebhookEndpointSchema,
  getWebhookDeliverySchema,
  listWebhookDeliveriesSchema,
  listWebhookEndpointsSchema,
  retryWebhookDeliverySchema,
} from "../schemas/webhook.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerWebhookTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_webhook_endpoints",
      description:
        "List the HTTPS endpoints subscribed to Notra events, with each endpoint's ID, URL, subscribed event types, enabled flag and creation time. Returns endpoints (id, organizationId, url, events, enabled, createdAt). Signing secrets are not returned.",
      annotations: {
        title: "List Webhook Endpoints",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listWebhookEndpointsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listWebhookEndpoints")),
    },
    () => handleError(() => client.listWebhookEndpoints()),
  );

  server.tool(
    {
      name: "delete_webhook_endpoint",
      description:
        "Permanently remove a webhook endpoint so it stops receiving Notra events, and cancel its deliveries that have not been sent yet. It cannot be restored. Returns the deleted endpoint's id.",
      annotations: {
        title: "Delete Webhook Endpoint",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteWebhookEndpointSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteWebhookEndpoint")),
    },
    ({ endpointId }) => handleError(() => client.deleteWebhookEndpoint(endpointId)),
  );

  server.tool(
    {
      name: "list_webhook_deliveries",
      description:
        "List webhook deliveries across all endpoints, newest first. Returns deliveries (each with id, eventId, endpointId, url, eventType, status, attemptCount, nextAttemptAt, createdAt, statusCode and error) and hasMore. Page with offset while hasMore is true.",
      annotations: {
        title: "List Webhook Deliveries",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listWebhookDeliveriesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listWebhookDeliveries")),
    },
    (params) => handleError(() => client.listWebhookDeliveries(params)),
  );

  server.tool(
    {
      name: "get_webhook_delivery",
      description:
        "Get one webhook delivery by ID. Returns delivery, with the same fields as list_webhook_deliveries plus the payload that was sent, and attempts, each with attemptNumber, startedAt, finishedAt, statusCode, error and durationMs.",
      annotations: {
        title: "Get Webhook Delivery",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getWebhookDeliverySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getWebhookDelivery")),
    },
    ({ deliveryId }) => handleError(() => client.getWebhookDelivery(deliveryId)),
  );

  server.tool(
    {
      name: "retry_webhook_delivery",
      description:
        "Queue a failed webhook delivery to be sent again, keeping its attempt history. This sends the same payload to the subscribed external endpoint again, which may repeat downstream effects there and cannot be recalled, so confirm with the user. Find failed deliveries with list_webhook_deliveries. Returns the delivery's id; check its outcome with get_webhook_delivery.",
      annotations: {
        title: "Retry Webhook Delivery",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: true,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(retryWebhookDeliverySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("retryWebhookDelivery")),
    },
    ({ deliveryId }) => handleError(() => client.retryWebhookDelivery(deliveryId)),
  );
}
