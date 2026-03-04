import { db } from '@/db'
import { userBookmarks } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import type { CreateUserBookmarkInput } from '@/db/validation'

export async function findBookmarkedUsers(userId: string) {
  return db.select().from(userBookmarks).where(eq(userBookmarks.userId, userId))
}

export async function findBookmarkers(targetUserId: string) {
  return db.select().from(userBookmarks).where(eq(userBookmarks.targetUserId, targetUserId))
}

export async function createUserBookmark(input: CreateUserBookmarkInput) {
  const [bookmark] = await db.insert(userBookmarks).values({
    id: crypto.randomUUID(),
    ...input,
  }).returning()
  return bookmark
}

export async function deleteUserBookmark(userId: string, targetUserId: string) {
  await db.delete(userBookmarks).where(
    and(eq(userBookmarks.userId, userId), eq(userBookmarks.targetUserId, targetUserId)),
  )
}

export async function isBookmarked(userId: string, targetUserId: string) {
  const [result] = await db.select().from(userBookmarks).where(
    and(eq(userBookmarks.userId, userId), eq(userBookmarks.targetUserId, targetUserId)),
  )
  return !!result
}

export async function countBookmarks(userId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(userBookmarks)
    .where(eq(userBookmarks.userId, userId))
  return result?.count ?? 0
}
