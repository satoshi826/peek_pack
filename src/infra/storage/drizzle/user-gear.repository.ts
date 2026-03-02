/**
 * User Gear Drizzle Repository
 * インフラ層: ユーザーギアのDrizzle + Supabase実装
 */

import type { UserGear, CreateUserGearInput, UpdateUserGearInput, GearStatus, GearType } from '@/domain/gear/user-gear.entity'
import type { UserGearRepository, UserGearWithDetails } from '@/repositories/user-gear.repository'
import type { CameraMasterRepository } from '@/repositories/camera-master.repository'
import type { LensMasterRepository } from '@/repositories/lens-master.repository'
import type { MakerRepository } from '@/repositories/maker.repository'
import { db } from '@/db'
import { userGears } from '@/db/schema'
import { eq, and, countDistinct } from 'drizzle-orm'
import { nullToUndefined } from './null-to-undefined'

export class UserGearDrizzleRepository implements UserGearRepository {
  constructor(
    private readonly cameraMasterRepo: CameraMasterRepository,
    private readonly lensMasterRepo: LensMasterRepository,
    private readonly makerRepo: MakerRepository,
  ) {}

  /**
   * ギアリストにマスタ情報を付与（一括取得でN+1回避）
   */
  private async enrichGearsWithDetails(gears: UserGear[]): Promise<UserGearWithDetails[]> {
    const [cameras, lenses, makers] = await Promise.all([
      this.cameraMasterRepo.findAll(),
      this.lensMasterRepo.findAll(),
      this.makerRepo.findAll(),
    ])

    const cameraMap = new Map(cameras.map(c => [c.id, c]))
    const lensMap = new Map(lenses.map(l => [l.id, l]))
    const makerMap = new Map(makers.map(m => [m.id, m]))

    return gears.map((gear) => {
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
        } else if (gear.gearType === 'lens') {
          const lens = lensMap.get(gear.masterId)
          if (lens) {
            masterName = lens.name
            masterData = lens
            makerName = makerMap.get(lens.makerId)?.name
          }
        }
      } else {
        masterName = gear.customName
        makerName = gear.customMaker
      }

      return { ...gear, masterName, makerName, masterData }
    })
  }

  async findByUserId(userId: string): Promise<UserGear[]> {
    const rows = await db.select().from(userGears).where(eq(userGears.userId, userId))
    return rows.map(nullToUndefined)
  }

  async findByUserIdWithDetails(userId: string): Promise<UserGearWithDetails[]> {
    const gears = await this.findByUserId(userId)
    return this.enrichGearsWithDetails(gears)
  }

  async findByUserIdAndStatus(userId: string, status: GearStatus): Promise<UserGear[]> {
    const rows = await db.select().from(userGears).where(
      and(eq(userGears.userId, userId), eq(userGears.status, status)),
    )
    return rows.map(nullToUndefined)
  }

  async findByUserIdAndStatusWithDetails(userId: string, status: GearStatus): Promise<UserGearWithDetails[]> {
    const gears = await this.findByUserIdAndStatus(userId, status)
    return this.enrichGearsWithDetails(gears)
  }

  async findByMasterId(masterId: string, gearType: GearType): Promise<UserGear[]> {
    const rows = await db.select().from(userGears).where(
      and(eq(userGears.masterId, masterId), eq(userGears.gearType, gearType)),
    )
    return rows.map(nullToUndefined)
  }

  async findById(id: string): Promise<UserGear | null> {
    const [row] = await db.select().from(userGears).where(eq(userGears.id, id))
    return row ? nullToUndefined(row) : null
  }

  async findByIdWithDetails(id: string): Promise<UserGearWithDetails | null> {
    const gear = await this.findById(id)
    if (!gear) return null
    const [enriched] = await this.enrichGearsWithDetails([gear])
    return enriched
  }

  async create(input: CreateUserGearInput): Promise<UserGear> {
    const [row] = await db.insert(userGears).values({
      id: crypto.randomUUID(),
      ...input,
    }).returning()
    return nullToUndefined(row)
  }

  async update(id: string, input: UpdateUserGearInput): Promise<UserGear> {
    const [row] = await db.update(userGears)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(userGears.id, id))
      .returning()
    if (!row) {
      throw new Error(`Gear with id ${id} not found`)
    }
    return nullToUndefined(row)
  }

  async delete(id: string): Promise<void> {
    const result = await db.delete(userGears).where(eq(userGears.id, id)).returning()
    if (result.length === 0) {
      throw new Error(`Gear with id ${id} not found`)
    }
  }

  async countUsersByMasterId(masterId: string, gearType: GearType): Promise<number> {
    const [result] = await db
      .select({ count: countDistinct(userGears.userId) })
      .from(userGears)
      .where(and(eq(userGears.masterId, masterId), eq(userGears.gearType, gearType)))
    return result?.count ?? 0
  }
}
