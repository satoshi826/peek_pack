import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const globalForDb = globalThis as unknown as {
  client: postgres.Sql | undefined
}

// 開発時のホットリロードで接続が増え続けるのを防ぐ
const client = globalForDb.client ?? postgres(process.env.DATABASE_URL!, { prepare: false })

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client
}

export const db = drizzle({ client, schema })
