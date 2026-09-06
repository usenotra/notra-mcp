import * as z from "zod";

export const geoResourceIdSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[A-Za-z0-9_-]{1,100}$/);

export const projectIdSchema = geoResourceIdSchema.describe("The GEO project ID (see list_projects)");

export const geoDaySchema = z.iso.date("Expected a valid YYYY-MM-DD date");

export const geoWindowShape = {
  days: z
    .number()
    .int()
    .min(1)
    .max(365)
    .optional()
    .describe("Rolling window size in days. Ignored when from/to are set."),
  from: geoDaySchema.optional().describe("Window start date (YYYY-MM-DD)"),
  to: geoDaySchema.optional().describe("Window end date (YYYY-MM-DD)"),
};

export const geoPromptTextSchema = z.string().trim().min(8).max(300);

export const geoShortTextSchema = z.string().trim().min(1).max(128);
