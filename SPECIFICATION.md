# Peek My Pack - 機能仕様書

## 1. アプリ概要

Peek My Packは、カメラ・レンズなどの撮影ギアを管理・共有できるアプリケーションです。

### コンセプト
- 他人がどのようなギアを持ち、どのように使っているかを知ることができる
- **主役はあくまで「ギア」** であり、写真や人は補助的な存在とする
- ギアを起点とした情報共有プラットフォーム

---

## 2. 認証・閲覧権限

### 2.1 認証システム
- **ログイン方式**: Google OAuth ログイン
- **認証プロバイダー**: Google アカウントのみ

### 2.2 閲覧権限
- アカウントを持たないユーザーでも、他人のページやギア情報を閲覧できる
- ゲストユーザーは全ての公開情報にアクセス可能

---

## 3. ギアの基本構造

### 3.1 ギアの種類
ギアは以下の2種類に分類される:
- **カメラ**
- **レンズ**

### 3.2 マスタデータ（図鑑）
- カメラ・レンズには共通のマスタデータ（図鑑）が存在する
- ユーザーはマスタからギアを選択して登録できる
- **マスタに存在しないギアも、ユーザーが新規に登録できる**

---

## 4. カメラマスタに登録される情報

| 項目 | 説明 |
|------|------|
| 名前 | カメラの製品名 |
| メーカー | 製造メーカー名 |
| 発売日 | 製品の発売日 |
| センサーサイズ | センサーのサイズ（フルサイズ、APS-C等） |
| レンズマウント | 対応するレンズマウントの種類 |
| 解像度 | 画素数・解像度 |
| コンデジか否か | コンパクトデジタルカメラかどうか |
| 手ブレ補正の有無 | 手ブレ補正機能の有無 |
| 手ブレ補正の段数 | 手ブレ補正の効果（段数） |
| 重さ | 本体重量 |
| 大きさ | 本体サイズ（寸法） |

---

## 5. レンズマスタに登録される情報

| 項目 | 説明 |
|------|------|
| 名前 | レンズの製品名 |
| メーカー | 製造メーカー名 |
| 発売日 | 製品の発売日 |
| レンズマウント | 対応するレンズマウントの種類 |
| 焦点距離 | レンズの焦点距離（mm） |
| 開放F値 | 最大開放F値 |
| AF / MF | オートフォーカス・マニュアルフォーカス |
| 重さ | レンズ重量 |
| 大きさ | レンズサイズ（寸法） |
| フィルター径 | 対応するフィルター径（mm） |

---

## 6. ユーザーによるギア管理

### 6.1 ギアの管理状態
ユーザーはギアを以下の3つの状態で登録・管理できる:

1. **所有しているギア** - 現在保有している機材
2. **欲しいギア** - 購入を検討している機材
3. **過去に所有していたギア** - かつて保有していた機材

---

## 7. 所有ギアへのコメント・写真付与

### 7.1 コメント機能
- ユーザーは「所有しているギア」に対してのみ、コメント（短文）を登録できる

### 7.2 写真機能
- ユーザーは「所有しているギア」に対してのみ、そのギアで撮影した写真を登録できる
- **写真は1ギアにつき最大10枚まで登録可能**

### 7.3 UI上の扱い
- **写真はあくまで補助的な情報として扱う**
- UI上で目立たない配置とする
- **主役は常にギア情報**

---

## 8. ギア起点の閲覧機能

### 8.1 ギア詳細ページ
ギアの詳細ページから、以下の情報を確認できる:
- そのギアを持っているユーザーの一覧
- そのギアを持っているユーザーの人数

### 8.2 ギアを中心とした情報設計
- ギアから人へのナビゲーション
- 特定のギアの人気度・普及度を可視化

---

## 9. ギア図鑑（マスタ一覧）機能

### 9.1 図鑑ページ
- マスタに登録されているカメラ・レンズを一覧で閲覧できる
- カテゴリ、メーカー等でフィルタリング可能

### 9.2 図鑑ページからの操作
以下の操作が可能:
1. **自分のギアとして登録する**
2. **そのギアを持っているユーザーの一覧を見る**
3. **そのギアを持っているユーザーの人数を見る**

---

## 10. ブックマーク機能（ユーザー）

### 10.1 基本機能
- ユーザーは他のユーザーをブックマークできる
- 自分がブックマークしたユーザーの一覧を確認できる
- 自分をブックマークしたユーザーの一覧を確認できる

### 10.2 プライバシー設定
- **誰にブックマークされたかは本人のみが確認できる**
- ブックマーク数や一覧は、外部ユーザーからは閲覧できない
- 他人のブックマーク情報は非公開

---

## プロジェクト情報

### 技術スタック
- **フロントエンド**: Next.js 16.x (App Router)
- **UI フレームワーク**: React 19.x
- **型定義**: TypeScript 5.x
- **スタイリング**: TailwindCSS 4.x
- **認証**: OAuth 2.0 (Google)

### デザイン方針
- **ミニマル・モダン**
- ギア情報を主役とした情報設計
- 写真や装飾的要素は控えめに
- クリーンで見やすいUI

---

## データモデル

### User（ユーザー）
```typescript
interface User {
  id: string
  name: string
  email: string
  profileImage: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}
```

### CameraMaster（カメラマスタ）
```typescript
interface CameraMaster {
  id: string
  name: string
  maker: string
  releaseDate?: Date
  sensorSize?: string
  lensMount?: string
  resolution?: string
  isCompact: boolean
  hasStabilization: boolean
  stabilizationStops?: number
  weight?: number
  size?: {
    width: number
    height: number
    depth: number
  }
  createdAt: Date
  updatedAt: Date
}
```

### LensMaster（レンズマスタ）
```typescript
interface LensMaster {
  id: string
  name: string
  maker: string
  releaseDate?: Date
  lensMount?: string
  focalLength?: string
  maxAperture?: string
  focusType: 'AF' | 'MF' | 'AF/MF'
  weight?: number
  size?: {
    diameter: number
    length: number
  }
  filterDiameter?: number
  createdAt: Date
  updatedAt: Date
}
```

### UserGear（ユーザーのギア）
```typescript
interface UserGear {
  id: string
  userId: string
  gearType: 'camera' | 'lens'
  masterId?: string // マスタIDまたはnull（カスタム登録の場合）
  customName?: string // マスタに存在しない場合の名前
  status: 'owned' | 'wanted' | 'previously-owned'
  comment?: string
  photos?: string[] // 最大10枚
  createdAt: Date
  updatedAt: Date
}
```

### UserBookmark（ブックマーク）
```typescript
interface UserBookmark {
  id: string
  userId: string // ブックマークした人
  targetUserId: string // ブックマークされた人
  createdAt: Date
}
```

---

**最終更新日**: 2026-01-28
