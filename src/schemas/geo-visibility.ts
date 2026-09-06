import * as z from "zod";
import { geoShortTextSchema, geoWindowShape, projectIdSchema } from "./geo-fields.js";

export const getGeoVisibilityOverviewSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoVisibilityTimeseriesSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoPromptResultsSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoCompetitorShareSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoLanguageShareSchema = z.object({
  projectId: projectIdSchema,
  ...geoWindowShape,
});

export const getGeoCompetitorDetailSchema = z.object({
  projectId: projectIdSchema,
  brand: geoShortTextSchema.describe("Competitor brand name as reported by get_geo_competitor_share"),
  ...geoWindowShape,
});
