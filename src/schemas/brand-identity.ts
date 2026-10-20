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

const brandColorRoleSchema = z
  .enum(["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"])
  .describe("What the color is used for in the brand");
const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i, "Must be a hex color like #13A0DC");
const brandColorFields = {
  role: brandColorRoleSchema.optional(),
  name: z.string().max(120).optional().nullable().describe("Display name, e.g. Electric Blue"),
  darkValue: hexColorSchema.optional().nullable().describe("Hex value used in dark mode"),
  usage: z.string().max(240).optional().nullable().describe("Where the color is used, e.g. Primary buttons"),
};

export const listBrandColorsSchema = z.object({
  brandIdentityId: z.string().min(1).describe("The brand identity ID whose colors to list"),
});

export const createBrandColorSchema = z.object({
  brandIdentityId: z.string().min(1).describe("The brand identity ID to add the color to"),
  lightValue: hexColorSchema.describe("Hex value used in light mode"),
  ...brandColorFields,
});

export const updateBrandColorSchema = z.object({
  brandIdentityId: z.string().min(1).describe("The brand identity ID the color belongs to"),
  colorId: z.string().min(1).describe("The color ID to update"),
  lightValue: hexColorSchema.optional().describe("Hex value used in light mode"),
  ...brandColorFields,
});

export const deleteBrandColorSchema = z.object({
  brandIdentityId: z.string().min(1).describe("The brand identity ID the color belongs to"),
  colorId: z.string().min(1).describe("The color ID to delete"),
});

export const generateBrandIdentitySchema = z.object({
  websiteUrl: z.string().min(1).describe("Website URL to analyze for brand identity extraction"),
  name: z.string().min(1).max(120).optional().describe("Name for the brand identity (1-120 characters)"),
});

export const getBrandIdentityGenerationStatusSchema = z.object({
  jobId: z.string().min(1).describe("The generation job ID to check"),
});
