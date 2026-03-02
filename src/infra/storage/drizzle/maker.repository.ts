/**
 * Maker Drizzle Repository
 * インフラ層: メーカーのDrizzle + Supabase実装
 */

import type { Maker, CreateMakerInput, UpdateMakerInput } from '@/domain/maker/maker.entity'
import type { MakerRepository } from '@/repositories/maker.repository'
import { db } from '@/db'
import { makers } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { nullToUndefined } from './null-to-undefined'

export class MakerDrizzleRepository implements MakerRepository {
  async findAll(): Promise<Maker[]> {
    const rows = await db.select().from(makers)
    return rows.map(nullToUndefined)
  }

  async findById(id: string): Promise<Maker | null> {
    const [row] = await db.select().from(makers).where(eq(makers.id, id))
    return row ? nullToUndefined(row) : null
  }

  async findByName(name: string): Promise<Maker | null> {
    const [row] = await db.select().from(makers).where(eq(makers.name, name))
    return row ? nullToUndefined(row) : null
  }

  async create(input: CreateMakerInput): Promise<Maker> {
    const [row] = await db.insert(makers).values({
      id: crypto.randomUUID(),
      ...input,
    }).returning()
    return nullToUndefined(row)
  }

  async update(id: string, input: UpdateMakerInput): Promise<Maker> {
    const [row] = await db.update(makers)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(makers.id, id))
      .returning()
    if (!row) {
      throw new Error(`Maker with id ${id} not found`)
    }
    return nullToUndefined(row)
  }

  async delete(id: string): Promise<void> {
    const result = await db.delete(makers).where(eq(makers.id, id)).returning()
    if (result.length === 0) {
      throw new Error(`Maker with id ${id} not found`)
    }
  }
}
