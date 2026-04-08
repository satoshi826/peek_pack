# Peek Pack - 機能仕様書

## 1. アプリ概要

Peek Packは、カメラ・レンズなどの撮影ギアを管理・共有できるアプリケーションです。

### コンセプト
- 他人がどのようなギアを持ち、どのように使っているかを知ることができる
- **主役はあくまで「ギア」** であり、写真や人は補助的な存在とする
- ギアを起点とした情報共有プラットフォーム

---

## 2. 認証・アカウント

### 2.1 認証システム
- **ログイン方式**: Google OAuth ログイン（Better Auth）
- **認証プロバイダー**: Google アカウントのみ
- **セッション管理**: Cookie ベース（DB セッション方式）

### 2.2 オンボーディング
- 初回ログイン後、`/welcome` でアカウント設定を行う
- **ユーザー名（username）**: ユーザーが任意に設定。URLに使用（`/users/username`）。変更不可
- **表示名（name）**: いつでも変更可能
- ユーザー名未設定のユーザーは `/welcome` 以外にアクセスできない

### 2.3 閲覧権限
- アカウントを持たないユーザーでも、他人のページやギア情報を閲覧できる
- ゲストユーザーは全ての公開情報にアクセス可能

### 2.4 アカウント管理（/settings）
- **プロフィール編集**: 表示名、プロフィール画像URL、自己紹介(bio)の変更
- **アカウント削除**: 確認入力付きでアカウントと関連データを完全削除

---

## 3. ページ構成

### 3.1 ランディングページ（/ 未ログイン時）
- ヒーローセクション: キャッチコピーとログインCTA
- 機能紹介: ギア管理・パック共有・発見の3カード
- ログインはダイアログで完結（ページ遷移なし）

### 3.2 マイページ（/ ログイン時）
- プロフィールカード（アバター、表示名、@username、ギア数バッジ）
- ギアタブ（所有・欲しい・過去所有の3タブ）
- ギア追加ダイアログ（マスタ検索 + カスタム登録）

### 3.3 ユーザーページ（/users/[username]）
- マイページと同じ表示内容（プロフィール + ギアタブ）
- 編集操作（ギア追加）は非表示
- 未ログインでも閲覧可能

### 3.4 設定ページ（/settings）
- 要ログイン
- プロフィール編集フォーム
- アカウント削除セクション

### 3.5 オンボーディング（/welcome）
- 要ログイン、username 未設定ユーザーのみ
- ユーザー名と表示名の入力フォーム

---

## 4. ギアの基本構造

### 4.1 ギアの種類
ギアは以下の2種類に分類される:
- **カメラ**
- **レンズ**

### 4.2 マスタデータ（図鑑）
- カメラ・レンズには共通のマスタデータ（図鑑）が存在する
- ユーザーはマスタからギアを選択して登録できる
- **マスタに存在しないギアも、ユーザーが新規に登録できる**

---

## 5. カメラマスタに登録される情報

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

## 6. レンズマスタに登録される情報

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

## 7. ユーザーによるギア管理

### 7.1 ギアの管理状態
ユーザーはギアを以下の3つの状態で登録・管理できる:

1. **所有しているギア** - 現在保有している機材
2. **欲しいギア** - 購入を検討している機材
3. **過去に所有していたギア** - かつて保有していた機材

---

## 8. 所有ギアへのコメント・写真付与

### 8.1 コメント機能
- ユーザーは「所有しているギア」に対してのみ、コメント（短文）を登録できる

### 8.2 写真機能
- ユーザーは「所有しているギア」に対してのみ、そのギアで撮影した写真を登録できる
- **写真は1ギアにつき最大10枚まで登録可能**

### 8.3 UI上の扱い
- **写真はあくまで補助的な情報として扱う**
- UI上で目立たない配置とする
- **主役は常にギア情報**

---

## 9. ギア起点の閲覧機能

### 9.1 ギア詳細ページ
ギアの詳細ページから、以下の情報を確認できる:
- そのギアを持っているユーザーの一覧
- そのギアを持っているユーザーの人数

### 9.2 ギアを中心とした情報設計
- ギアから人へのナビゲーション
- 特定のギアの人気度・普及度を可視化

---

## 10. ギア図鑑（マスタ一覧）機能

### 10.1 図鑑ページ
- マスタに登録されているカメラ・レンズを一覧で閲覧できる
- カテゴリ、メーカー等でフィルタリング可能

### 10.2 図鑑ページからの操作
以下の操作が可能:
1. **自分のギアとして登録する**
2. **そのギアを持っているユーザーの一覧を見る**
3. **そのギアを持っているユーザーの人数を見る**

---

## 11. ブックマーク機能（ユーザー）

### 11.1 基本機能
- ユーザーは他のユーザーをブックマークできる
- 自分がブックマークしたユーザーの一覧を確認できる
- 自分をブックマークしたユーザーの一覧を確認できる

### 11.2 プライバシー設定
- **誰にブックマークされたかは本人のみが確認できる**
- ブックマーク数や一覧は、外部ユーザーからは閲覧できない
- 他人のブックマーク情報は非公開

---

## プロジェクト情報

### 技術スタック
- **フロントエンド**: Next.js 16.x (App Router) + React 19.x + TypeScript 5.x
- **スタイリング**: Tailwind CSS 4.x（Neumorphism デザイン）
- **UIコンポーネント**: shadcn/ui ベース + カスタム Neumo コンポーネント (`src/components/ui/`)
- **認証**: Better Auth + Google OAuth（Cookie ベースセッション）
- **データベース**: Supabase PostgreSQL + Drizzle ORM
- **バリデーション**: Zod（drizzle-zod で自動生成）

### デザイン方針
- **Neumorphism（ニューモーフィズム）** ベースのUI
- ギア情報を主役とした情報設計
- 写真や装飾的要素は控えめに
- クリーンで見やすいUI

---

## データモデル

### User（ユーザー）
```typescript
interface User {
  id: string            // Better Auth 自動生成（内部用）
  username?: string     // ユーザー定義のID（URL用、変更不可）
  name: string          // 表示名（変更可）
  email: string
  emailVerified: boolean
  profileImage?: string
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

### Session（セッション）
```typescript
interface Session {
  id: string
  token: string
  userId: string
  expiresAt: Date
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}
```

### Account（OAuth アカウント）
```typescript
interface Account {
  id: string
  userId: string
  providerId: string  // 'google'
  accountId: string   // Google アカウントID
  accessToken?: string
  refreshToken?: string
  createdAt: Date
  updatedAt: Date
}
```

---

**最終更新日**: 2026-04-08
