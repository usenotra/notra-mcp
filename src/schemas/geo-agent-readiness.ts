import * as z from "zod";
import { projectIdSchema } from "./geo-fields.js";

export const getGeoAgentReadinessSchema = z.object({
  projectId: projectIdSchema,
});

export const startGeoAgentReadinessScanSchema = z.object({
  projectId: projectIdSchema,
});
