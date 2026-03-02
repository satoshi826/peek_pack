import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { gearStatusEnum, gearTypeEnum } from './enums'
import { users } from './users'

export const userGears = pgTable('user_gears', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  gearType: gearTypeEnum('gear_type').notNull(),
  masterId: text('master_id'),
  customName: text('custom_name'),
  customMaker: text('custom_maker'),
  status: gearStatusEnum('status').notNull(),
  comment: text('comment'),
  photos: text('photos').array(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})
