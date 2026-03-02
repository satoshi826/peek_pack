# Drizzle ORM リポジトリ実装計画

## Context
Drizzle ORM のスキーマ・マイグレーション・DB接続は完了済み。既存の6つのリポジトリインターフェース (`src/repositories/`) に対応する Drizzle ベースの実装を `src/infra/storage/drizzle/` に作成する。既存のファイルベース実装 (`src/infra/storage/file/`) は変更しない。

## 作業内容

### 新規作成ファイル (6ファイル)

```
src/infra/storage/drizzle/
├── user.repository.ts           → UserDrizzleRepository
├── user-bookmark.repository.ts  → UserBookmarkDrizzleRepository
├── maker.repository.ts          → MakerDrizzleRepository
├── camera-master.repository.ts  → CameraMasterDrizzleRepository
├── lens-master.repository.ts    → LensMasterDrizzleRepository
└── user-gear.repository.ts      → UserGearDrizzleRepository
```

### 共通設計方針

- `db` は `@/db` から直接インポート (DIコンテナなし、既存パターンに合わせる)
- スキーマは `@/db/schema` からインポート
- ID生成: 既存パターンの `prefix-${Date.now()}` を踏襲
- **null/undefined 変換**: Drizzle は `null` を返すが、ドメインエンティティの optional フィールドは `undefined` を期待するため、各リポジトリに `toEntity()` マッピング関数を用意
- `returning()` で insert/update の結果を取得
- update/delete で対象が見つからない場合は `throw new Error()` (既存 file 実装と同様)

### 実装順序と詳細

#### 1. UserDrizzleRepository
- インターフェース: `UserRepository` (src/repositories/user.repository.ts)
- null→undefined 変換: `bio` のみ
- Drizzle API: `eq` でフィルタ、`returning()` で結果取得

#### 2. UserBookmarkDrizzleRepository
- インターフェース: `UserBookmarkRepository` (src/repositories/user-bookmark.repository.ts)
- **NOTE**: File 実装が存在しない → 新規実装
- IDプレフィックス: `bm-`
- null→undefined 変換: なし
- `isBookmarked`: `limit(1)` で存在チェック
- `countBookmarks`: `count()` 集約関数

#### 3. MakerDrizzleRepository
- インターフェース: `MakerRepository` (src/repositories/maker.repository.ts)
- null→undefined 変換: `nameJa`, `website`

#### 4. CameraMasterDrizzleRepository
- インターフェース: `CameraMasterRepository` (src/repositories/camera-master.repository.ts)
- null→undefined 変換: `releaseDate`, `sensorSize`, `lensMount`, `resolution`, `stabilizationStops`, `weight`, `size`
- `search`: `ilike` で部分一致
- `searchWithFilters`: 動的条件構築 (`and()` で結合)
- `getDistinctValues`: `selectDistinct` + `IS NOT NULL` フィルタ

#### 5. LensMasterDrizzleRepository
- インターフェース: `LensMasterRepository` (src/repositories/lens-master.repository.ts)
- Camera と同パターン
- null→undefined 変換: `releaseDate`, `lensMount`, `focalLength`, `maxAperture`, `weight`, `size`, `filterDiameter`

#### 6. UserGearDrizzleRepository (最も複雑)
- インターフェース: `UserGearRepository` (src/repositories/user-gear.repository.ts)
- null→undefined 変換: `masterId`, `customName`, `customMaker`, `comment`, `photos`
- **File 実装との違い**: コンストラクタで他リポジトリを受け取らない (DB から直接 JOIN/サブクエリで取得)
- `enrichGearsWithDetails()` private メソッド:
  - gearType ごとに camera_masters/lens_masters を `inArray` で一括取得
  - 関連する makers も一括取得
  - Map で高速ルックアップ → UserGearWithDetails を構築
- `countUsersByMasterId`: `countDistinct(userGears.userId)` で重複なしカウント

## 既存コードへの影響
**なし** — ファイルベース実装、Server Actions、ドメインエンティティは変更しない

## 検証方法
- `npm run build` がエラーなく通ること
- TypeScript の型チェックが通ること（各クラスがインターフェースを正しく実装していること）
