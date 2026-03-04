import { db } from '@/db'
import { userGears } from '@/db/schema'
import { eq, and, countDistinct } from 'drizzle-orm'
import { findAllCameraMasters } from './camera-master'
import { findAllLensMasters } from './lens-master'
import { findAllMakers } from './maker'
import type { CreateUserGearInput, GearStatus, GearType } from '@/db/validation'
import type { UserGearWithDetails } from '@/types/user-gear'

type UserGearRow = typeof userGears.$inferSelect

async function enrichGearsWithDetails(gears: UserGearRow[]): Promise<UserGearWithDetails[]> {
  const needsCameras = gears.some(g => g.gearType === 'camera' && g.masterId)
  const needsLenses = gears.some(g => g.gearType === 'lens' && g.masterId)
  const needsMakers = needsCameras || needsLenses

  const [cameras, lenses, makers] = await Promise.all([
    needsCameras ? findAllCameraMasters() : [],
    needsLenses ? findAllLensMasters() : [],
    needsMakers ? findAllMakers() : [],
  ])

  const cameraMap = new Map(cameras.map(c => [c.id, c]))
  const lensMap = new Map(lenses.map(l => [l.id, l]))
  const makerMap = new Map(makers.map(m => [m.id, m]))

  return gears.map((gear): UserGearWithDetails => {
    let masterName: string | undefined
    let makerName: string | undefined
    let masterData: UserGearWithDetails['masterData']

    if (gear.masterId) {
      if (gear.gearType === 'camera') {
        const camera = cameraMap.get(gear.masterId)
        if (camera) {
          masterName = camera.name
          masterData = camera
          makerName = makerMap.get(camera.makerId)?.name
        }
      }
      else if (gear.gearType === 'lens') {
        const lens = lensMap.get(gear.masterId)
        if (lens) {
          masterName = lens.name
          masterData = lens
          makerName = makerMap.get(lens.makerId)?.name
        }
      }
    }
    else {
      masterName = gear.customName ?? undefined
      makerName = gear.customMaker ?? undefined
    }

    return { ...gear, masterName, makerName, masterData }
  })
}

export async function findUserGearsByUserId(userId: string) {
  return db.select().from(userGears).where(eq(userGears.userId, userId))
}

export async function findUserGearsWithDetails(userId: string) {
  const gears = await findUserGearsByUserId(userId)
  return enrichGearsWithDetails(gears)
}

export async function findUserGearsByStatus(userId: string, status: GearStatus) {
  return db.select().from(userGears).where(
    and(eq(userGears.userId, userId), eq(userGears.status, status)),
  )
}

export async function findUserGearsByStatusWithDetails(userId: string, status: GearStatus) {
  const gears = await findUserGearsByStatus(userId, status)
  return enrichGearsWithDetails(gears)
}

export async function findUserGearById(id: string) {
  const [row] = await db.select().from(userGears).where(eq(userGears.id, id))
  return row ?? null
}

export async function findUserGearByIdWithDetails(id: string) {
  const gear = await findUserGearById(id)
  if (!gear) return null
  const [enriched] = await enrichGearsWithDetails([gear])
  return enriched
}

export async function createUserGear(input: CreateUserGearInput) {
  const [row] = await db.insert(userGears).values({
    id: crypto.randomUUID(),
    ...input,
  }).returning()
  return row
}

export async function updateUserGear(id: string, input: Partial<CreateUserGearInput>) {
  const [row] = await db.update(userGears)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(userGears.id, id))
    .returning()
  if (!row) throw new Error(`Gear with id ${id} not found`)
  return row
}

export async function deleteUserGear(id: string) {
  const result = await db.delete(userGears).where(eq(userGears.id, id)).returning()
  if (result.length === 0) throw new Error(`Gear with id ${id} not found`)
}

export async function countUsersByMasterId(masterId: string, gearType: GearType) {
  const [result] = await db
    .select({ count: countDistinct(userGears.userId) })
    .from(userGears)
    .where(and(eq(userGears.masterId, masterId), eq(userGears.gearType, gearType)))
  return result?.count ?? 0
}
