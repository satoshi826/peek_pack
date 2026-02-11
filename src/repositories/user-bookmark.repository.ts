/**
 * User Bookmark Repository Interface
 * ドメイン層: ユーザーブックマークのリポジトリインターフェース
 */

import type { UserBookmark, CreateUserBookmarkInput } from '@/domain/user/user-bookmark.entity'

export interface UserBookmarkRepository {

  /**
     * 特定ユーザーがブックマークしたユーザー一覧
     */
  findBookmarkedUsers(userId: string): Promise<UserBookmark[]>

  /**
     * 特定ユーザーをブックマークしているユーザー一覧（本人のみ閲覧可能）
     */
  findBookmarkers(targetUserId: string): Promise<UserBookmark[]>

  /**
     * ブックマークを作成
     */
  create(input: CreateUserBookmarkInput): Promise<UserBookmark>

  /**
     * ブックマークを削除
     */
  delete(userId: string, targetUserId: string): Promise<void>

  /**
     * ブックマーク済みかチェック
     */
  isBookmarked(userId: string, targetUserId: string): Promise<boolean>

  /**
     * 特定ユーザーのブックマーク数を取得（本人のみ）
     */
  countBookmarks(userId: string): Promise<number>
}
