import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { users } from './users'

export const userBookmarks = pgTable('user_bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  targetUserId: text('target_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
}, t => [
  unique('user_bookmarks_user_target_unique').on(t.userId, t.targetUserId),
])
