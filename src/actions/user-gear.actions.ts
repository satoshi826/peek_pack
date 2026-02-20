/**
 * User Gear Actions
 * Server Actions: ユーザーギアのエントリーポイント
 */

'use server'

import { UserGearFileRepository } from '@/infra/storage/file/user-gear.repository'
import { CameraMasterFileRepository } from '@/infra/storage/file/camera-master.repository'
import { LensMasterFileRepository } from '@/infra/storage/file/lens-master.repository'
import { MakerFileRepository } from '@/infra/storage/file/maker.repository'
import { matchTokens } from '@/lib/normalize-search'
import { revalidatePath } from 'next/cache'
import type { CreateUserGearInput, GearType } from '@/domain/gear/user-gear.entity'
import type { UserGearWithDetails } from '@/repositories/user-gear.repository'
import type { FocusType } from '@/domain/gear/lens-master.entity'

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

// --- 検索 API ---

export interface MasterSearchResult {
  id: string
  name: string
  makerName: string
  makerNameJa?: string
  lensMount?: string
  sensorSize?: string
  isCompact?: boolean
  focalLength?: string
  maxAperture?: string
  focusType?: string
}

export interface FilterOptions {
  makers: { id: string; name: string; nameJa?: string }[]
  lensMounts: string[]
  sensorSizes?: string[]
  focalLengths?: string[]
  maxApertures?: string[]
  focusTypes?: string[]
}

/**
 * マスタデータを検索（テキスト + 構造化フィルタ）
 */
export async function searchMasters(input: {
  gearType: GearType
  query?: string
  makerId?: string
  lensMount?: string
  sensorSize?: string
  isCompact?: boolean
  focalLength?: string
  maxAperture?: string
  focusType?: FocusType
}): Promise<MasterSearchResult[]> {
  const makers = await makerRepo.findAll()
  const makerMap = new Map(makers.map(m => [m.id, m]))

  if (input.gearType === 'camera') {
    const cameras = await cameraMasterRepo.searchWithFilters({
      query: input.query,
      makerId: input.makerId,
      lensMount: input.lensMount,
      sensorSize: input.sensorSize,
      isCompact: input.isCompact,
    })

    // テキストクエリでメーカー名（日本語含む）もマッチさせる
    let results = cameras
    if (input.query) {
      const allCameras = await cameraMasterRepo.searchWithFilters({
        makerId: input.makerId,
        lensMount: input.lensMount,
        sensorSize: input.sensorSize,
        isCompact: input.isCompact,
      })
      results = allCameras.filter((c) => {
        const maker = makerMap.get(c.makerId)
        const searchText = [c.name, maker?.name, maker?.nameJa].filter(Boolean).join(' ')
        return matchTokens(searchText, input.query!)
      })
    }

    return results.map(c => ({
      id: c.id,
      name: c.name,
      makerName: makerMap.get(c.makerId)?.name ?? '不明',
      makerNameJa: makerMap.get(c.makerId)?.nameJa,
      lensMount: c.lensMount ?? undefined,
      sensorSize: c.sensorSize ?? undefined,
      isCompact: c.isCompact,
    }))
  }

  // lens
  const lenses = await lensMasterRepo.searchWithFilters({
    query: input.query,
    makerId: input.makerId,
    lensMount: input.lensMount,
    focalLength: input.focalLength,
    maxAperture: input.maxAperture,
    focusType: input.focusType,
  })

  let results = lenses
  if (input.query) {
    const allLenses = await lensMasterRepo.searchWithFilters({
      makerId: input.makerId,
      lensMount: input.lensMount,
      focalLength: input.focalLength,
      maxAperture: input.maxAperture,
      focusType: input.focusType,
    })
    results = allLenses.filter((l) => {
      const maker = makerMap.get(l.makerId)
      const searchText = [l.name, maker?.name, maker?.nameJa].filter(Boolean).join(' ')
      return matchTokens(searchText, input.query!)
    })
  }

  return results.map(l => ({
    id: l.id,
    name: l.name,
    makerName: makerMap.get(l.makerId)?.name ?? '不明',
    makerNameJa: makerMap.get(l.makerId)?.nameJa,
    lensMount: l.lensMount ?? undefined,
    focalLength: l.focalLength ?? undefined,
    maxAperture: l.maxAperture ?? undefined,
    focusType: l.focusType,
  }))
}

/**
 * フィルタ選択肢を取得
 */
export async function getMasterFilterOptions(gearType: GearType): Promise<FilterOptions> {
  const makers = await makerRepo.findAll()
  const makerOptions = makers.map(m => ({
    id: m.id,
    name: m.name,
    nameJa: m.nameJa,
  }))

  if (gearType === 'camera') {
    const distinctValues = await cameraMasterRepo.getDistinctValues()
    return {
      makers: makerOptions,
      lensMounts: distinctValues.lensMounts,
      sensorSizes: distinctValues.sensorSizes,
    }
  }

  const distinctValues = await lensMasterRepo.getDistinctValues()
  return {
    makers: makerOptions,
    lensMounts: distinctValues.lensMounts,
    focalLengths: distinctValues.focalLengths,
    maxApertures: distinctValues.maxApertures,
    focusTypes: distinctValues.focusTypes,
  }
}
