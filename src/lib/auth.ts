'use server'

import { findAllUsers } from '@/db/queries/user'
import type { User } from '@/db/validation'

export async function getCurrentUser(): Promise<User | null> {
  // 仮実装: 最初のユーザーを返す
  const users = await findAllUsers()
  return users[0] || null
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.id || null
}
