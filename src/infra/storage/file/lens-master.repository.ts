/**
 * Lens Master File Repository
 * インフラ層: レンズマスタのファイルベース実装
 */

import type { LensMaster, CreateLensMasterInput, UpdateLensMasterInput } from "@/domain/gear/lens-master.entity";
import type { LensMasterRepository } from "@/repositories/lens-master.repository";
import lensMastersData from "@/data/lens-masters.json";

type LensMasterJSON = Omit<LensMaster, "releaseDate" | "createdAt" | "updatedAt"> & {
  releaseDate?: string;
  createdAt: string;
  updatedAt: string;
};

export class LensMasterFileRepository implements LensMasterRepository {
  private lenses: LensMaster[];

  constructor() {
    this.lenses = (lensMastersData as LensMasterJSON[]).map((lens) => ({
      ...lens,
      releaseDate: lens.releaseDate ? new Date(lens.releaseDate) : undefined,
      createdAt: new Date(lens.createdAt),
      updatedAt: new Date(lens.updatedAt),
    }));
  }

  async findAll(): Promise<LensMaster[]> {
    return [...this.lenses];
  }

  async findById(id: string): Promise<LensMaster | null> {
    const lens = this.lenses.find((l) => l.id === id);
    return lens || null;
  }

  async findByMakerId(makerId: string): Promise<LensMaster[]> {
    return this.lenses.filter((l) => l.makerId === makerId);
  }

  async search(keyword: string): Promise<LensMaster[]> {
    const lowerKeyword = keyword.toLowerCase();
    return this.lenses.filter(
      (l) => l.name.toLowerCase().includes(lowerKeyword)
    );
  }

  async create(input: CreateLensMasterInput): Promise<LensMaster> {
    const newLens: LensMaster = {
      ...input,
      id: `lens-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.lenses.push(newLens);
    return newLens;
  }

  async update(id: string, input: UpdateLensMasterInput): Promise<LensMaster> {
    const index = this.lenses.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error(`Lens with id ${id} not found`);
    }

    this.lenses[index] = {
      ...this.lenses[index],
      ...input,
      updatedAt: new Date(),
    };

    return this.lenses[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.lenses.findIndex((l) => l.id === id);
    if (index === -1) {
      throw new Error(`Lens with id ${id} not found`);
    }
    this.lenses.splice(index, 1);
  }
}
