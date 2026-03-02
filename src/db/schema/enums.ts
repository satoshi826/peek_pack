import { pgEnum } from 'drizzle-orm/pg-core'

export const gearTypeEnum = pgEnum('gear_type', ['camera', 'lens'])

export const gearStatusEnum = pgEnum('gear_status', [
  'owned',
  'wanted',
  'previously-owned',
])

export const focusTypeEnum = pgEnum('focus_type', ['AF', 'MF', 'AF/MF'])

export const productTypeEnum = pgEnum('product_type', ['camera', 'lens'])
