/**
 * Lens Master Drizzle Repository
 * インフラ層: レンズマスタのDrizzle + Supabase実装
 */

import type { LensMaster, CreateLensMasterInput, UpdateLensMasterInput } from '@/domain/gear/lens-master.entity'
import type { LensMasterRepository, LensSearchFilters, LensDistinctValues } from '@/repositories/lens-master.repository'
import { db } from '@/db'
import { lensMasters } from '@/db/schema'
import { eq, and, ilike, type SQL } from 'drizzle-orm'
import { nullToUndefined } from './null-to-undefined'

export class LensMasterDrizzleRepository implements LensMasterRepository {
  async findAll(): Promise<LensMaster[]> {
    const rows = await db.select().from(lensMasters)
    return rows.map(nullToUndefined)
  }

  async findById(id: string): Promise<LensMaster | null> {
    const [row] = await db.select().from(lensMasters).where(eq(lensMasters.id, id))
    return row ? nullToUndefined(row) : null
  }

  async findByMakerId(makerId: string): Promise<LensMaster[]> {
    const rows = await db.select().from(lensMasters).where(eq(lensMasters.makerId, makerId))
    return rows.map(nullToUndefined)
  }

  async search(keyword: string): Promise<LensMaster[]> {
    const rows = await db.select().from(lensMasters).where(ilike(lensMasters.name, `%${keyword}%`))
    return rows.map(nullToUndefined)
  }

  async searchWithFilters(params: LensSearchFilters): Promise<LensMaster[]> {
    const conditions: SQL[] = []

    if (params.makerId) {
      conditions.push(eq(lensMasters.makerId, params.makerId))
    }
    if (params.lensMount) {
      conditions.push(eq(lensMasters.lensMount, params.lensMount))
    }
    if (params.focalLength) {
      conditions.push(eq(lensMasters.focalLength, params.focalLength))
    }
    if (params.maxAperture) {
      conditions.push(eq(lensMasters.maxAperture, params.maxAperture))
    }
    if (params.focusType) {
      conditions.push(eq(lensMasters.focusType, params.focusType))
    }
    if (params.query) {
      conditions.push(ilike(lensMasters.name, `%${params.query}%`))
    }

    const rows = conditions.length === 0
      ? await db.select().from(lensMasters)
      : await db.select().from(lensMasters).where(and(...conditions))

    return rows.map(nullToUndefined)
  }

  async getDistinctValues(): Promise<LensDistinctValues> {
    const [mountRows, focalRows, apertureRows, focusRows] = await Promise.all([
      db.selectDistinct({ lensMount: lensMasters.lensMount }).from(lensMasters),
      db.selectDistinct({ focalLength: lensMasters.focalLength }).from(lensMasters),
      db.selectDistinct({ maxAperture: lensMasters.maxAperture }).from(lensMasters),
      db.selectDistinct({ focusType: lensMasters.focusType }).from(lensMasters),
    ])

    const lensMountsList = mountRows
      .map(r => r.lensMount)
      .filter((v): v is string => v != null)
      .sort()

    const focalLengths = focalRows
      .map(r => r.focalLength)
      .filter((v): v is string => v != null)
      .sort()

    const maxApertures = apertureRows
      .map(r => r.maxAperture)
      .filter((v): v is string => v != null)
      .sort()

    const focusTypes = focusRows
      .map(r => r.focusType)
      .filter(Boolean)
      .sort()

    return { lensMounts: lensMountsList, focalLengths, maxApertures, focusTypes }
  }

  async create(input: CreateLensMasterInput): Promise<LensMaster> {
    const [row] = await db.insert(lensMasters).values({
      id: crypto.randomUUID(),
      ...input,
    }).returning()
    return nullToUndefined(row)
  }

  async update(id: string, input: UpdateLensMasterInput): Promise<LensMaster> {
    const [row] = await db.update(lensMasters)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(lensMasters.id, id))
      .returning()
    if (!row) {
      throw new Error(`Lens with id ${id} not found`)
    }
    return nullToUndefined(row)
  }

  async delete(id: string): Promise<void> {
    const result = await db.delete(lensMasters).where(eq(lensMasters.id, id)).returning()
    if (result.length === 0) {
      throw new Error(`Lens with id ${id} not found`)
    }
  }
}
