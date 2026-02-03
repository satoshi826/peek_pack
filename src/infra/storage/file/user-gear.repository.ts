/**
 * User Gear File Repository
 * インフラ層: ユーザーギアのファイルベース実装
 */

import type { UserGear, CreateUserGearInput, UpdateUserGearInput, GearStatus, GearType } from "@/domain/gear/user-gear.entity";
import type { UserGearRepository, UserGearWithDetails } from "@/repositories/user-gear.repository";
import type { CameraMasterRepository } from "@/repositories/camera-master.repository";
import type { LensMasterRepository } from "@/repositories/lens-master.repository";
import type { MakerRepository } from "@/repositories/maker.repository";
import fs from "fs";
import path from "path";

type UserGearJSON = Omit<UserGear, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export class UserGearFileRepository implements UserGearRepository {
  private dataFile: string;
  private gears: UserGear[];

  constructor(
    private readonly cameraMasterRepo: CameraMasterRepository,
    private readonly lensMasterRepo: LensMasterRepository,
    private readonly makerRepo: MakerRepository
  ) {
    this.dataFile = path.join(process.cwd(), "data", "user-gears.json");
    this.gears = this.loadGears();
  }

  private ensureDataDir(): void {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  private getDefaultGears(): UserGear[] {
    return [
      {
        id: "gear-1",
        userId: "user-1",
        gearType: "camera",
        masterId: "cam-001",
        status: "owned",
        comment: "メインカメラとして使用中",
        photos: [],
        createdAt: new Date("2026-01-20"),
        updatedAt: new Date("2026-01-20"),
      },
      {
        id: "gear-2",
        userId: "user-1",
        gearType: "lens",
        masterId: "lens-001",
        status: "owned",
        comment: "標準ズームレンズ",
        photos: [],
        createdAt: new Date("2026-01-21"),
        updatedAt: new Date("2026-01-21"),
      },
      {
        id: "gear-3",
        userId: "user-1",
        gearType: "lens",
        customName: "Carl Zeiss Planar 50mm F1.4",
        customMaker: "Carl Zeiss",
        status: "wanted",
        comment: "次に購入したいレンズ",
        photos: [],
        createdAt: new Date("2026-01-22"),
        updatedAt: new Date("2026-01-22"),
      },
    ];
  }

  private loadGears(): UserGear[] {
    this.ensureDataDir();

    if (!fs.existsSync(this.dataFile)) {
      const defaultGears = this.getDefaultGears();
      this.saveGears(defaultGears);
      return defaultGears;
    }

    try {
      const data = fs.readFileSync(this.dataFile, "utf-8");
      const parsed: UserGearJSON[] = JSON.parse(data);
      return parsed.map((gear) => ({
        ...gear,
        createdAt: new Date(gear.createdAt),
        updatedAt: new Date(gear.updatedAt),
      }));
    } catch (error) {
      console.error("Failed to load user gears:", error);
      return this.getDefaultGears();
    }
  }

  private saveGears(gears: UserGear[]): void {
    this.ensureDataDir();
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(gears, null, 2), "utf-8");
    } catch (error) {
      console.error("Failed to save user gears:", error);
    }
  }

  /**
   * ギアリストにマスタ情報を付与（一括取得でN+1回避）
   */
  private async enrichGearsWithDetails(gears: UserGear[]): Promise<UserGearWithDetails[]> {
    // マスタデータを一括取得
    const [cameras, lenses, makers] = await Promise.all([
      this.cameraMasterRepo.findAll(),
      this.lensMasterRepo.findAll(),
      this.makerRepo.findAll(),
    ]);

    // Mapで高速ルックアップ
    const cameraMap = new Map(cameras.map((c) => [c.id, c]));
    const lensMap = new Map(lenses.map((l) => [l.id, l]));
    const makerMap = new Map(makers.map((m) => [m.id, m]));

    return gears.map((gear) => {
      let masterName: string | undefined;
      let makerName: string | undefined;
      let masterData: UserGearWithDetails["masterData"];

      if (gear.masterId) {
        if (gear.gearType === "camera") {
          const camera = cameraMap.get(gear.masterId);
          if (camera) {
            masterName = camera.name;
            masterData = camera;
            makerName = makerMap.get(camera.makerId)?.name;
          }
        } else if (gear.gearType === "lens") {
          const lens = lensMap.get(gear.masterId);
          if (lens) {
            masterName = lens.name;
            masterData = lens;
            makerName = makerMap.get(lens.makerId)?.name;
          }
        }
      } else {
        // カスタム登録の場合
        masterName = gear.customName;
        makerName = gear.customMaker;
      }

      return {
        ...gear,
        masterName,
        makerName,
        masterData,
      };
    });
  }

  async findByUserId(userId: string): Promise<UserGear[]> {
    return this.gears.filter((g) => g.userId === userId);
  }

  async findByUserIdWithDetails(userId: string): Promise<UserGearWithDetails[]> {
    const gears = this.gears.filter((g) => g.userId === userId);
    return this.enrichGearsWithDetails(gears);
  }

  async findByUserIdAndStatus(userId: string, status: GearStatus): Promise<UserGear[]> {
    return this.gears.filter((g) => g.userId === userId && g.status === status);
  }

  async findByUserIdAndStatusWithDetails(userId: string, status: GearStatus): Promise<UserGearWithDetails[]> {
    const gears = this.gears.filter((g) => g.userId === userId && g.status === status);
    return this.enrichGearsWithDetails(gears);
  }

  async findByMasterId(masterId: string, gearType: GearType): Promise<UserGear[]> {
    return this.gears.filter(
      (g) => g.masterId === masterId && g.gearType === gearType
    );
  }

  async findById(id: string): Promise<UserGear | null> {
    const gear = this.gears.find((g) => g.id === id);
    return gear || null;
  }

  async findByIdWithDetails(id: string): Promise<UserGearWithDetails | null> {
    const gear = this.gears.find((g) => g.id === id);
    if (!gear) return null;
    const [enriched] = await this.enrichGearsWithDetails([gear]);
    return enriched;
  }

  async create(input: CreateUserGearInput): Promise<UserGear> {
    const newGear: UserGear = {
      ...input,
      id: `gear-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.gears.push(newGear);
    this.saveGears(this.gears);
    return newGear;
  }

  async update(id: string, input: UpdateUserGearInput): Promise<UserGear> {
    const index = this.gears.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Gear with id ${id} not found`);
    }

    this.gears[index] = {
      ...this.gears[index],
      ...input,
      updatedAt: new Date(),
    };

    this.saveGears(this.gears);
    return this.gears[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.gears.findIndex((g) => g.id === id);
    if (index === -1) {
      throw new Error(`Gear with id ${id} not found`);
    }
    this.gears.splice(index, 1);
    this.saveGears(this.gears);
  }

  async countUsersByMasterId(masterId: string, gearType: GearType): Promise<number> {
    const userIds = new Set(
      this.gears
        .filter((g) => g.masterId === masterId && g.gearType === gearType)
        .map((g) => g.userId)
    );
    return userIds.size;
  }
}
