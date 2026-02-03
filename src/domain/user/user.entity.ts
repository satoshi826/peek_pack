/**
 * User Entity
 * ドメイン層: ユーザー情報の型定義
 */

import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  profileImage: z.string(),
  bio: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserInputSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export const UpdateUserInputSchema = UserSchema.omit({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
}).partial();
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
