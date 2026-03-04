import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type { CreateUserInput } from '@/db/validation'

export async function findAllUsers() {
  return db.select().from(users)
}

export async function findUserById(id: string) {
  const [row] = await db.select().from(users).where(eq(users.id, id))
  return row ?? null
}

export async function findUserByEmail(email: string) {
  const [row] = await db.select().from(users).where(eq(users.email, email))
  return row ?? null
}

export async function createUser(input: CreateUserInput) {
  const [row] = await db.insert(users).values({
    id: crypto.randomUUID(),
    ...input,
  }).returning()
  return row
}

export async function updateUser(id: string, input: Partial<CreateUserInput>) {
  const [row] = await db.update(users)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning()
  if (!row) throw new Error(`User with id ${id} not found`)
  return row
}

export async function deleteUser(id: string) {
  const result = await db.delete(users).where(eq(users.id, id)).returning()
  if (result.length === 0) throw new Error(`User with id ${id} not found`)
}
