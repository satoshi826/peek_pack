/**
 * User Gear Repository Interface
 * ドメイン層: ユーザーギアのリポジトリインターフェース
 */

import type { UserGear, CreateUserGearInput, UpdateUserGearInput, GearStatus, GearType } from '@/domain/gear/user-gear.entity'
import type { CameraMaster } from '@/domain/gear/camera-master.entity'
import type { LensMaster } from '@/domain/gear/lens-master.entity'

/**
 * マスタ情報を含むユーザーギア
 */
export type UserGearWithDetails = UserGear & {
  masterName?: string
  makerName?: string
  masterData?: CameraMaster | LensMaster
}

export interface UserGearRepository {

  /**
     * 特定ユーザーの全ギアを取得
     */
  findByUserId(userId: string): Promise<UserGear[]>

  /**
     * 特定ユーザーの全ギアを取得（マスタ情報を含む）
     */
  findByUserIdWithDetails(userId: string): Promise<UserGearWithDetails[]>

  /**
     * 特定ユーザーのギアをステータスでフィルタリング（マスタ情報を含む）
     */
  findByUserIdAndStatusWithDetails(userId: string, status: GearStatus): Promise<UserGearWithDetails[]>

  /**
     * IDでギアを取得（マスタ情報を含む）
     */
  findByIdWithDetails(id: string): Promise<UserGearWithDetails | null>

  /**
     * 特定ユーザーのギアをステータスでフィルタリング
     */
  findByUserIdAndStatus(userId: string, status: GearStatus): Promise<UserGear[]>

  /**
     * 特定のマスタギアを持っているユーザーのギア一覧
     */
  findByMasterId(masterId: string, gearType: GearType): Promise<UserGear[]>

  /**
     * IDでギアを取得
     */
  findById(id: string): Promise<UserGear | null>

  /**
     * ギアを作成
     */
  create(input: CreateUserGearInput): Promise<UserGear>

  /**
     * ギアを更新
     */
  update(id: string, input: UpdateUserGearInput): Promise<UserGear>

  /**
     * ギアを削除
     */
  delete(id: string): Promise<void>

  /**
     * 特定のマスタギアを持っているユーザー数を取得
     */
  countUsersByMasterId(masterId: string, gearType: GearType): Promise<number>
}
