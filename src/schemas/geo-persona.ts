import * as z from "zod";
import {
  GEO_PERSONA_BRIEF_MAX_LENGTH,
  GEO_PERSONA_FIELD_MAX_LENGTH,
  GEO_PERSONA_PROFILE_LIST_MAX,
  GEO_PERSONA_SUMMARY_MAX_LENGTH,
} from "../constants/geo.js";
import { geoResourceIdSchema, geoWindowShape, projectIdSchema } from "./geo-fields.js";

const personaIdSchema = geoResourceIdSchema.describe("The persona ID (see list_geo_personas)");

const personaFieldSchema = z.string().trim().min(1).max(GEO_PERSONA_FIELD_MAX_LENGTH);
const personaSummarySchema = z.string().trim().min(1).max(GEO_PERSONA_SUMMARY_MAX_LENGTH);
const personaProfileListSchema = z.array(personaFieldSchema).max(GEO_PERSONA_PROFILE_LIST_MAX);

export const listGeoPersonasSchema = z.object({
  projectId: projectIdSchema,
});

export const updateGeoPersonaSchema = z
  .object({
    projectId: projectIdSchema,
    personaId: personaIdSchema,
    enabled: z.boolean().optional().describe("Whether scheduled scans play this persona"),
    name: personaFieldSchema.optional().describe("Buyer archetype label, such as Budgeter (1-200 characters)"),
    role: personaFieldSchema
      .regex(/^\S+(?:\s+\S+)?$/, "Use at most two words")
      .optional()
      .describe("Job title, at most two words"),
    company: personaFieldSchema.optional().describe("Company profile (1-200 characters)"),
    summary: personaSummarySchema.optional().describe("Motivations and background (1-800 characters)"),
    searchStyle: personaSummarySchema.optional().describe("How the persona searches (1-800 characters)"),
    profile: z
      .object({
        goals: personaProfileListSchema.optional(),
        painPoints: personaProfileListSchema.optional(),
        currentStack: personaProfileListSchema.optional(),
        buyingTriggers: personaProfileListSchema.optional(),
        objections: personaProfileListSchema.optional(),
      })
      .refine((lists) => Object.values(lists).some((list) => list !== undefined), {
        message: "Provide at least one profile list to replace",
      })
      .optional()
      .describe("Profile lists to replace (up to 6 entries each). Omitted lists keep their value."),
  })
  .refine(
    ({ enabled, name, role, company, summary, searchStyle, profile }) =>
      [enabled, name, role, company, summary, searchStyle, profile].some((value) => value !== undefined),
    { message: "Provide at least one field to update" },
  );

export const archiveGeoPersonaSchema = z.object({
  projectId: projectIdSchema,
  personaId: personaIdSchema,
});

export const restoreGeoPersonaSchema = z.object({
  projectId: projectIdSchema,
  personaId: personaIdSchema,
});

export const getGeoPersonaResultsSchema = z.object({
  projectId: projectIdSchema,
  personaId: personaIdSchema,
  scanId: geoResourceIdSchema
    .optional()
    .describe("Scan to read. Defaults to the latest scan that played this persona; ids are listed in `scans`."),
});

export const getGeoPersonaActivitySchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const runGeoPersonaSchema = z.object({
  projectId: projectIdSchema,
  personaId: personaIdSchema,
});

export const generateGeoPersonasSchema = z
  .object({
    projectId: projectIdSchema,
    personaId: geoResourceIdSchema
      .optional()
      .describe("Regenerate this persona in place, replacing its details, instead of creating a new set"),
    brief: z
      .string()
      .trim()
      .min(1)
      .max(GEO_PERSONA_BRIEF_MAX_LENGTH)
      .optional()
      .describe("Describe one persona to add, such as 'a CFO at a 200-person logistics company'"),
    promptsOnly: z
      .literal(true)
      .optional()
      .describe("With personaId, only rewrite its conversation prompts and keep its details"),
  })
  .refine(({ personaId, brief }) => !(personaId && brief), { message: "Choose a persona or a brief, not both" })
  .refine(({ personaId, promptsOnly }) => !promptsOnly || Boolean(personaId), {
    message: "A persona is required when generating prompts only",
    path: ["personaId"],
  });

export const getGeoPersonaGenerationSchema = z.object({
  projectId: projectIdSchema,
});
