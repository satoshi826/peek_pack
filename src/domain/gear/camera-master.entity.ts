/**
 * Camera Master Entity
 * ドメイン層: カメラマスタデータの型定義
 */

import { z } from 'zod'

export const CameraSizeSchema = z.object({
  width: z.number(), // mm
  height: z.number(), // mm
  depth: z.number(), // mm
})

export const CameraMasterSchema = z.object({
  id: z.string(),
  name: z.string(),
  makerId: z.string(), // Makerエンティティへの参照
  releaseDate: z.date().optional(),
  sensorSize: z.string().optional(), // "フルサイズ", "APS-C", "マイクロフォーサーズ" 等
  lensMount: z.string().optional(), // "Sony E", "Canon RF", "Nikon Z" 等
  resolution: z.string().optional(), // "2420万画素" 等
  isCompact: z.boolean(),
  hasStabilization: z.boolean(),
  stabilizationStops: z.number().optional(), // 手ブレ補正段数
  weight: z.number().optional(), // グラム
  size: CameraSizeSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CameraMaster = z.infer<typeof CameraMasterSchema>

export const CreateCameraMasterInputSchema = CameraMasterSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type CreateCameraMasterInput = z.infer<typeof CreateCameraMasterInputSchema>

export const UpdateCameraMasterInputSchema = CreateCameraMasterInputSchema.partial()
export type UpdateCameraMasterInput = z.infer<typeof UpdateCameraMasterInputSchema>
