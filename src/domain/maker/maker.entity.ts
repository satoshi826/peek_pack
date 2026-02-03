/**
 * Maker Entity
 * ドメイン層: メーカー情報の型定義
 */

import { z } from "zod";

export const MakerSchema = z.object({
  id: z.string(),
  name: z.string(), // "Sony", "Canon", "Nikon" 等
  nameJa: z.string().optional(), // "ソニー", "キヤノン", "ニコン" 等
  website: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Maker = z.infer<typeof MakerSchema>;

export const CreateMakerInputSchema = MakerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateMakerInput = z.infer<typeof CreateMakerInputSchema>;

export const UpdateMakerInputSchema = CreateMakerInputSchema.partial();
export type UpdateMakerInput = z.infer<typeof UpdateMakerInputSchema>;
