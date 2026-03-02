import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: process.env.ENV_FILE ?? '.env.local' })

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
