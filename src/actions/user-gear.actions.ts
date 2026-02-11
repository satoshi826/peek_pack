/**
 * User Gear Actions
 * Server Actions: ユーザーギアのエントリーポイント
 */

'use server'

import { UserGearFileRepository } from '@/infra/storage/file/user-gear.repository'
import { CameraMasterFileRepository } from '@/infra/storage/file/camera-master.repository'
import { LensMasterFileRepository } from '@/infra/storage/file/lens-master.repository'
import { MakerFileRepository } from '@/infra/storage/file/maker.repository'
import type { UserGearWithDetails } from '@/repositories/user-gear.repository'

// リポジトリのインスタンス化
const cameraMasterRepo = new CameraMasterFileRepository()
const lensMasterRepo = new LensMasterFileRepository()
const makerRepo = new MakerFileRepository()
const userGearRepo = new UserGearFileRepository(
  cameraMasterRepo,
  lensMasterRepo,
  makerRepo,
)

/**
 * 特定ユーザーのギア一覧を取得（マスタ情報を含む）
 */
export async function getUserGears(userId: string): Promise<UserGearWithDetails[]> {
  return userGearRepo.findByUserIdWithDetails(userId)
}

/**
 * 特定ユーザーの所有ギア一覧を取得
 */
export async function getUserOwnedGears(userId: string): Promise<UserGearWithDetails[]> {
  return userGearRepo.findByUserIdAndStatusWithDetails(
    userId,
    'owned',
  )
}

/**
 * 特定ユーザーの欲しいギア一覧を取得
 */
export async function getUserWantedGears(userId: string): Promise<UserGearWithDetails[]> {
  return userGearRepo.findByUserIdAndStatusWithDetails(
    userId,
    'wanted',
  )
}

/**
 * 特定ユーザーの以前所有していたギア一覧を取得
 */
export async function getUserPreviouslyOwnedGears(userId: string): Promise<UserGearWithDetails[]> {
  return userGearRepo.findByUserIdAndStatusWithDetails(
    userId,
    'previously-owned',
  )
}

/**
 * ギアをIDで取得
 */
export async function getUserGearById(id: string): Promise<UserGearWithDetails | null> {
  return userGearRepo.findByIdWithDetails(id)
}
