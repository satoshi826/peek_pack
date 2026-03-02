/**
 * Camera Master Drizzle Repository
 * インフラ層: カメラマスタのDrizzle + Supabase実装
 */

import type { CameraMaster, CreateCameraMasterInput, UpdateCameraMasterInput } from '@/domain/gear/camera-master.entity'
import type { CameraMasterRepository, CameraSearchFilters, CameraDistinctValues } from '@/repositories/camera-master.repository'
import { db } from '@/db'
import { cameraMasters } from '@/db/schema'
import { eq, and, ilike, type SQL } from 'drizzle-orm'
import { nullToUndefined } from './null-to-undefined'

export class CameraMasterDrizzleRepository implements CameraMasterRepository {
  async findAll(): Promise<CameraMaster[]> {
    const rows = await db.select().from(cameraMasters)
    return rows.map(nullToUndefined)
  }

  async findById(id: string): Promise<CameraMaster | null> {
    const [row] = await db.select().from(cameraMasters).where(eq(cameraMasters.id, id))
    return row ? nullToUndefined(row) : null
  }

  async findByMakerId(makerId: string): Promise<CameraMaster[]> {
    const rows = await db.select().from(cameraMasters).where(eq(cameraMasters.makerId, makerId))
    return rows.map(nullToUndefined)
  }

  async search(keyword: string): Promise<CameraMaster[]> {
    const rows = await db.select().from(cameraMasters).where(ilike(cameraMasters.name, `%${keyword}%`))
    return rows.map(nullToUndefined)
  }

  async searchWithFilters(params: CameraSearchFilters): Promise<CameraMaster[]> {
    const conditions: SQL[] = []

    if (params.makerId) {
      conditions.push(eq(cameraMasters.makerId, params.makerId))
    }
    if (params.lensMount) {
      conditions.push(eq(cameraMasters.lensMount, params.lensMount))
    }
    if (params.sensorSize) {
      conditions.push(eq(cameraMasters.sensorSize, params.sensorSize))
    }
    if (params.isCompact !== undefined) {
      conditions.push(eq(cameraMasters.isCompact, params.isCompact))
    }
    if (params.query) {
      conditions.push(ilike(cameraMasters.name, `%${params.query}%`))
    }

    const rows = conditions.length === 0
      ? await db.select().from(cameraMasters)
      : await db.select().from(cameraMasters).where(and(...conditions))

    return rows.map(nullToUndefined)
  }

  async getDistinctValues(): Promise<CameraDistinctValues> {
    const [mountRows, sensorRows] = await Promise.all([
      db.selectDistinct({ lensMount: cameraMasters.lensMount }).from(cameraMasters),
      db.selectDistinct({ sensorSize: cameraMasters.sensorSize }).from(cameraMasters),
    ])

    const lensMounts = mountRows
      .map(r => r.lensMount)
      .filter((v): v is string => v != null)
      .sort()

    const sensorSizes = sensorRows
      .map(r => r.sensorSize)
      .filter((v): v is string => v != null)
      .sort()

    return { lensMounts, sensorSizes }
  }

  async create(input: CreateCameraMasterInput): Promise<CameraMaster> {
    const [row] = await db.insert(cameraMasters).values({
      id: crypto.randomUUID(),
      ...input,
    }).returning()
    return nullToUndefined(row)
  }

  async update(id: string, input: UpdateCameraMasterInput): Promise<CameraMaster> {
    const [row] = await db.update(cameraMasters)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(cameraMasters.id, id))
      .returning()
    if (!row) {
      throw new Error(`Camera with id ${id} not found`)
    }
    return nullToUndefined(row)
  }

  async delete(id: string): Promise<void> {
    const result = await db.delete(cameraMasters).where(eq(cameraMasters.id, id)).returning()
    if (result.length === 0) {
      throw new Error(`Camera with id ${id} not found`)
    }
  }
}
