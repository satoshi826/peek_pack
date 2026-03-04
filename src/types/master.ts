export interface MasterSearchResult {
  id: string
  name: string
  makerName: string
  makerNameJa?: string | null
  lensMount?: string | null
  sensorSize?: string | null
  isCompact?: boolean
  focalLength?: string | null
  maxAperture?: string | null
  focusType?: string
}

export interface FilterOptions {
  makers: { id: string, name: string, nameJa?: string | null }[]
  lensMounts: string[]
  sensorSizes?: string[]
  focalLengths?: string[]
  maxApertures?: string[]
  focusTypes?: string[]
}
