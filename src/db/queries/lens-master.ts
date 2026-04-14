import { db } from '@/db'
import { lensMasters } from '@/db/schema'
import { eq, and, type SQL } from 'drizzle-orm'
import { cacheLife, cacheTag, revalidateTag } from 'next/cache'
import type { CreateLensMasterInput, FocusType } from '@/db/validation'

export interface LensSearchFilters {
  makerId?: string
  lensMount?: string
  focalLength?: string
  maxAperture?: string
  focusType?: FocusType
}

export interface LensDistinctValues {
  lensMounts: string[]
  focalLengths: string[]
  maxApertures: string[]
  focusTypes: string[]
}

export async function findAllLensMasters() {
  'use cache'
  cacheTag('lens-masters')
  cacheLife('masterData')
  return db.select().from(lensMasters)
}

export async function findLensMasterById(id: string) {
  'use cache'
  cacheTag('lens-masters')
  cacheLife('masterData')
  const [row] = await db.select().from(lensMasters).where(eq(lensMasters.id, id))
  return row ?? null
}

export async function searchLensMastersWithFilters(params: LensSearchFilters) {
  'use cache'
  cacheTag('lens-masters')
  cacheLife('masterData')
  const conditions: SQL[] = []

  if (params.makerId) conditions.push(eq(lensMasters.makerId, params.makerId))
  if (params.lensMount) conditions.push(eq(lensMasters.lensMount, params.lensMount))
  if (params.focalLength) conditions.push(eq(lensMasters.focalLength, params.focalLength))
  if (params.maxAperture) conditions.push(eq(lensMasters.maxAperture, params.maxAperture))
  if (params.focusType) conditions.push(eq(lensMasters.focusType, params.focusType))

  return conditions.length === 0
    ? db.select().from(lensMasters)
    : db.select().from(lensMasters).where(and(...conditions))
}

export async function getLensDistinctValues(): Promise<LensDistinctValues> {
  'use cache'
  cacheTag('lens-masters')
  cacheLife('masterData')
  const [mountRows, focalRows, apertureRows, focusRows] = await Promise.all([
    db.selectDistinct({ lensMount: lensMasters.lensMount }).from(lensMasters),
    db.selectDistinct({ focalLength: lensMasters.focalLength }).from(lensMasters),
    db.selectDistinct({ maxAperture: lensMasters.maxAperture }).from(lensMasters),
    db.selectDistinct({ focusType: lensMasters.focusType }).from(lensMasters),
  ])

  return {
    lensMounts: mountRows.map(r => r.lensMount).filter((v): v is string => v != null).sort(),
    focalLengths: focalRows.map(r => r.focalLength).filter((v): v is string => v != null).sort(),
    maxApertures: apertureRows.map(r => r.maxAperture).filter((v): v is string => v != null).sort(),
    focusTypes: focusRows.map(r => r.focusType).filter(Boolean).sort(),
  }
}

export async function createLensMaster(input: CreateLensMasterInput) {
  const [row] = await db.insert(lensMasters).values({
    id: crypto.randomUUID(),
    ...input,
  }).returning()
  revalidateTag('lens-masters', 'max')
  return row
}

export async function updateLensMaster(id: string, input: Partial<CreateLensMasterInput>) {
  const [row] = await db.update(lensMasters)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(lensMasters.id, id))
    .returning()
  if (!row) throw new Error(`Lens with id ${id} not found`)
  revalidateTag('lens-masters', 'max')
  return row
}

export async function deleteLensMaster(id: string) {
  const result = await db.delete(lensMasters).where(eq(lensMasters.id, id)).returning()
  if (result.length === 0) throw new Error(`Lens with id ${id} not found`)
  revalidateTag('lens-masters', 'max')
}
