import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { productTypeEnum } from './enums'

export const makers = pgTable('makers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameJa: text('name_ja'),
  website: text('website'),
  productTypes: productTypeEnum('product_types').array().notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow().$onUpdate(() => new Date()),
})
