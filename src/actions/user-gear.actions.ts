/**
 * User Gear Actions
 * Server Actions: ユーザーギアのエントリーポイント
 */

'use server'

import { UserGearFileRepository } from '@/infra/storage/file/user-gear.repository'
import { CameraMasterFileRepository } from '@/infra/storage/file/camera-master.repository'
import { LensMasterFileRepository } from '@/infra/storage/file/lens-master.repository'
import { MakerFileRepository } from '@/infra/storage/file/maker.repository'
import { revalidatePath } from 'next/cache'
import type { CreateUserGearInput } from '@/domain/gear/user-gear.entity'
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

/**
 * ギアを作成
 */
export async function createUserGear(input: CreateUserGearInput) {
  const gear = await userGearRepo.create(input)
  revalidatePath('/')
  return gear
}

/**
 * カメラマスタ一覧を取得（メーカー名付き）
 */
export async function getCameraMasters() {
  const cameras = await cameraMasterRepo.findAll()
  const makers = await makerRepo.findAll()
  const makerMap = new Map(makers.map(m => [m.id, m.name]))
  return cameras.map(c => ({
    id: c.id,
    name: c.name,
    makerName: makerMap.get(c.makerId) ?? '不明',
  }))
}

/**
 * レンズマスタ一覧を取得（メーカー名付き）
 */
export async function getLensMasters() {
  const lenses = await lensMasterRepo.findAll()
  const makers = await makerRepo.findAll()
  const makerMap = new Map(makers.map(m => [m.id, m.name]))
  return lenses.map(l => ({
    id: l.id,
    name: l.name,
    makerName: makerMap.get(l.makerId) ?? '不明',
  }))
}
