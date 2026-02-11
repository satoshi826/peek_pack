/**
 * User Gear File Repository
 * インフラ層: ユーザーギアのファイルベース実装
 */

import type { UserGear, CreateUserGearInput, UpdateUserGearInput, GearStatus, GearType } from '@/domain/gear/user-gear.entity'
import type { UserGearRepository, UserGearWithDetails } from '@/repositories/user-gear.repository'
import type { CameraMasterRepository } from '@/repositories/camera-master.repository'
import type { LensMasterRepository } from '@/repositories/lens-master.repository'
import type { MakerRepository } from '@/repositories/maker.repository'
import fs from 'fs'
import path from 'path'

type UserGearJSON = Omit<UserGear, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class UserGearFileRepository implements UserGearRepository {
  private dataFile: string

  private gears: UserGear[]

  constructor(
    private readonly cameraMasterRepo: CameraMasterRepository,
    private readonly lensMasterRepo: LensMasterRepository,
    private readonly makerRepo: MakerRepository,
  ) {
    this.dataFile = path.join(
      process.cwd(),
      'data',
      'user-gears.json',
    )
    this.gears = this.loadGears()
  }

  private ensureDataDir(): void {
    const dataDir = path.join(
      process.cwd(),
      'data',
    )
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(
        dataDir,
        { recursive: true },
      )
    }
  }

  private getDefaultGears(): UserGear[] {
    return [
      // カメラ 10個
      {
        id: 'gear-1',
        userId: 'user-1',
        gearType: 'camera',
        masterId: 'cam-001',
        status: 'owned',
        comment: 'メインカメラとして使用中',
        photos: [],
        createdAt: new Date('2026-01-20'),
        updatedAt: new Date('2026-01-20'),
      },
      {
        id: 'gear-2',
        userId: 'user-1',
        gearType: 'camera',
        masterId: 'cam-002',
        status: 'owned',
        comment: 'サブ機として活用',
        photos: [],
        createdAt: new Date('2026-01-21'),
        updatedAt: new Date('2026-01-21'),
      },
      {
        id: 'gear-3',
        userId: 'user-1',
        gearType: 'camera',
        masterId: 'cam-003',
        status: 'owned',
        comment: '次世代フルサイズ機が欲しい',
        photos: [],
        createdAt: new Date('2026-01-22'),
        updatedAt: new Date('2026-01-22'),
      },
      {
        id: 'gear-4',
        userId: 'user-1',
        gearType: 'camera',
        masterId: 'cam-004',
        status: 'owned',
        comment: '昔使っていたが売却済み',
        photos: [],
        createdAt: new Date('2026-01-23'),
        updatedAt: new Date('2026-01-23'),
      },
      {
        id: 'gear-5',
        userId: 'user-1',
        gearType: 'camera',
        customName: 'Hasselblad 500C/M',
        customMaker: 'Hasselblad',
        status: 'owned',
        comment: 'いつかは手に入れたい中判フィルムカメラ',
        photos: [],
        createdAt: new Date('2026-01-24'),
        updatedAt: new Date('2026-01-24'),
      },
      {
        id: 'gear-6',
        userId: 'user-1',
        gearType: 'camera',
        masterId: 'cam-005',
        status: 'owned',
        comment: 'ミラーレス入門機',
        photos: [],
        createdAt: new Date('2026-01-25'),
        updatedAt: new Date('2026-01-25'),
      },
      {
        id: 'gear-7',
        userId: 'user-1',
        gearType: 'camera',
        masterId: 'cam-006',
        status: 'owned',
        comment: '動画撮影用に検討中',
        photos: [],
        createdAt: new Date('2026-01-26'),
        updatedAt: new Date('2026-01-26'),
      },
      {
        id: 'gear-8',
        userId: 'user-1',
        gearType: 'camera',
        customName: 'Leica M6',
        customMaker: 'Leica',
        status: 'owned',
        comment: 'フィルム撮影用のクラシックカメラ',
        photos: [],
        createdAt: new Date('2026-01-27'),
        updatedAt: new Date('2026-01-27'),
      },
      {
        id: 'gear-9',
        userId: 'user-1',
        gearType: 'camera',
        masterId: 'cam-007',
        status: 'owned',
        comment: 'アクションカメラとして便利',
        photos: [],
        createdAt: new Date('2026-01-28'),
        updatedAt: new Date('2026-01-28'),
      },
      {
        id: 'gear-10',
        userId: 'user-1',
        gearType: 'camera',
        masterId: 'cam-008',
        status: 'owned',
        comment: '高画素機に興味あり',
        photos: [],
        createdAt: new Date('2026-01-29'),
        updatedAt: new Date('2026-01-29'),
      },
      // レンズ 10個
      {
        id: 'gear-11',
        userId: 'user-1',
        gearType: 'lens',
        masterId: 'lens-001',
        status: 'owned',
        comment: '標準ズームレンズ',
        photos: [],
        createdAt: new Date('2026-01-30'),
        updatedAt: new Date('2026-01-30'),
      },
      {
        id: 'gear-12',
        userId: 'user-1',
        gearType: 'lens',
        masterId: 'lens-002',
        status: 'owned',
        comment: '大三元の広角ズーム',
        photos: [],
        createdAt: new Date('2026-01-31'),
        updatedAt: new Date('2026-01-31'),
      },
      {
        id: 'gear-13',
        userId: 'user-1',
        gearType: 'lens',
        masterId: 'lens-003',
        status: 'owned',
        comment: 'ポートレート用の単焦点',
        photos: [],
        createdAt: new Date('2026-02-01'),
        updatedAt: new Date('2026-02-01'),
      },
      {
        id: 'gear-14',
        userId: 'user-1',
        gearType: 'lens',
        customName: 'Carl Zeiss Planar 50mm F1.4',
        customMaker: 'Carl Zeiss',
        status: 'wanted',
        comment: '次に購入したいレンズ',
        photos: [],
        createdAt: new Date('2026-02-02'),
        updatedAt: new Date('2026-02-02'),
      },
      {
        id: 'gear-15',
        userId: 'user-1',
        gearType: 'lens',
        masterId: 'lens-004',
        status: 'owned',
        comment: '望遠ズームで野鳥撮影に',
        photos: [],
        createdAt: new Date('2026-02-03'),
        updatedAt: new Date('2026-02-03'),
      },
      {
        id: 'gear-16',
        userId: 'user-1',
        gearType: 'lens',
        masterId: 'lens-005',
        status: 'owned',
        comment: '使わなくなったので売却',
        photos: [],
        createdAt: new Date('2026-02-04'),
        updatedAt: new Date('2026-02-04'),
      },
      {
        id: 'gear-17',
        userId: 'user-1',
        gearType: 'lens',
        customName: 'Voigtlander Nokton 40mm F1.2',
        customMaker: 'Voigtlander',
        status: 'wanted',
        comment: '明るい単焦点が欲しい',
        photos: [],
        createdAt: new Date('2026-02-05'),
        updatedAt: new Date('2026-02-05'),
      },
      {
        id: 'gear-18',
        userId: 'user-1',
        gearType: 'lens',
        masterId: 'lens-006',
        status: 'owned',
        comment: 'マクロ撮影用',
        photos: [],
        createdAt: new Date('2026-02-06'),
        updatedAt: new Date('2026-02-06'),
      },
      {
        id: 'gear-19',
        userId: 'user-1',
        gearType: 'lens',
        masterId: 'lens-007',
        status: 'wanted',
        comment: '超広角レンズを検討中',
        photos: [],
        createdAt: new Date('2026-02-07'),
        updatedAt: new Date('2026-02-07'),
      },
      {
        id: 'gear-20',
        userId: 'user-1',
        gearType: 'lens',
        masterId: 'lens-008',
        status: 'owned',
        comment: 'コンパクトなパンケーキレンズ',
        photos: [],
        createdAt: new Date('2026-02-08'),
        updatedAt: new Date('2026-02-08'),
      },
    ]
  }

  private loadGears(): UserGear[] {
    this.ensureDataDir()

    if (!fs.existsSync(this.dataFile)) {
      const defaultGears = this.getDefaultGears()
      this.saveGears(defaultGears)
      return defaultGears
    }

    try {
      const data = fs.readFileSync(
        this.dataFile,
        'utf-8',
      )
      const parsed: UserGearJSON[] = JSON.parse(data)
      return parsed.map(gear => ({
        ...gear,
        createdAt: new Date(gear.createdAt),
        updatedAt: new Date(gear.updatedAt),
      }))
    }
    catch (error) {
      console.error(
        'Failed to load user gears:',
        error,
      )
      return this.getDefaultGears()
    }
  }

  private saveGears(gears: UserGear[]): void {
    this.ensureDataDir()
    try {
      fs.writeFileSync(
        this.dataFile,
        JSON.stringify(
          gears,
          null,
          2,
        ),
        'utf-8',
      )
    }
    catch (error) {
      console.error(
        'Failed to save user gears:',
        error,
      )
    }
  }

  /**
     * ギアリストにマスタ情報を付与（一括取得でN+1回避）
     */
  private async enrichGearsWithDetails(gears: UserGear[]): Promise<UserGearWithDetails[]> {
    // マスタデータを一括取得
    const [
      cameras,
      lenses,
      makers,
    ] = await Promise.all([
      this.cameraMasterRepo.findAll(),
      this.lensMasterRepo.findAll(),
      this.makerRepo.findAll(),
    ])

    // Mapで高速ルックアップ
    const cameraMap = new Map(cameras.map(c => [
      c.id,
      c,
    ]))
    const lensMap = new Map(lenses.map(l => [
      l.id,
      l,
    ]))
    const makerMap = new Map(makers.map(m => [
      m.id,
      m,
    ]))

    return gears.map((gear) => {
      let masterName: string | undefined
      let makerName: string | undefined
      let masterData: UserGearWithDetails['masterData']

      if (gear.masterId) {
        if (gear.gearType === 'camera') {
          const camera = cameraMap.get(gear.masterId)
          if (camera) {
            masterName = camera.name
            masterData = camera
            makerName = makerMap.get(camera.makerId)?.name
          }
        }
        else if (gear.gearType === 'lens') {
          const lens = lensMap.get(gear.masterId)
          if (lens) {
            masterName = lens.name
            masterData = lens
            makerName = makerMap.get(lens.makerId)?.name
          }
        }
      }
      else {
        // カスタム登録の場合
        masterName = gear.customName
        makerName = gear.customMaker
      }

      return {
        ...gear,
        masterName,
        makerName,
        masterData,
      }
    })
  }

  async findByUserId(userId: string): Promise<UserGear[]> {
    return this.gears.filter(g => g.userId === userId)
  }

  async findByUserIdWithDetails(userId: string): Promise<UserGearWithDetails[]> {
    const gears = this.gears.filter(g => g.userId === userId)
    return this.enrichGearsWithDetails(gears)
  }

  async findByUserIdAndStatus(userId: string, status: GearStatus): Promise<UserGear[]> {
    return this.gears.filter(g => g.userId === userId && g.status === status)
  }

  async findByUserIdAndStatusWithDetails(userId: string, status: GearStatus): Promise<UserGearWithDetails[]> {
    const gears = this.gears.filter(g => g.userId === userId && g.status === status)
    return this.enrichGearsWithDetails(gears)
  }

  async findByMasterId(masterId: string, gearType: GearType): Promise<UserGear[]> {
    return this.gears.filter(g => g.masterId === masterId && g.gearType === gearType)
  }

  async findById(id: string): Promise<UserGear | null> {
    const gear = this.gears.find(g => g.id === id)
    return gear || null
  }

  async findByIdWithDetails(id: string): Promise<UserGearWithDetails | null> {
    const gear = this.gears.find(g => g.id === id)
    if (!gear) return null
    const [enriched] = await this.enrichGearsWithDetails([gear])
    return enriched
  }

  async create(input: CreateUserGearInput): Promise<UserGear> {
    const newGear: UserGear = {
      ...input,
      id: `gear-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.gears.push(newGear)
    this.saveGears(this.gears)
    return newGear
  }

  async update(id: string, input: UpdateUserGearInput): Promise<UserGear> {
    const index = this.gears.findIndex(g => g.id === id)
    if (index === -1) {
      throw new Error(`Gear with id ${id} not found`)
    }

    this.gears[index] = {
      ...this.gears[index],
      ...input,
      updatedAt: new Date(),
    }

    this.saveGears(this.gears)
    return this.gears[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.gears.findIndex(g => g.id === id)
    if (index === -1) {
      throw new Error(`Gear with id ${id} not found`)
    }
    this.gears.splice(
      index,
      1,
    )
    this.saveGears(this.gears)
  }

  async countUsersByMasterId(masterId: string, gearType: GearType): Promise<number> {
    const userIds = new Set(this.gears
      .filter(g => g.masterId === masterId && g.gearType === gearType)
      .map(g => g.userId))
    return userIds.size
  }
}
