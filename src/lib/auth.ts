/**
 * Authentication utilities
 * 認証関連のユーティリティ
 *
 * TODO: 本格的な認証システムを実装する際は、NextAuth.js等を使用
 */

"use server";

import { UserFileRepository } from "@/infra/storage/file/user.repository";
import type { User } from "@/domain/user/user.entity";

const userRepo = new UserFileRepository();

/**
 * 現在ログイン中のユーザーを取得
 * TODO: 実際のセッション管理を実装
 */
export async function getCurrentUser(): Promise<User | null> {
  // 仮実装: 最初のユーザーを返す
  const users = await userRepo.findAll();
  return users[0] || null;
}

/**
 * ログイン中のユーザーIDを取得
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}
