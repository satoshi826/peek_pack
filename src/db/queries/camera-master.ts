import { db } from '@/db'
import { cameraMasters } from '@/db/schema'
import { eq, and, type SQL } from 'drizzle-orm'
import { cacheLife, cacheTag, revalidateTag } from 'next/cache'
import type { CreateCameraMasterInput } from '@/db/validation'

export interface CameraSearchFilters {
  makerId?: string
  lensMount?: string
  sensorSize?: string
  isCompact?: boolean
}

export interface CameraDistinctValues {
  lensMounts: string[]
  sensorSizes: string[]
}

export async function findAllCameraMasters() {
  'use cache'
  cacheTag('camera-masters')
  cacheLife('masterData')
  return db.select().from(cameraMasters)
}

export async function findCameraMasterById(id: string) {
  'use cache'
  cacheTag('camera-masters')
  cacheLife('masterData')
  const [row] = await db.select().from(cameraMasters).where(eq(cameraMasters.id, id))
  return row ?? null
}

export async function searchCameraMastersWithFilters(params: CameraSearchFilters) {
  'use cache'
  cacheTag('camera-masters')
  cacheLife('masterData')
  const conditions: SQL[] = []

  if (params.makerId) conditions.push(eq(cameraMasters.makerId, params.makerId))
  if (params.lensMount) conditions.push(eq(cameraMasters.lensMount, params.lensMount))
  if (params.sensorSize) conditions.push(eq(cameraMasters.sensorSize, params.sensorSize))
  if (params.isCompact !== undefined) conditions.push(eq(cameraMasters.isCompact, params.isCompact))

  return conditions.length === 0
    ? db.select().from(cameraMasters)
    : db.select().from(cameraMasters).where(and(...conditions))
}

export async function getCameraDistinctValues(): Promise<CameraDistinctValues> {
  'use cache'
  cacheTag('camera-masters')
  cacheLife('masterData')
  const [mountRows, sensorRows] = await Promise.all([
    db.selectDistinct({ lensMount: cameraMasters.lensMount }).from(cameraMasters),
    db.selectDistinct({ sensorSize: cameraMasters.sensorSize }).from(cameraMasters),
  ])

  return {
    lensMounts: mountRows.map(r => r.lensMount).filter((v): v is string => v != null).sort(),
    sensorSizes: sensorRows.map(r => r.sensorSize).filter((v): v is string => v != null).sort(),
  }
}

export async function createCameraMaster(input: CreateCameraMasterInput) {
  const [row] = await db.insert(cameraMasters).values({
    id: crypto.randomUUID(),
    ...input,
  }).returning()
  revalidateTag('camera-masters', 'max')
  return row
}

export async function updateCameraMaster(id: string, input: Partial<CreateCameraMasterInput>) {
  const [row] = await db.update(cameraMasters)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(cameraMasters.id, id))
    .returning()
  if (!row) throw new Error(`Camera with id ${id} not found`)
  revalidateTag('camera-masters', 'max')
  return row
}

export async function deleteCameraMaster(id: string) {
  const result = await db.delete(cameraMasters).where(eq(cameraMasters.id, id)).returning()
  if (result.length === 0) throw new Error(`Camera with id ${id} not found`)
  revalidateTag('camera-masters', 'max')
}
