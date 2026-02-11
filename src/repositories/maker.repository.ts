/**
 * Maker Repository Interface
 * ドメイン層: メーカーのリポジトリインターフェース
 */

import type { Maker, CreateMakerInput, UpdateMakerInput } from '@/domain/maker/maker.entity'

export interface MakerRepository {

  /**
     * 全てのメーカーを取得
     */
  findAll(): Promise<Maker[]>

  /**
     * IDでメーカーを取得
     */
  findById(id: string): Promise<Maker | null>

  /**
     * 名前で検索
     */
  findByName(name: string): Promise<Maker | null>

  /**
     * メーカーを作成（管理者用）
     */
  create(input: CreateMakerInput): Promise<Maker>

  /**
     * メーカーを更新（管理者用）
     */
  update(id: string, input: UpdateMakerInput): Promise<Maker>

  /**
     * メーカーを削除（管理者用）
     */
  delete(id: string): Promise<void>
}
