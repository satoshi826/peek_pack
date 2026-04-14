import { cache } from 'react'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { findUserById } from '@/db/queries/user'

export type SessionUser = {
  id: string
  username: string | null
  name: string
  email: string
  profileImage: string | null
  bio: string | null
}

export const getSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await getSession()
  if (!session?.user) return null

  const user = await findUserById(session.user.id)
  if (!user) return null

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    bio: user.bio,
  }
})

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.user?.id ?? null
}
