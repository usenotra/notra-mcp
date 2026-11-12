import * as z from "zod";
import { LANGUAGE_VALUES } from "../constants/brand-identity.js";

export const listBrandIdentitiesSchema = z.object({});

export const getBrandIdentitySchema = z.object({
  brandIdentityId: z
    .string()
    .min(1)
    .describe("ID of the brand identity to fetch, as returned by list_brand_identities"),
});

export const updateBrandIdentitySchema = z.object({
  brandIdentityId: z
    .string()
    .min(1)
    .describe("ID of the brand identity to change, as returned by list_brand_identities"),
  name: z.string().min(1).max(120).optional().describe("Label for the brand identity shown in Notra"),
  websiteUrl: z.string().min(1).optional().describe("The brand's website address, such as https://example.com"),
  companyName: z
    .string()
    .min(1)
    .max(200)
    .optional()
    .nullable()
    .describe("Company or product name that content should use. null clears it."),
  companyDescription: z
    .string()
    .min(10)
    .max(4000)
    .optional()
    .nullable()
    .describe("What the company does, used as background when writing content. null clears it."),
  toneProfile: z
    .enum(["Conversational", "Professional", "Casual", "Formal"])
    .optional()
    .nullable()
    .describe(
      "Preset writing tone for generated content; use customTone for anything the presets do not cover. null clears it.",
    ),
  customTone: z
    .string()
    .max(1000)
    .optional()
    .nullable()
    .describe("Free-text description of the writing tone, such as warm and direct with no jargon. null clears it."),
  customInstructions: z
    .string()
    .max(4000)
    .optional()
    .nullable()
    .describe(
      "Extra rules the writer follows for every post in this brand identity, such as words to avoid. null clears them.",
    ),
  audience: z
    .string()
    .min(10)
    .max(1000)
    .optional()
    .nullable()
    .describe("Who the content is written for, such as backend engineers at startups. null clears it."),
  language: z
    .enum(LANGUAGE_VALUES)
    .optional()
    .nullable()
    .describe("Language that generated content is written in. null clears it."),
  isDefault: z
    .literal(true)
    .optional()
    .describe(
      "Pass true to make this the organization's default brand identity, used when a tool or schedule names none. false is not accepted; to move the default, set it on another identity.",
    ),
});

export const deleteBrandIdentitySchema = z.object({
  brandIdentityId: z
    .string()
    .min(1)
    .describe("ID of the brand identity to delete, as returned by list_brand_identities"),
});

const brandColorRoleSchema = z
  .enum(["primary", "secondary", "accent", "background", "foreground", "neutral", "custom"])
  .describe("What the color is used for in the brand");
const hexColorSchema = z
  .string()
  .regex(/^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i, "Must be a hex color like #13A0DC");
const brandColorFields = {
  role: brandColorRoleSchema.optional(),
  name: z
    .string()
    .max(120)
    .optional()
    .nullable()
    .describe(
      "Human-readable color name, such as Electric Blue. When creating, omit it for an unnamed color; when updating, omit it to keep the current name or pass null to clear it.",
    ),
  darkValue: hexColorSchema
    .optional()
    .nullable()
    .describe(
      "Hex color used in dark mode when it differs from lightValue. When creating, omit it if there is no dark-mode variant; when updating, omit it to keep the current value or pass null to clear it.",
    ),
  usage: z.string().max(240).optional().nullable().describe("Where the color is used, e.g. Primary buttons"),
};

export const listBrandColorsSchema = z.object({
  brandIdentityId: z
    .string()
    .min(1)
    .describe("ID of the brand identity whose colors to list, as returned by list_brand_identities"),
});

export const createBrandColorSchema = z.object({
  brandIdentityId: z
    .string()
    .min(1)
    .describe("ID of the brand identity to add the color to, as returned by list_brand_identities"),
  lightValue: hexColorSchema.describe("Hex value used in light mode"),
  ...brandColorFields,
});

export const updateBrandColorSchema = z.object({
  brandIdentityId: z
    .string()
    .min(1)
    .describe("ID of the brand identity the color belongs to, as returned by list_brand_identities"),
  colorId: z.string().min(1).describe("ID of the color to change, as returned by list_brand_colors"),
  lightValue: hexColorSchema.optional().describe("Hex value used in light mode"),
  ...brandColorFields,
});

export const deleteBrandColorSchema = z.object({
  brandIdentityId: z
    .string()
    .min(1)
    .describe("ID of the brand identity the color belongs to, as returned by list_brand_identities"),
  colorId: z.string().min(1).describe("ID of the color to delete, as returned by list_brand_colors"),
});

export const generateBrandIdentitySchema = z.object({
  websiteUrl: z
    .string()
    .min(1)
    .describe("Public website Notra reads to infer the company, tone and audience, such as https://example.com"),
  name: z.string().min(1).max(120).optional().describe("Label for the new brand identity shown in Notra"),
});

export const getBrandIdentityGenerationStatusSchema = z.object({
  jobId: z.string().min(1).describe("The generation job ID to check"),
});
