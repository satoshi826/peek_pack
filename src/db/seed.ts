/**
 * Database Seed Script
 * 既存のJSONデータをSupabase PostgreSQLに投入する
 *
 * 実行: npx tsx src/db/seed.ts
 */

import { config } from 'dotenv'

config({ path: process.env.ENV_FILE ?? '.env.local' })
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { makers } from './schema/makers'
import { cameraMasters } from './schema/camera-masters'
import { lensMasters } from './schema/lens-masters'
import { users } from './schema/users'
import { userGears } from './schema/user-gears'
import fs from 'fs'
import path from 'path'

const client = postgres(process.env.DATABASE_URL!, { prepare: false })
const db = drizzle({ client })

function loadJSON<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename)
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

interface MakerJSON {
  id: string
  name: string
  nameJa?: string | null
  website?: string | null
  productTypes: ('camera' | 'lens')[]
  createdAt: string
  updatedAt: string
}

interface CameraMasterJSON {
  id: string
  name: string
  makerId: string
  releaseDate?: string | null
  sensorSize?: string | null
  lensMount?: string | null
  resolution?: string | null
  isCompact: boolean
  hasStabilization: boolean
  stabilizationStops?: number | null
  weight?: number | null
  size?: { width: number; height: number; depth: number } | null
  createdAt: string
  updatedAt: string
}

interface LensMasterJSON {
  id: string
  name: string
  makerId: string
  releaseDate?: string | null
  lensMount?: string | null
  focalLength?: string | null
  maxAperture?: string | null
  focusType: 'AF' | 'MF' | 'AF/MF'
  weight?: number | null
  size?: { diameter: number; length: number } | null
  filterDiameter?: number | null
  createdAt: string
  updatedAt: string
}

interface UserJSON {
  id: string
  name: string
  email: string
  profileImage: string
  bio?: string | null
  createdAt: string
  updatedAt: string
}

interface UserGearJSON {
  id: string
  userId: string
  gearType: 'camera' | 'lens'
  masterId?: string | null
  customName?: string | null
  customMaker?: string | null
  status: 'owned' | 'wanted' | 'previously-owned'
  comment?: string | null
  photos?: string[] | null
  createdAt: string
  updatedAt: string
}

async function seed() {
  console.log('Seeding database...')

  // 1. Makers
  const makersData = loadJSON<MakerJSON[]>('makers.json')
  console.log(`Inserting ${makersData.length} makers...`)
  await db.insert(makers).values(
    makersData.map(m => ({
      id: m.id,
      name: m.name,
      nameJa: m.nameJa ?? null,
      website: m.website ?? null,
      productTypes: m.productTypes,
      createdAt: new Date(m.createdAt),
      updatedAt: new Date(m.updatedAt),
    })),
  ).onConflictDoNothing()

  // 2. Camera Masters
  const camerasData = loadJSON<CameraMasterJSON[]>('camera-masters.json')
  console.log(`Inserting ${camerasData.length} camera masters...`)
  await db.insert(cameraMasters).values(
    camerasData.map(c => ({
      id: c.id,
      name: c.name,
      makerId: c.makerId,
      releaseDate: c.releaseDate ? new Date(c.releaseDate) : null,
      sensorSize: c.sensorSize ?? null,
      lensMount: c.lensMount ?? null,
      resolution: c.resolution ?? null,
      isCompact: c.isCompact,
      hasStabilization: c.hasStabilization,
      stabilizationStops: c.stabilizationStops ?? null,
      weight: c.weight ?? null,
      size: c.size ?? null,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    })),
  ).onConflictDoNothing()

  // 3. Lens Masters
  const lensesData = loadJSON<LensMasterJSON[]>('lens-masters.json')
  console.log(`Inserting ${lensesData.length} lens masters...`)
  await db.insert(lensMasters).values(
    lensesData.map(l => ({
      id: l.id,
      name: l.name,
      makerId: l.makerId,
      releaseDate: l.releaseDate ? new Date(l.releaseDate) : null,
      lensMount: l.lensMount ?? null,
      focalLength: l.focalLength ?? null,
      maxAperture: l.maxAperture ?? null,
      focusType: l.focusType,
      weight: l.weight ?? null,
      size: l.size ?? null,
      filterDiameter: l.filterDiameter ?? null,
      createdAt: new Date(l.createdAt),
      updatedAt: new Date(l.updatedAt),
    })),
  ).onConflictDoNothing()

  // 4. Users
  const usersData = loadJSON<UserJSON[]>('users.json')
  console.log(`Inserting ${usersData.length} users...`)
  await db.insert(users).values(
    usersData.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      profileImage: u.profileImage,
      bio: u.bio ?? null,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
    })),
  ).onConflictDoNothing()

  // 5. User Gears
  const gearsData = loadJSON<UserGearJSON[]>('user-gears.json')
  console.log(`Inserting ${gearsData.length} user gears...`)
  await db.insert(userGears).values(
    gearsData.map(g => ({
      id: g.id,
      userId: g.userId,
      gearType: g.gearType,
      masterId: g.masterId ?? null,
      customName: g.customName ?? null,
      customMaker: g.customMaker ?? null,
      status: g.status,
      comment: g.comment ?? null,
      photos: g.photos ?? null,
      createdAt: new Date(g.createdAt),
      updatedAt: new Date(g.updatedAt),
    })),
  ).onConflictDoNothing()

  console.log('Seed completed!')
  await client.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
