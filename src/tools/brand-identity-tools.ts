import {
  listBrandIdentitiesSchema,
  getBrandIdentitySchema,
  updateBrandIdentitySchema,
  deleteBrandIdentitySchema,
  generateBrandIdentitySchema,
  getBrandIdentityGenerationStatusSchema,
} from "../schemas/brand-identity.js";
import type { McpServer } from "@modelcontextprotocol/server";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerBrandIdentityTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_brand_identities",
    {
      description: "List all brand identities configured for your organization",
      annotations: { title: "List Brand Identities", readOnlyHint: true },
      inputSchema: listBrandIdentitiesSchema,
      outputSchema: apiOutputSchema("listBrandIdentities"),
    },
    () => handleError(() => client.listBrandIdentities()),
  );

  server.registerTool(
    "get_brand_identity",
    {
      description: "Get a single brand identity by its ID, including tone, audience, and language settings",
      annotations: { title: "Get Brand Identity", readOnlyHint: true },
      inputSchema: getBrandIdentitySchema,
      outputSchema: apiOutputSchema("getBrandIdentity"),
    },
    ({ brandIdentityId }) => handleError(() => client.getBrandIdentity(brandIdentityId)),
  );

  server.registerTool(
    "update_brand_identity",
    {
      description: "Update a brand identity's settings including name, tone, audience, language, and more",
      annotations: { title: "Update Brand Identity", destructiveHint: true, idempotentHint: true },
      inputSchema: updateBrandIdentitySchema,
      outputSchema: apiOutputSchema("updateBrandIdentity"),
    },
    ({ brandIdentityId, ...body }) => handleError(() => client.updateBrandIdentity(brandIdentityId, body)),
  );

  server.registerTool(
    "delete_brand_identity",
    {
      description: "Delete a brand identity. Returns any schedules or events that were disabled as a result.",
      annotations: { title: "Delete Brand Identity", destructiveHint: true, idempotentHint: true },
      inputSchema: deleteBrandIdentitySchema,
      outputSchema: apiOutputSchema("deleteBrandIdentity"),
    },
    ({ brandIdentityId }) => handleError(() => client.deleteBrandIdentity(brandIdentityId)),
  );

  server.registerTool(
    "generate_brand_identity",
    {
      description:
        "Queue async brand identity generation from a website URL. Notra will scrape the site and extract brand info. Use get_brand_identity_generation_status to poll for completion.",
      annotations: { title: "Generate Brand Identity", destructiveHint: false },
      inputSchema: generateBrandIdentitySchema,
      outputSchema: apiOutputSchema("createBrandIdentity"),
    },
    (params) => handleError(() => client.generateBrandIdentity(params)),
  );

  server.registerTool(
    "get_brand_identity_generation_status",
    {
      description: "Check the status of an async brand identity generation job",
      annotations: { title: "Get Brand Identity Generation Status", readOnlyHint: true },
      inputSchema: getBrandIdentityGenerationStatusSchema,
      outputSchema: apiOutputSchema("getBrandIdentityGeneration"),
    },
    ({ jobId }) => handleError(() => client.getBrandIdentityGenerationStatus(jobId)),
  );
}
