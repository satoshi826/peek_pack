/**
 * Lens Master Entity
 * ドメイン層: レンズマスタデータの型定義
 */

import { z } from "zod";

export const FocusTypeSchema = z.enum(["AF", "MF", "AF/MF"]);
export type FocusType = z.infer<typeof FocusTypeSchema>;

export const LensSizeSchema = z.object({
  diameter: z.number(), // mm
  length: z.number(), // mm
});

export const LensMasterSchema = z.object({
  id: z.string(),
  name: z.string(),
  makerId: z.string(), // Makerエンティティへの参照
  releaseDate: z.date().optional(),
  lensMount: z.string().optional(), // "Sony E", "Canon RF", "Nikon Z" 等
  focalLength: z.string().optional(), // "50mm", "24-70mm" 等
  maxAperture: z.string().optional(), // "F1.4", "F2.8" 等
  focusType: FocusTypeSchema,
  weight: z.number().optional(), // グラム
  size: LensSizeSchema.optional(),
  filterDiameter: z.number().optional(), // mm
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type LensMaster = z.infer<typeof LensMasterSchema>;

export const CreateLensMasterInputSchema = LensMasterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateLensMasterInput = z.infer<typeof CreateLensMasterInputSchema>;

export const UpdateLensMasterInputSchema = CreateLensMasterInputSchema.partial();
export type UpdateLensMasterInput = z.infer<typeof UpdateLensMasterInputSchema>;
