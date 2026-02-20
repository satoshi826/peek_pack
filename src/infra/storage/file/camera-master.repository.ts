/**
 * Camera Master File Repository
 * インフラ層: カメラマスタのファイルベース実装
 */

import type { CameraMaster, CreateCameraMasterInput, UpdateCameraMasterInput } from '@/domain/gear/camera-master.entity'
import type { CameraMasterRepository, CameraSearchFilters, CameraDistinctValues } from '@/repositories/camera-master.repository'
import { matchTokens } from '@/lib/normalize-search'
import cameraMastersData from '@/data/camera-masters.json'

type CameraMasterJSON = Omit<CameraMaster, 'releaseDate' | 'createdAt' | 'updatedAt'> & {
  releaseDate?: string
  createdAt: string
  updatedAt: string
}

export class CameraMasterFileRepository implements CameraMasterRepository {
  private cameras: CameraMaster[]

  constructor() {
    this.cameras = (cameraMastersData as CameraMasterJSON[]).map(camera => ({
      ...camera,
      releaseDate: camera.releaseDate
        ? new Date(camera.releaseDate)
        : undefined,
      createdAt: new Date(camera.createdAt),
      updatedAt: new Date(camera.updatedAt),
    }))
  }

  async findAll(): Promise<CameraMaster[]> {
    return [...this.cameras]
  }

  async findById(id: string): Promise<CameraMaster | null> {
    const camera = this.cameras.find(c => c.id === id)
    return camera || null
  }

  async findByMakerId(makerId: string): Promise<CameraMaster[]> {
    return this.cameras.filter(c => c.makerId === makerId)
  }

  async search(keyword: string): Promise<CameraMaster[]> {
    const lowerKeyword = keyword.toLowerCase()
    return this.cameras.filter(c => c.name.toLowerCase().includes(lowerKeyword))
  }

  async searchWithFilters(params: CameraSearchFilters): Promise<CameraMaster[]> {
    let results = [...this.cameras]

    if (params.makerId) {
      results = results.filter(c => c.makerId === params.makerId)
    }
    if (params.lensMount) {
      results = results.filter(c => c.lensMount === params.lensMount)
    }
    if (params.sensorSize) {
      results = results.filter(c => c.sensorSize === params.sensorSize)
    }
    if (params.isCompact !== undefined) {
      results = results.filter(c => c.isCompact === params.isCompact)
    }
    if (params.query) {
      results = results.filter(c => matchTokens(c.name, params.query!))
    }

    return results
  }

  async getDistinctValues(): Promise<CameraDistinctValues> {
    const lensMounts = [...new Set(
      this.cameras.map(c => c.lensMount).filter((v): v is string => v != null),
    )].sort()
    const sensorSizes = [...new Set(
      this.cameras.map(c => c.sensorSize).filter((v): v is string => v != null),
    )].sort()

    return { lensMounts, sensorSizes }
  }

  async create(input: CreateCameraMasterInput): Promise<CameraMaster> {
    const newCamera: CameraMaster = {
      ...input,
      id: `cam-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.cameras.push(newCamera)
    return newCamera
  }

  async update(id: string, input: UpdateCameraMasterInput): Promise<CameraMaster> {
    const index = this.cameras.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error(`Camera with id ${id} not found`)
    }

    this.cameras[index] = {
      ...this.cameras[index],
      ...input,
      updatedAt: new Date(),
    }

    return this.cameras[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.cameras.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error(`Camera with id ${id} not found`)
    }
    this.cameras.splice(
      index,
      1,
    )
  }
}
