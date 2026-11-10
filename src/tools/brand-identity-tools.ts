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
import type { ToolRegistry } from "../types/server.js";
import { shareJsonSchema } from "../utils/json-schema-cache.js";

import type { NotraClient } from "../notra-client.js";
import { handleError } from "../utils/mcp.js";
import { apiOutputSchema } from "../utils/output-schema.js";

export function registerBrandIdentityTools(server: ToolRegistry, client: NotraClient) {
  server.tool(
    {
      name: "list_brand_identities",
      description:
        "List all brand identities in your organization with their name, default flag, website, company details, tone, audience, custom instructions and language. Use an id as brandIdentityId in other tools.",
      annotations: {
        title: "List Brand Identities",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listBrandIdentitiesSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listBrandIdentities")),
    },
    () => handleError(() => client.listBrandIdentities()),
  );

  server.tool(
    {
      name: "get_brand_identity",
      description: "Get a single brand identity by its ID, including tone, audience, and language settings",
      annotations: {
        title: "Get Brand Identity",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getBrandIdentitySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getBrandIdentity")),
    },
    ({ brandIdentityId }) => handleError(() => client.getBrandIdentity(brandIdentityId)),
  );

  server.tool(
    {
      name: "update_brand_identity",
      description:
        "Change a brand identity's name, website, company details, tone, audience, instructions or language. Only the fields you pass change, null clears an optional field, and overwritten values are not kept. The new settings shape content generated afterwards. isDefault makes it the default brand identity for tools and schedules that name none. Returns the updated brand identity.",
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

  server.tool(
    {
      name: "delete_brand_identity",
      description:
        "Permanently delete a brand identity; it cannot be restored. Schedules and event triggers that used it are disabled, and the response lists them in disabledSchedules and disabledEvents so they can be reconfigured. Confirm with the user first.",
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

  server.tool(
    {
      name: "generate_brand_identity",
      description:
        "Queue async brand identity generation from a website URL. Notra will scrape the site and extract brand info. Use get_brand_identity_generation_status to poll for completion.",
      annotations: {
        title: "Generate Brand Identity",
        readOnlyHint: false,
        openWorldHint: true,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(generateBrandIdentitySchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createBrandIdentity")),
    },
    (params) => handleError(() => client.generateBrandIdentity(params)),
  );

  server.tool(
    {
      name: "get_brand_identity_generation_status",
      description:
        "Check a brand identity generation job started by generate_brand_identity. Returns the job status, current step out of total steps, any error, and the brandIdentityId being filled in. Stop polling once status is completed or failed.",
      annotations: {
        title: "Get Brand Identity Generation Status",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(getBrandIdentityGenerationStatusSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("getBrandIdentityGeneration")),
    },
    ({ jobId }) => handleError(() => client.getBrandIdentityGenerationStatus(jobId)),
  );

  server.tool(
    {
      name: "list_brand_colors",
      description:
        "List the brand guideline colors of a brand identity, including light/dark hex values, role, and usage",
      annotations: {
        title: "List Brand Colors",
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
      inputSchema: shareJsonSchema(listBrandColorsSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("listBrandColors")),
    },
    ({ brandIdentityId }) => handleError(() => client.listBrandColors(brandIdentityId)),
  );

  server.tool(
    {
      name: "create_brand_color",
      description: "Add a color to a brand identity's guidelines",
      annotations: {
        title: "Create Brand Color",
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
      inputSchema: shareJsonSchema(createBrandColorSchema),
      outputSchema: shareJsonSchema(apiOutputSchema("createBrandColor")),
    },
    ({ brandIdentityId, ...body }) => handleError(() => client.createBrandColor(brandIdentityId, body)),
  );

  server.tool(
    {
      name: "update_brand_color",
      description:
        "Change a brand color's hex values, name, role, or usage. Only the provided fields change, null clears name, darkValue or usage, and overwritten values are not kept. Get colorId from list_brand_colors. Returns the updated color.",
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

  server.tool(
    {
      name: "delete_brand_color",
      description:
        "Permanently remove one color from a brand identity's guidelines. It cannot be restored; recreate it with create_brand_color if needed. Returns the deleted color's ID.",
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
