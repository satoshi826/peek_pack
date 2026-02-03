/**
 * Lens Master Repository Interface
 * ドメイン層: レンズマスタのリポジトリインターフェース
 */

import type { LensMaster, CreateLensMasterInput, UpdateLensMasterInput } from "@/domain/gear/lens-master.entity";

export interface LensMasterRepository {
  /**
   * 全てのレンズマスタを取得
   */
  findAll(): Promise<LensMaster[]>;

  /**
   * IDでレンズマスタを取得
   */
  findById(id: string): Promise<LensMaster | null>;

  /**
   * メーカーIDでフィルタリング
   */
  findByMakerId(makerId: string): Promise<LensMaster[]>;

  /**
   * 名前で検索（部分一致）
   */
  search(keyword: string): Promise<LensMaster[]>;

  /**
   * レンズマスタを作成（管理者用）
   */
  create(input: CreateLensMasterInput): Promise<LensMaster>;

  /**
   * レンズマスタを更新（管理者用）
   */
  update(id: string, input: UpdateLensMasterInput): Promise<LensMaster>;

  /**
   * レンズマスタを削除（管理者用）
   */
  delete(id: string): Promise<void>;
}
