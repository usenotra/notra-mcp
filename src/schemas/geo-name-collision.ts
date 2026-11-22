import * as z from "zod";
import { geoResourceIdSchema, geoShortTextSchema, projectIdSchema } from "./geo-fields.js";

export const listGeoNameCollisionsSchema = z.object({
  projectId: projectIdSchema,
});

export const addGeoNameCollisionSchema = z.object({
  projectId: projectIdSchema,
  name: geoShortTextSchema.describe("Name of the other product, usually the same as the brand's, such as Acme"),
  domain: geoShortTextSchema.describe("Domain of the other product, such as acme.io"),
});

export const geoNameCollisionIdSchema = z.object({
  projectId: projectIdSchema,
  collisionId: geoResourceIdSchema.describe("Entry ID from list_geo_name_collisions"),
});
