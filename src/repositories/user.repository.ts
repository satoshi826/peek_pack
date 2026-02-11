/**
 * User Repository Interface
 * ドメイン層: ユーザーのリポジトリインターフェース
 */

import type { User, CreateUserInput, UpdateUserInput } from '@/domain/user/user.entity'

export interface UserRepository {

  /**
     * 全ユーザーを取得
     */
  findAll(): Promise<User[]>

  /**
     * IDでユーザーを取得
     */
  findById(id: string): Promise<User | null>

  /**
     * メールアドレスでユーザーを取得
     */
  findByEmail(email: string): Promise<User | null>

  /**
     * ユーザーを作成
     */
  create(input: CreateUserInput): Promise<User>

  /**
     * ユーザーを更新
     */
  update(id: string, input: UpdateUserInput): Promise<User>

  /**
     * ユーザーを削除
     */
  delete(id: string): Promise<void>
}
