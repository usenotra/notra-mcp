import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";
import type { NotraClient } from "../notra-client.js";
import {
  createWebhookEndpointSchema,
  deleteWebhookEndpointSchema,
  getWebhookDeliverySchema,
  listWebhookDeliveriesSchema,
  listWebhookEndpointsSchema,
  retryWebhookDeliverySchema,
} from "../schemas/webhook.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerWebhookTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_webhook_endpoints",
    {
      description: "List HTTPS endpoints subscribed to Notra events. Signing secrets are not returned.",
      annotations: {
        title: "List Webhook Endpoints",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(listWebhookEndpointsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listWebhookEndpoints")),
    },
    () => handleError(() => client.listWebhookEndpoints()),
  );

  server.registerTool(
    "create_webhook_endpoint",
    {
      description:
        "Subscribe an HTTPS endpoint to Notra events such as post generation and publishing. The response includes the signing secret, which is shown only once; pass it to the user to store.",
      annotations: {
        title: "Create Webhook Endpoint",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(createWebhookEndpointSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createWebhookEndpoint")),
    },
    (body) => handleError(() => client.createWebhookEndpoint(body)),
  );

  server.registerTool(
    "delete_webhook_endpoint",
    {
      description: "Remove a webhook subscription and cancel its unsent deliveries",
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

  server.registerTool(
    "list_webhook_deliveries",
    {
      description:
        "List webhook deliveries across all endpoints, newest first. Page with offset while hasMore is true.",
      annotations: {
        title: "List Webhook Deliveries",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(listWebhookDeliveriesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listWebhookDeliveries")),
    },
    (params) => handleError(() => client.listWebhookDeliveries(params)),
  );

  server.registerTool(
    "get_webhook_delivery",
    {
      description: "Get a webhook delivery's payload and attempt history",
      annotations: { title: "Get Webhook Delivery", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getWebhookDeliverySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getWebhookDelivery")),
    },
    ({ deliveryId }) => handleError(() => client.getWebhookDelivery(deliveryId)),
  );

  server.registerTool(
    "retry_webhook_delivery",
    {
      description: "Queue a failed webhook delivery to be sent again, keeping its attempt history",
      annotations: {
        title: "Retry Webhook Delivery",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(retryWebhookDeliverySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("retryWebhookDelivery")),
    },
    ({ deliveryId }) => handleError(() => client.retryWebhookDelivery(deliveryId)),
  );
}
