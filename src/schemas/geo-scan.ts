import * as z from "zod";
import { geoResourceIdSchema, projectIdSchema } from "./geo-fields.js";

export const createGeoScanSchema = z.object({
  projectId: projectIdSchema,
});

export const listGeoScansSchema = z.object({
  projectId: projectIdSchema,
  limit: z.number().int().min(1).max(100).optional().describe("Items per page (1-100, default 20)"),
  page: z.number().int().min(1).optional().describe("Page number (default 1)"),
});

export const getGeoScanSchema = z.object({
  projectId: projectIdSchema,
  scanId: geoResourceIdSchema.describe("The scan ID to retrieve"),
});
