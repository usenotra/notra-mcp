import * as z from "zod";
import { geoResourceIdSchema, projectIdSchema } from "./geo-fields.js";

export const createGeoScanSchema = z.object({
  projectId: projectIdSchema,
});

export const listGeoScansSchema = z.object({
  projectId: projectIdSchema,
  limit: z.number().int().min(1).max(100).optional().describe("Number of scans per page. Omit for 20."),
  page: z
    .number()
    .int()
    .min(1)
    .optional()
    .describe("Page to return; use pagination.nextPage from the previous response. Omit for the first page."),
});

export const getGeoScanSchema = z.object({
  projectId: projectIdSchema,
  scanId: geoResourceIdSchema.describe(
    "ID of the scan, as returned by create_geo_scan, rescan_geo_prompt or list_geo_scans",
  ),
});

export const rescanGeoPromptSchema = z.object({
  projectId: projectIdSchema,
  promptId: geoResourceIdSchema.describe("ID of an enabled tracked prompt, from list_geo_prompts"),
});
