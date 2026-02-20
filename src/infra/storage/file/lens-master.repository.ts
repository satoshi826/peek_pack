/**
 * Lens Master File Repository
 * インフラ層: レンズマスタのファイルベース実装
 */

import type { LensMaster, CreateLensMasterInput, UpdateLensMasterInput } from '@/domain/gear/lens-master.entity'
import type { LensMasterRepository, LensSearchFilters, LensDistinctValues } from '@/repositories/lens-master.repository'
import { matchTokens } from '@/lib/normalize-search'
import lensMastersData from '@/data/lens-masters.json'

type LensMasterJSON = Omit<LensMaster, 'releaseDate' | 'createdAt' | 'updatedAt'> & {
  releaseDate?: string
  createdAt: string
  updatedAt: string
}

export class LensMasterFileRepository implements LensMasterRepository {
  private lenses: LensMaster[]

  constructor() {
    this.lenses = (lensMastersData as LensMasterJSON[]).map(lens => ({
      ...lens,
      releaseDate: lens.releaseDate
        ? new Date(lens.releaseDate)
        : undefined,
      createdAt: new Date(lens.createdAt),
      updatedAt: new Date(lens.updatedAt),
    }))
  }

  async findAll(): Promise<LensMaster[]> {
    return [...this.lenses]
  }

  async findById(id: string): Promise<LensMaster | null> {
    const lens = this.lenses.find(l => l.id === id)
    return lens || null
  }

  async findByMakerId(makerId: string): Promise<LensMaster[]> {
    return this.lenses.filter(l => l.makerId === makerId)
  }

  async search(keyword: string): Promise<LensMaster[]> {
    const lowerKeyword = keyword.toLowerCase()
    return this.lenses.filter(l => l.name.toLowerCase().includes(lowerKeyword))
  }

  async searchWithFilters(params: LensSearchFilters): Promise<LensMaster[]> {
    let results = [...this.lenses]

    if (params.makerId) {
      results = results.filter(l => l.makerId === params.makerId)
    }
    if (params.lensMount) {
      results = results.filter(l => l.lensMount === params.lensMount)
    }
    if (params.focalLength) {
      results = results.filter(l => l.focalLength === params.focalLength)
    }
    if (params.maxAperture) {
      results = results.filter(l => l.maxAperture === params.maxAperture)
    }
    if (params.focusType) {
      results = results.filter(l => l.focusType === params.focusType)
    }
    if (params.query) {
      results = results.filter(l => matchTokens(l.name, params.query!))
    }

    return results
  }

  async getDistinctValues(): Promise<LensDistinctValues> {
    const lensMounts = [...new Set(
      this.lenses.map(l => l.lensMount).filter((v): v is string => v != null),
    )].sort()
    const focalLengths = [...new Set(
      this.lenses.map(l => l.focalLength).filter((v): v is string => v != null),
    )].sort()
    const maxApertures = [...new Set(
      this.lenses.map(l => l.maxAperture).filter((v): v is string => v != null),
    )].sort()
    const focusTypes = [...new Set(
      this.lenses.map(l => l.focusType as string).filter(Boolean),
    )].sort()

    return { lensMounts, focalLengths, maxApertures, focusTypes }
  }

  async create(input: CreateLensMasterInput): Promise<LensMaster> {
    const newLens: LensMaster = {
      ...input,
      id: `lens-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.lenses.push(newLens)
    return newLens
  }

  async update(id: string, input: UpdateLensMasterInput): Promise<LensMaster> {
    const index = this.lenses.findIndex(l => l.id === id)
    if (index === -1) {
      throw new Error(`Lens with id ${id} not found`)
    }

    this.lenses[index] = {
      ...this.lenses[index],
      ...input,
      updatedAt: new Date(),
    }

    return this.lenses[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.lenses.findIndex(l => l.id === id)
    if (index === -1) {
      throw new Error(`Lens with id ${id} not found`)
    }
    this.lenses.splice(
      index,
      1,
    )
  }
}
