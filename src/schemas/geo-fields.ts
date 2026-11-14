import * as z from "zod";

export const geoResourceIdSchema = z
  .string()
  .trim()
  .min(1)
  .regex(/^[A-Za-z0-9_-]{1,100}$/);

export const projectIdSchema = geoResourceIdSchema.describe(
  "ID of the GEO project to work in. Get it from list_projects.",
);

export const geoDaySchema = z.iso.date("Expected a valid YYYY-MM-DD date");

export const geoWindowShape = {
  days: z
    .number()
    .int()
    .min(1)
    .max(365)
    .optional()
    .describe(
      "Rolling reporting window in days. Ignored when from is set. Omit days and from to use the default window stated in the tool description.",
    ),
  from: geoDaySchema
    .optional()
    .describe("First day of a fixed reporting window. Set it together with to; it replaces the rolling days window."),
  to: geoDaySchema
    .optional()
    .describe("Last day of a fixed reporting window. Set it together with from; it replaces the rolling days window."),
};

export const geoPromptTextSchema = z.string().trim().min(8).max(300);

export const geoShortTextSchema = z.string().trim().min(1).max(128);
