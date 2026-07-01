import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod";
import type { NotraClient } from "../notra-client.js";
import { LANGUAGE_VALUES } from "../types/api.js";
import { handleError } from "../utils/mcp.js";

export function registerBrandIdentityTools(server: McpServer, client: NotraClient) {
  server.registerTool(
    "list_brand_identities",
    {
      description: "List all brand identities configured for your organization",
      annotations: { title: "List Brand Identities", readOnlyHint: true },
      inputSchema: {},
    },
    async () => {
      return handleError(() => client.listBrandIdentities());
    },
  );

  server.registerTool(
    "get_brand_identity",
    {
      description: "Get a single brand identity by its ID, including tone, audience, and language settings",
      annotations: { title: "Get Brand Identity", readOnlyHint: true },
      inputSchema: {
        brandIdentityId: z.string().min(1).describe("The brand identity ID to retrieve"),
      },
    },
    async ({ brandIdentityId }) => {
      return handleError(() => client.getBrandIdentity(brandIdentityId));
    },
  );

  server.registerTool(
    "update_brand_identity",
    {
      description: "Update a brand identity's settings including name, tone, audience, language, and more",
      annotations: { title: "Update Brand Identity", destructiveHint: true, idempotentHint: true },
      inputSchema: {
        brandIdentityId: z.string().min(1).describe("The brand identity ID to update"),
        name: z.string().min(1).max(120).optional().describe("Brand identity name (1-120 characters)"),
        websiteUrl: z.string().min(1).optional().describe("Website URL"),
        companyName: z.string().min(1).max(200).optional().nullable().describe("Company name"),
        companyDescription: z
          .string()
          .min(10)
          .max(4000)
          .optional()
          .nullable()
          .describe("Company description (min 10 chars)"),
        toneProfile: z
          .enum(["Conversational", "Professional", "Casual", "Formal"])
          .optional()
          .nullable()
          .describe("Tone profile preset"),
        customTone: z.string().max(1000).optional().nullable().describe("Custom tone description"),
        customInstructions: z
          .string()
          .max(4000)
          .optional()
          .nullable()
          .describe("Custom instructions for content generation"),
        audience: z
          .string()
          .min(10)
          .max(1000)
          .optional()
          .nullable()
          .describe("Target audience description (min 10 chars)"),
        language: z.enum(LANGUAGE_VALUES).optional().nullable().describe("Content language"),
        isDefault: z.literal(true).optional().describe("Set as default brand identity"),
      },
    },
    async ({ brandIdentityId, ...body }) => {
      return handleError(() => client.updateBrandIdentity(brandIdentityId, body));
    },
  );

  server.registerTool(
    "delete_brand_identity",
    {
      description: "Delete a brand identity. Returns any schedules or events that were disabled as a result.",
      annotations: { title: "Delete Brand Identity", destructiveHint: true, idempotentHint: true },
      inputSchema: {
        brandIdentityId: z.string().min(1).describe("The brand identity ID to delete"),
      },
    },
    async ({ brandIdentityId }) => {
      return handleError(() => client.deleteBrandIdentity(brandIdentityId));
    },
  );

  server.registerTool(
    "generate_brand_identity",
    {
      description:
        "Queue async brand identity generation from a website URL. Notra will scrape the site and extract brand info. Use get_brand_identity_generation_status to poll for completion.",
      annotations: { title: "Generate Brand Identity", destructiveHint: false },
      inputSchema: {
        websiteUrl: z.string().min(1).describe("Website URL to analyze for brand identity extraction"),
        name: z.string().min(1).max(120).optional().describe("Name for the brand identity (1-120 characters)"),
      },
    },
    async (params) => {
      return handleError(() => client.generateBrandIdentity(params));
    },
  );

  server.registerTool(
    "get_brand_identity_generation_status",
    {
      description: "Check the status of an async brand identity generation job",
      annotations: { title: "Get Brand Identity Generation Status", readOnlyHint: true },
      inputSchema: {
        jobId: z.string().min(1).describe("The generation job ID to check"),
      },
    },
    async ({ jobId }) => {
      return handleError(() => client.getBrandIdentityGenerationStatus(jobId));
    },
  );
}
