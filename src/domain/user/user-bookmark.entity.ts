/**
 * User Bookmark Entity
 * ドメイン層: ユーザーブックマークの型定義
 */

import { z } from "zod";

export const UserBookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(), // ブックマークした人
  targetUserId: z.string(), // ブックマークされた人
  createdAt: z.date(),
});

export type UserBookmark = z.infer<typeof UserBookmarkSchema>;

export const CreateUserBookmarkInputSchema = UserBookmarkSchema.omit({
  id: true,
  createdAt: true,
});
export type CreateUserBookmarkInput = z.infer<typeof CreateUserBookmarkInputSchema>;
