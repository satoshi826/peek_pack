import { integer, jsonb, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { focusTypeEnum } from './enums'
import { makers } from './makers'

export const lensMasters = pgTable('lens_masters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  makerId: text('maker_id').notNull().references(() => makers.id),
  releaseDate: timestamp('release_date', { mode: 'date' }),
  lensMount: text('lens_mount'),
  focalLength: text('focal_length'),
  maxAperture: text('max_aperture'),
  focusType: focusTypeEnum('focus_type').notNull(),
  weight: integer('weight'),
  size: jsonb('size').$type<{ diameter: number; length: number }>(),
  filterDiameter: real('filter_diameter'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})
