/**
 * Lens Master Repository Interface
 * ドメイン層: レンズマスタのリポジトリインターフェース
 */

import type { LensMaster, CreateLensMasterInput, UpdateLensMasterInput } from '@/domain/gear/lens-master.entity'
import type { FocusType } from '@/domain/gear/lens-master.entity'

export interface LensSearchFilters {
  query?: string
  makerId?: string
  lensMount?: string
  focalLength?: string
  maxAperture?: string
  focusType?: FocusType
}

export interface LensDistinctValues {
  lensMounts: string[]
  focalLengths: string[]
  maxApertures: string[]
  focusTypes: string[]
}

export interface LensMasterRepository {

  /**
     * 全てのレンズマスタを取得
     */
  findAll(): Promise<LensMaster[]>

  /**
     * IDでレンズマスタを取得
     */
  findById(id: string): Promise<LensMaster | null>

  /**
     * メーカーIDでフィルタリング
     */
  findByMakerId(makerId: string): Promise<LensMaster[]>

  /**
     * 名前で検索（部分一致）
     */
  search(keyword: string): Promise<LensMaster[]>

  /**
     * フィルタ条件付き検索
     */
  searchWithFilters(params: LensSearchFilters): Promise<LensMaster[]>

  /**
     * フィルタ選択肢用のユニーク値を取得
     */
  getDistinctValues(): Promise<LensDistinctValues>

  /**
     * レンズマスタを作成（管理者用）
     */
  create(input: CreateLensMasterInput): Promise<LensMaster>

  /**
     * レンズマスタを更新（管理者用）
     */
  update(id: string, input: UpdateLensMasterInput): Promise<LensMaster>

  /**
     * レンズマスタを削除（管理者用）
     */
  delete(id: string): Promise<void>
}
