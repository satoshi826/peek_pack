/**
 * User File Repository
 * インフラ層: ユーザーのファイルベース実装
 */

import type { User, CreateUserInput, UpdateUserInput } from '@/domain/user/user.entity'
import type { UserRepository } from '@/repositories/user.repository'
import fs from 'fs'
import path from 'path'

type UserJSON = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class UserFileRepository implements UserRepository {
  private dataFile: string

  private users: User[]

  constructor() {
    this.dataFile = path.join(
      process.cwd(),
      'data',
      'users.json',
    )
    this.users = this.loadUsers()
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

  private getDefaultUsers(): User[] {
    return [
      {
        id: 'user-1',
        name: '山田太郎',
        email: 'yamada@example.com',
        profileImage: '/images/default-avatar.png',
        bio: '写真が好きなエンジニアです',
        createdAt: new Date('2026-01-20'),
        updatedAt: new Date('2026-01-20'),
      },
    ]
  }

  private loadUsers(): User[] {
    this.ensureDataDir()

    if (!fs.existsSync(this.dataFile)) {
      const defaultUsers = this.getDefaultUsers()
      this.saveUsers(defaultUsers)
      return defaultUsers
    }

    try {
      const data = fs.readFileSync(
        this.dataFile,
        'utf-8',
      )
      const parsed: UserJSON[] = JSON.parse(data)
      return parsed.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }))
    }
    catch (error) {
      console.error(
        'Failed to load users:',
        error,
      )
      return this.getDefaultUsers()
    }
  }

  private saveUsers(users: User[]): void {
    this.ensureDataDir()
    try {
      fs.writeFileSync(
        this.dataFile,
        JSON.stringify(
          users,
          null,
          2,
        ),
        'utf-8',
      )
    }
    catch (error) {
      console.error(
        'Failed to save users:',
        error,
      )
    }
  }

  async findAll(): Promise<User[]> {
    return [...this.users]
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id)
    return user || null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email)
    return user || null
  }

  async create(input: CreateUserInput): Promise<User> {
    const newUser: User = {
      ...input,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(newUser)
    this.saveUsers(this.users)
    return newUser
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error(`User with id ${id} not found`)
    }

    this.users[index] = {
      ...this.users[index],
      ...input,
      updatedAt: new Date(),
    }

    this.saveUsers(this.users)
    return this.users[index]
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) {
      throw new Error(`User with id ${id} not found`)
    }
    this.users.splice(
      index,
      1,
    )
    this.saveUsers(this.users)
  }
}
