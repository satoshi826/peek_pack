/**
 * Maker File Repository
 * インフラ層: メーカーのファイルベース実装
 */

import type { Maker, CreateMakerInput, UpdateMakerInput } from "@/domain/maker/maker.entity";
import type { MakerRepository } from "@/repositories/maker.repository";
import makersData from "@/data/makers.json";

type MakerJSON = Omit<Maker, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export class MakerFileRepository implements MakerRepository {
  private makers: Maker[];

  constructor() {
    this.makers = (makersData as MakerJSON[]).map((maker) => ({
      ...maker,
      createdAt: new Date(maker.createdAt),
      updatedAt: new Date(maker.updatedAt),
    }));
  }

  async findAll(): Promise<Maker[]> {
    return [...this.makers];
  }

  async findById(id: string): Promise<Maker | null> {
    const maker = this.makers.find((m) => m.id === id);
    return maker || null;
  }

  async findByName(name: string): Promise<Maker | null> {
    const maker = this.makers.find((m) => m.name === name);
    return maker || null;
  }

  async create(input: CreateMakerInput): Promise<Maker> {
    const newMaker: Maker = {
      ...input,
      id: `maker-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.makers.push(newMaker);
    return newMaker;
  }

  async update(id: string, input: UpdateMakerInput): Promise<Maker> {
    const index = this.makers.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Maker with id ${id} not found`);
    }

    this.makers[index] = {
      ...this.makers[index],
      ...input,
      updatedAt: new Date(),
    };

    return this.makers[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.makers.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Maker with id ${id} not found`);
    }
    this.makers.splice(index, 1);
  }
}
