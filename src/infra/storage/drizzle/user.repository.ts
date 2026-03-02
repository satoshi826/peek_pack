/**
 * User Drizzle Repository
 * インフラ層: ユーザーのDrizzle + Supabase実装
 */

import type { User, CreateUserInput, UpdateUserInput } from '@/domain/user/user.entity'
import type { UserRepository } from '@/repositories/user.repository'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { nullToUndefined } from './null-to-undefined'

export class UserDrizzleRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const rows = await db.select().from(users)
    return rows.map(nullToUndefined)
  }

  async findById(id: string): Promise<User | null> {
    const [row] = await db.select().from(users).where(eq(users.id, id))
    return row ? nullToUndefined(row) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await db.select().from(users).where(eq(users.email, email))
    return row ? nullToUndefined(row) : null
  }

  async create(input: CreateUserInput): Promise<User> {
    const [row] = await db.insert(users).values({
      id: crypto.randomUUID(),
      ...input,
    }).returning()
    return nullToUndefined(row)
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const [row] = await db.update(users)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()
    if (!row) {
      throw new Error(`User with id ${id} not found`)
    }
    return nullToUndefined(row)
  }

  async delete(id: string): Promise<void> {
    const result = await db.delete(users).where(eq(users.id, id)).returning()
    if (result.length === 0) {
      throw new Error(`User with id ${id} not found`)
    }
  }
}
