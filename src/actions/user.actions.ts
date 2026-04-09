'use server'

import { getCurrentUserId } from '@/lib/auth-session'
import { updateUser, deleteUser, findUserById, findUserByUsername, setUsername } from '@/db/queries/user'
import { revalidatePath } from 'next/cache'

const USERNAME_REGEX = /^[a-zA-Z0-9_.]{3,20}$/

export async function setupUsername(input: { username: string, name: string }) {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('認証が必要です')

  const user = await findUserById(userId)
  if (user?.username) return { error: 'ユーザー名は変更できません' }

  const username = input.username.toLowerCase()
  if (!USERNAME_REGEX.test(username)) {
    return { error: 'ユーザー名は英数字、アンダースコア、ピリオドで3〜20文字です' }
  }

  const existing = await findUserByUsername(username)
  if (existing) return { error: 'このユーザー名は既に使用されています' }

  await setUsername(userId, username)
  await updateUser(userId, { name: input.name })

  revalidatePath('/')
  return { success: true }
}

export async function updateProfile(input: {
  name: string
  profileImage?: string | null
  bio?: string | null
}) {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('認証が必要です')

  await updateUser(userId, {
    name: input.name,
    profileImage: input.profileImage ?? null,
    bio: input.bio ?? null,
  })

  revalidatePath('/')
  revalidatePath('/settings')
  return { success: true }
}

export async function deleteAccount() {
  const userId = await getCurrentUserId()
  if (!userId) throw new Error('認証が必要です')

  await deleteUser(userId)
  return { success: true }
}
