import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// prepare: false は Supabase Transaction Pooler 互換に必要
const client = postgres(process.env.DATABASE_URL!, { prepare: false })

export const db = drizzle({ client, schema })
