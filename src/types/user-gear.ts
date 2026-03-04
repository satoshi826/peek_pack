import type { cameraMasters } from '@/db/schema/camera-masters'
import type { lensMasters } from '@/db/schema/lens-masters'
import type { userGears } from '@/db/schema/user-gears'

type UserGearRow = typeof userGears.$inferSelect
type CameraMasterRow = typeof cameraMasters.$inferSelect
type LensMasterRow = typeof lensMasters.$inferSelect

export type UserGearWithDetails = UserGearRow & {
  masterName?: string
  makerName?: string
  masterData?: CameraMasterRow | LensMasterRow
}
