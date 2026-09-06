import * as z from "zod";
import { LANGUAGE_VALUES } from "../constants/brand-identity.js";

export const listBrandIdentitiesSchema = z.object({});

export const getBrandIdentitySchema = z.object({
  brandIdentityId: z.string().min(1).describe("The brand identity ID to retrieve"),
});

export const updateBrandIdentitySchema = z.object({
  brandIdentityId: z.string().min(1).describe("The brand identity ID to update"),
  name: z.string().min(1).max(120).optional().describe("Brand identity name (1-120 characters)"),
  websiteUrl: z.string().min(1).optional().describe("Website URL"),
  companyName: z.string().min(1).max(200).optional().nullable().describe("Company name"),
  companyDescription: z.string().min(10).max(4000).optional().nullable().describe("Company description (min 10 chars)"),
  toneProfile: z
    .enum(["Conversational", "Professional", "Casual", "Formal"])
    .optional()
    .nullable()
    .describe("Tone profile preset"),
  customTone: z.string().max(1000).optional().nullable().describe("Custom tone description"),
  customInstructions: z.string().max(4000).optional().nullable().describe("Custom instructions for content generation"),
  audience: z.string().min(10).max(1000).optional().nullable().describe("Target audience description (min 10 chars)"),
  language: z.enum(LANGUAGE_VALUES).optional().nullable().describe("Content language"),
  isDefault: z.literal(true).optional().describe("Set as default brand identity"),
});

export const deleteBrandIdentitySchema = z.object({
  brandIdentityId: z.string().min(1).describe("The brand identity ID to delete"),
});

export const generateBrandIdentitySchema = z.object({
  websiteUrl: z.string().min(1).describe("Website URL to analyze for brand identity extraction"),
  name: z.string().min(1).max(120).optional().describe("Name for the brand identity (1-120 characters)"),
});

export const getBrandIdentityGenerationStatusSchema = z.object({
  jobId: z.string().min(1).describe("The generation job ID to check"),
});
