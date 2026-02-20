/**
 * Maker Entity
 * ドメイン層: メーカー情報の型定義
 */

import { z } from 'zod'

export const ProductTypeSchema = z.enum(['camera', 'lens'])
export type ProductType = z.infer<typeof ProductTypeSchema>

export const MakerSchema = z.object({
  id: z.string(),
  name: z.string(), // "Sony", "Canon", "Nikon" 等
  nameJa: z.string().optional(), // "ソニー", "キヤノン", "ニコン" 等
  website: z.string().optional(),
  productTypes: z.array(ProductTypeSchema), // ['camera', 'lens'] or ['camera'] or ['lens']
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Maker = z.infer<typeof MakerSchema>

export const CreateMakerInputSchema = MakerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type CreateMakerInput = z.infer<typeof CreateMakerInputSchema>

export const UpdateMakerInputSchema = CreateMakerInputSchema.partial()
export type UpdateMakerInput = z.infer<typeof UpdateMakerInputSchema>
