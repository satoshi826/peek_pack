import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { users } from './schema/users'
import { makers } from './schema/makers'
import { cameraMasters } from './schema/camera-masters'
import { lensMasters } from './schema/lens-masters'
import { userGears } from './schema/user-gears'
import { userBookmarks } from './schema/user-bookmarks'
import { gearTypeEnum, gearStatusEnum, focusTypeEnum, productTypeEnum } from './schema/enums'

// --- Enum スキーマ ---
export const gearTypeSchema = createSelectSchema(gearTypeEnum)
export type GearType = z.infer<typeof gearTypeSchema>

export const gearStatusSchema = createSelectSchema(gearStatusEnum)
export type GearStatus = z.infer<typeof gearStatusSchema>

export const focusTypeSchema = createSelectSchema(focusTypeEnum)
export type FocusType = z.infer<typeof focusTypeSchema>

export const productTypeSchema = createSelectSchema(productTypeEnum)
export type ProductType = z.infer<typeof productTypeSchema>

// --- Users ---
export const selectUserSchema = createSelectSchema(users)
export type User = z.infer<typeof selectUserSchema>

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
  username: true,
})
export type CreateUserInput = z.infer<typeof insertUserSchema>

// --- Makers ---
export const selectMakerSchema = createSelectSchema(makers)
export type Maker = z.infer<typeof selectMakerSchema>

export const insertMakerSchema = createInsertSchema(makers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type CreateMakerInput = z.infer<typeof insertMakerSchema>

// --- Camera Masters ---
export const selectCameraMasterSchema = createSelectSchema(cameraMasters)
export type CameraMaster = z.infer<typeof selectCameraMasterSchema>

export const insertCameraMasterSchema = createInsertSchema(cameraMasters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type CreateCameraMasterInput = z.infer<typeof insertCameraMasterSchema>

// --- Lens Masters ---
export const selectLensMasterSchema = createSelectSchema(lensMasters)
export type LensMaster = z.infer<typeof selectLensMasterSchema>

export const insertLensMasterSchema = createInsertSchema(lensMasters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})
export type CreateLensMasterInput = z.infer<typeof insertLensMasterSchema>

// --- User Gears ---
export const selectUserGearSchema = createSelectSchema(userGears)
export type UserGear = z.infer<typeof selectUserGearSchema>

export const insertUserGearSchema = createInsertSchema(userGears).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  masterId: true,
  customName: true,
  customMaker: true,
  comment: true,
  photos: true,
})
export type CreateUserGearInput = z.infer<typeof insertUserGearSchema>

// --- User Bookmarks ---
export const selectUserBookmarkSchema = createSelectSchema(userBookmarks)
export type UserBookmark = z.infer<typeof selectUserBookmarkSchema>

export const insertUserBookmarkSchema = createInsertSchema(userBookmarks).omit({
  id: true,
  createdAt: true,
})
export type CreateUserBookmarkInput = z.infer<typeof insertUserBookmarkSchema>
