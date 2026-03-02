/**
 * User Bookmark Drizzle Repository
 * インフラ層: ユーザーブックマークのDrizzle + Supabase実装
 */

import type { UserBookmark, CreateUserBookmarkInput } from '@/domain/user/user-bookmark.entity'
import type { UserBookmarkRepository } from '@/repositories/user-bookmark.repository'
import { db } from '@/db'
import { userBookmarks } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'

export class UserBookmarkDrizzleRepository implements UserBookmarkRepository {
  async findBookmarkedUsers(userId: string): Promise<UserBookmark[]> {
    return db.select().from(userBookmarks).where(eq(userBookmarks.userId, userId))
  }

  async findBookmarkers(targetUserId: string): Promise<UserBookmark[]> {
    return db.select().from(userBookmarks).where(eq(userBookmarks.targetUserId, targetUserId))
  }

  async create(input: CreateUserBookmarkInput): Promise<UserBookmark> {
    const [bookmark] = await db.insert(userBookmarks).values({
      id: crypto.randomUUID(),
      ...input,
    }).returning()
    return bookmark
  }

  async delete(userId: string, targetUserId: string): Promise<void> {
    await db.delete(userBookmarks).where(
      and(eq(userBookmarks.userId, userId), eq(userBookmarks.targetUserId, targetUserId)),
    )
  }

  async isBookmarked(userId: string, targetUserId: string): Promise<boolean> {
    const [result] = await db.select().from(userBookmarks).where(
      and(eq(userBookmarks.userId, userId), eq(userBookmarks.targetUserId, targetUserId)),
    )
    return !!result
  }

  async countBookmarks(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(userBookmarks)
      .where(eq(userBookmarks.userId, userId))
    return result?.count ?? 0
  }
}
