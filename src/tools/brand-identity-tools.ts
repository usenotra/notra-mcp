import {
  listBrandIdentitiesSchema,
  getBrandIdentitySchema,
  updateBrandIdentitySchema,
  deleteBrandIdentitySchema,
  generateBrandIdentitySchema,
  getBrandIdentityGenerationStatusSchema,
  listBrandColorsSchema,
  createBrandColorSchema,
  updateBrandColorSchema,
  deleteBrandColorSchema,
} from "../schemas/brand-identity.js";
import type { McpServer } from "@modelcontextprotocol/server";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerBrandIdentityTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_brand_identities",
    {
      description: "List all brand identities configured for your organization",
      annotations: { title: "List Brand Identities", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listBrandIdentitiesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listBrandIdentities")),
    },
    () => handleError(() => client.listBrandIdentities()),
  );

  server.registerTool(
    "get_brand_identity",
    {
      description: "Get a single brand identity by its ID, including tone, audience, and language settings",
      annotations: { title: "Get Brand Identity", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(getBrandIdentitySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getBrandIdentity")),
    },
    ({ brandIdentityId }) => handleError(() => client.getBrandIdentity(brandIdentityId)),
  );

  server.registerTool(
    "update_brand_identity",
    {
      description: "Update a brand identity's settings including name, tone, audience, language, and more",
      annotations: {
        title: "Update Brand Identity",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateBrandIdentitySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateBrandIdentity")),
    },
    ({ brandIdentityId, ...body }) => handleError(() => client.updateBrandIdentity(brandIdentityId, body)),
  );

  server.registerTool(
    "delete_brand_identity",
    {
      description: "Delete a brand identity. Returns any schedules or events that were disabled as a result.",
      annotations: {
        title: "Delete Brand Identity",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteBrandIdentitySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteBrandIdentity")),
    },
    ({ brandIdentityId }) => handleError(() => client.deleteBrandIdentity(brandIdentityId)),
  );

  server.registerTool(
    "generate_brand_identity",
    {
      description:
        "Queue async brand identity generation from a website URL. Notra will scrape the site and extract brand info. Use get_brand_identity_generation_status to poll for completion.",
      annotations: {
        title: "Generate Brand Identity",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(generateBrandIdentitySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createBrandIdentity")),
    },
    (params) => handleError(() => client.generateBrandIdentity(params)),
  );

  server.registerTool(
    "get_brand_identity_generation_status",
    {
      description: "Check the status of an async brand identity generation job",
      annotations: {
        title: "Get Brand Identity Generation Status",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
      },
      inputSchema: shareJsonSchema(getBrandIdentityGenerationStatusSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getBrandIdentityGeneration")),
    },
    ({ jobId }) => handleError(() => client.getBrandIdentityGenerationStatus(jobId)),
  );

  server.registerTool(
    "list_brand_colors",
    {
      description:
        "List the brand guideline colors of a brand identity, including light/dark hex values, role, and usage",
      annotations: { title: "List Brand Colors", readOnlyHint: true, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(listBrandColorsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listBrandColors")),
    },
    ({ brandIdentityId }) => handleError(() => client.listBrandColors(brandIdentityId)),
  );

  server.registerTool(
    "create_brand_color",
    {
      description: "Add a color to a brand identity's guidelines",
      annotations: { title: "Create Brand Color", readOnlyHint: false, openWorldHint: false, destructiveHint: false },
      inputSchema: shareJsonSchema(createBrandColorSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createBrandColor")),
    },
    ({ brandIdentityId, ...body }) => handleError(() => client.createBrandColor(brandIdentityId, body)),
  );

  server.registerTool(
    "update_brand_color",
    {
      description: "Update a brand color's hex values, name, role, or usage. Only the provided fields change.",
      annotations: {
        title: "Update Brand Color",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(updateBrandColorSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("updateBrandColor")),
    },
    ({ brandIdentityId, colorId, ...body }) =>
      handleError(() => client.updateBrandColor(brandIdentityId, colorId, body)),
  );

  server.registerTool(
    "delete_brand_color",
    {
      description: "Delete a color from a brand identity's guidelines",
      annotations: {
        title: "Delete Brand Color",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: true,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(deleteBrandColorSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("deleteBrandColor")),
    },
    ({ brandIdentityId, colorId }) => handleError(() => client.deleteBrandColor(brandIdentityId, colorId)),
  );
}
