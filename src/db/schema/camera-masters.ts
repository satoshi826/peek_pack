import { boolean, integer, jsonb, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { makers } from './makers'

export const cameraMasters = pgTable('camera_masters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  makerId: text('maker_id').notNull().references(() => makers.id),
  releaseDate: timestamp('release_date', { mode: 'date' }),
  sensorSize: text('sensor_size'),
  lensMount: text('lens_mount'),
  resolution: text('resolution'),
  isCompact: boolean('is_compact').notNull(),
  hasStabilization: boolean('has_stabilization').notNull(),
  stabilizationStops: real('stabilization_stops'),
  weight: integer('weight'),
  size: jsonb('size').$type<{ width: number, height: number, depth: number }>(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})
