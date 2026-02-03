/**
 * User Gear Entity
 * ドメイン層: ユーザーが所有・管理するギアの型定義
 */

import { z } from "zod";

export const GearTypeSchema = z.enum(["camera", "lens"]);
export type GearType = z.infer<typeof GearTypeSchema>;

export const GearStatusSchema = z.enum(["owned", "wanted", "previously-owned"]);
export type GearStatus = z.infer<typeof GearStatusSchema>;

export const UserGearSchema = z.object({
  id: z.string(),
  userId: z.string(),
  gearType: GearTypeSchema,
  masterId: z.string().optional(), // マスタIDまたはnull（カスタム登録の場合）
  customName: z.string().optional(), // マスタに存在しない場合のカスタム名
  customMaker: z.string().optional(), // カスタム登録時のメーカー名
  status: GearStatusSchema,
  comment: z.string().optional(), // 所有ギアへのコメント
  photos: z.array(z.string()).optional(), // 写真URL（最大10枚）
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserGear = z.infer<typeof UserGearSchema>;

export const CreateUserGearInputSchema = UserGearSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateUserGearInput = z.infer<typeof CreateUserGearInputSchema>;

export const UpdateUserGearInputSchema = UserGearSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
}).partial();
export type UpdateUserGearInput = z.infer<typeof UpdateUserGearInputSchema>;

/**
 * マスタから登録する場合のヘルパースキーマ
 */
export const CreateUserGearFromMasterInputSchema = z.object({
  userId: z.string(),
  gearType: GearTypeSchema,
  masterId: z.string(),
  status: GearStatusSchema,
  comment: z.string().optional(),
  photos: z.array(z.string()).optional(),
});
export type CreateUserGearFromMasterInput = z.infer<typeof CreateUserGearFromMasterInputSchema>;

/**
 * カスタム登録する場合のヘルパースキーマ
 */
export const CreateUserGearCustomInputSchema = z.object({
  userId: z.string(),
  gearType: GearTypeSchema,
  customName: z.string(),
  customMaker: z.string(),
  status: GearStatusSchema,
  comment: z.string().optional(),
  photos: z.array(z.string()).optional(),
});
export type CreateUserGearCustomInput = z.infer<typeof CreateUserGearCustomInputSchema>;
