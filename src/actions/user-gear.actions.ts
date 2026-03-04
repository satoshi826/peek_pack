'use server'

import {
  findUserGearsWithDetails,
  findUserGearsByStatusWithDetails,
  findUserGearByIdWithDetails,
  createUserGear,
} from '@/db/queries/user-gear'
import { searchCameraMastersWithFilters, getCameraDistinctValues } from '@/db/queries/camera-master'
import { searchLensMastersWithFilters, getLensDistinctValues } from '@/db/queries/lens-master'
import { findAllMakers } from '@/db/queries/maker'
import { matchTokens } from '@/lib/normalize-search'
import { revalidatePath } from 'next/cache'
import type { CreateUserGearInput, GearType, GearStatus, FocusType } from '@/db/validation'
import type { UserGearWithDetails } from '@/types/user-gear'
import type { MasterSearchResult, FilterOptions } from '@/types/master'

export async function getUserGearsByStatus(userId: string, status: GearStatus): Promise<UserGearWithDetails[]> {
  return findUserGearsByStatusWithDetails(userId, status)
}

export async function getUserGears(userId: string): Promise<UserGearWithDetails[]> {
  return findUserGearsWithDetails(userId)
}

export async function getUserGearById(id: string): Promise<UserGearWithDetails | null> {
  return findUserGearByIdWithDetails(id)
}

export async function createUserGearAction(input: CreateUserGearInput) {
  const gear = await createUserGear(input)
  revalidatePath('/')
  return gear
}

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
  const makers = await findAllMakers()
  const makerMap = new Map(makers.map(m => [m.id, m]))

  if (input.gearType === 'camera') {
    // フィルタのみでクエリし、テキスト検索はJS側でメーカー名も含めてマッチ
    const cameras = await searchCameraMastersWithFilters({
      makerId: input.makerId,
      lensMount: input.lensMount,
      sensorSize: input.sensorSize,
      isCompact: input.isCompact,
    })

    const filtered = input.query
      ? cameras.filter((c) => {
          const maker = makerMap.get(c.makerId)
          const searchText = [c.name, maker?.name, maker?.nameJa].filter(Boolean).join(' ')
          return matchTokens(searchText, input.query!)
        })
      : cameras

    return filtered.map(c => ({
      id: c.id,
      name: c.name,
      makerName: makerMap.get(c.makerId)?.name ?? '不明',
      makerNameJa: makerMap.get(c.makerId)?.nameJa,
      lensMount: c.lensMount,
      sensorSize: c.sensorSize,
      isCompact: c.isCompact,
    }))
  }

  const lenses = await searchLensMastersWithFilters({
    makerId: input.makerId,
    lensMount: input.lensMount,
    focalLength: input.focalLength,
    maxAperture: input.maxAperture,
    focusType: input.focusType,
  })

  const filtered = input.query
    ? lenses.filter((l) => {
        const maker = makerMap.get(l.makerId)
        const searchText = [l.name, maker?.name, maker?.nameJa].filter(Boolean).join(' ')
        return matchTokens(searchText, input.query!)
      })
    : lenses

  return filtered.map(l => ({
    id: l.id,
    name: l.name,
    makerName: makerMap.get(l.makerId)?.name ?? '不明',
    makerNameJa: makerMap.get(l.makerId)?.nameJa,
    lensMount: l.lensMount,
    focalLength: l.focalLength,
    maxAperture: l.maxAperture,
    focusType: l.focusType,
  }))
}

export async function getMasterFilterOptions(gearType: GearType): Promise<FilterOptions> {
  const makers = await findAllMakers()
  const makerOptions = makers.map(m => ({
    id: m.id,
    name: m.name,
    nameJa: m.nameJa,
  }))

  if (gearType === 'camera') {
    const distinctValues = await getCameraDistinctValues()
    return {
      makers: makerOptions,
      lensMounts: distinctValues.lensMounts,
      sensorSizes: distinctValues.sensorSizes,
    }
  }

  const distinctValues = await getLensDistinctValues()
  return {
    makers: makerOptions,
    lensMounts: distinctValues.lensMounts,
    focalLengths: distinctValues.focalLengths,
    maxApertures: distinctValues.maxApertures,
    focusTypes: distinctValues.focusTypes,
  }
}
