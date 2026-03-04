import { db } from '@/db'
import { makers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { CreateMakerInput } from '@/db/validation'

export async function findAllMakers() {
  return db.select().from(makers)
}

export async function findMakerById(id: string) {
  const [row] = await db.select().from(makers).where(eq(makers.id, id))
  return row ?? null
}

export async function findMakerByName(name: string) {
  const [row] = await db.select().from(makers).where(eq(makers.name, name))
  return row ?? null
}

export async function createMaker(input: CreateMakerInput) {
  const [row] = await db.insert(makers).values({
    id: crypto.randomUUID(),
    ...input,
  }).returning()
  return row
}

export async function updateMaker(id: string, input: Partial<CreateMakerInput>) {
  const [row] = await db.update(makers)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(makers.id, id))
    .returning()
  if (!row) throw new Error(`Maker with id ${id} not found`)
  return row
}

export async function deleteMaker(id: string) {
  const result = await db.delete(makers).where(eq(makers.id, id)).returning()
  if (result.length === 0) throw new Error(`Maker with id ${id} not found`)
}
