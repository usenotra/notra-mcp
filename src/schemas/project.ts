import * as z from "zod";
import { geoResourceIdSchema, geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const listProjectsSchema = z.object({});

export const getProjectSchema = z.object({
  projectId: projectIdSchema,
});

export const createProjectSchema = z.object({
  name: geoShortTextSchema.describe("Project name (1-128 characters)"),
  brandSettingsId: geoResourceIdSchema
    .optional()
    .describe("Brand identity ID to link (see list_brand_identities). Defaults to the default brand identity."),
  startScan: z
    .boolean()
    .optional()
    .describe(
      "Turn on recurring scans and start the first one now. Uses AI credits, so ask the user first. Defaults to false, which leaves tracking off until update_geo_settings sets enabled to true.",
    ),
});

export const updateProjectSchema = z
  .object({
    projectId: projectIdSchema,
    name: geoShortTextSchema.optional().describe("New project name (1-128 characters)"),
    brandSettingsId: geoResourceIdSchema.optional().describe("Brand identity ID to link"),
  })
  .refine(({ name, brandSettingsId }) => name !== undefined || brandSettingsId !== undefined, {
    message: "Provide at least one field to update",
  });

export const deleteProjectSchema = z.object({
  projectId: projectIdSchema,
});
