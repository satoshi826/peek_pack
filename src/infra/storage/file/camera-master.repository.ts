/**
 * Camera Master File Repository
 * インフラ層: カメラマスタのファイルベース実装
 */

import type { CameraMaster, CreateCameraMasterInput, UpdateCameraMasterInput } from '@/domain/gear/camera-master.entity'
import type { CameraMasterRepository } from '@/repositories/camera-master.repository'
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
