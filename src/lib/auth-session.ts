'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { findUserById } from '@/db/queries/user'

export type SessionUser = {
  id: string
  username: string | null
  name: string
  email: string
  profileImage: string | null
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export async function getCurrentUser(): Promise<SessionUser | null> {
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
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.user?.id ?? null
}
