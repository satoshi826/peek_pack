/**
 * Camera Master Repository Interface
 * ドメイン層: カメラマスタのリポジトリインターフェース
 */

import type { CameraMaster, CreateCameraMasterInput, UpdateCameraMasterInput } from '@/domain/gear/camera-master.entity'

export interface CameraMasterRepository {

  /**
     * 全てのカメラマスタを取得
     */
  findAll(): Promise<CameraMaster[]>

  /**
     * IDでカメラマスタを取得
     */
  findById(id: string): Promise<CameraMaster | null>

  /**
     * メーカーIDでフィルタリング
     */
  findByMakerId(makerId: string): Promise<CameraMaster[]>

  /**
     * 名前で検索（部分一致）
     */
  search(keyword: string): Promise<CameraMaster[]>

  /**
     * カメラマスタを作成（管理者用）
     */
  create(input: CreateCameraMasterInput): Promise<CameraMaster>

  /**
     * カメラマスタを更新（管理者用）
     */
  update(id: string, input: UpdateCameraMasterInput): Promise<CameraMaster>

  /**
     * カメラマスタを削除（管理者用）
     */
  delete(id: string): Promise<void>
}
