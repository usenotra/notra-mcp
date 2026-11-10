import * as z from "zod";
import {
  GEO_PERSONA_BRIEF_MAX_LENGTH,
  GEO_PERSONA_FIELD_MAX_LENGTH,
  GEO_PERSONA_PROFILE_LIST_MAX,
  GEO_PERSONA_SUMMARY_MAX_LENGTH,
} from "../constants/geo.js";
import { geoResourceIdSchema, geoWindowShape, projectIdSchema } from "./geo-fields.js";

const personaIdSchema = geoResourceIdSchema.describe("ID of the GEO persona to act on. Get it from list_geo_personas.");

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
    enabled: z
      .boolean()
      .optional()
      .describe("true to play this persona in scheduled scans, false to skip it. Omit to keep the current state."),
    name: personaFieldSchema.optional().describe("Short buyer archetype label shown for the persona, such as Budgeter"),
    role: personaFieldSchema
      .regex(/^\S+(?:\s+\S+)?$/, "Use at most two words")
      .optional()
      .describe("Job title the persona holds, such as CFO or Growth Lead"),
    company: personaFieldSchema
      .optional()
      .describe("Kind of company the persona works at, such as a 200-person logistics company"),
    summary: personaSummarySchema
      .optional()
      .describe("Background and motivations that shape what the persona asks AI assistants"),
    searchStyle: personaSummarySchema
      .optional()
      .describe("How the persona phrases questions and researches options when asking AI assistants"),
    profile: z
      .object({
        goals: personaProfileListSchema
          .optional()
          .describe("Outcomes the persona wants to achieve, one per entry. Replaces the stored goals."),
        painPoints: personaProfileListSchema
          .optional()
          .describe("Problems the persona has today, one per entry. Replaces the stored pain points."),
        currentStack: personaProfileListSchema
          .optional()
          .describe("Tools or vendors the persona uses now, one per entry. Replaces the stored stack."),
        buyingTriggers: personaProfileListSchema
          .optional()
          .describe(
            "Events that make the persona start looking for a solution, one per entry. Replaces the stored list.",
          ),
        objections: personaProfileListSchema
          .optional()
          .describe("Reasons the persona might hesitate to buy, one per entry. Replaces the stored objections."),
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
      .describe(
        "Set with personaId to rewrite only that persona's conversation prompts and keep its profile. Omit to regenerate the whole persona.",
      ),
  })
  .refine(({ personaId, brief }) => !(personaId && brief), { message: "Choose a persona or a brief, not both" })
  .refine(({ personaId, promptsOnly }) => !promptsOnly || Boolean(personaId), {
    message: "A persona is required when generating prompts only",
    path: ["personaId"],
  });

export const getGeoPersonaGenerationSchema = z.object({
  projectId: projectIdSchema,
});
