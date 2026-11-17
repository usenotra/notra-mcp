import * as z from "zod";
import { GEO_MAX_ENGINES } from "../constants/geo.js";
import { geoResourceIdSchema, geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

const scanEnginesSchema = z
  .array(geoShortTextSchema)
  .min(1)
  .max(GEO_MAX_ENGINES)
  .optional()
  .describe(
    'Run only these answer engine IDs from list_geo_engines, for example ["openai/chatgpt"] for a single engine. An engine the project does not track can be tried once. Omit to run every tracked engine.',
  );

export const createGeoScanSchema = z.object({
  projectId: projectIdSchema,
  engines: scanEnginesSchema,
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
  engines: scanEnginesSchema,
});
