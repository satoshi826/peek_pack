# Better Auth 導入プラン

## Context
現在の認証は `src/lib/auth.ts` でDBの最初のユーザーを返す仮実装。Better Auth + Google OAuth でログイン機能を実装し、Cookie ベースのセッション管理に置き換える。

## 前提条件
- Google Cloud Console で OAuth 認証情報（Client ID / Secret）を事前に取得すること
- リダイレクト URI: `http://localhost:3000/api/auth/callback/google`（開発環境）

---

## Step 1: パッケージインストール
```bash
npm install better-auth
```

## Step 2: DB スキーマ変更

### `src/db/schema/users.ts` — カラム追加
- `emailVerified: boolean('email_verified').notNull().default(false)` を追加
- `profileImage` の `.notNull()` を除去（OAuth初回登録時に画像がない場合に備える）

### `src/db/schema/auth.ts` — 新規作成
Better Auth が必要とする3テーブルを追加:
- `sessions` — セッション管理（token, expiresAt, userId FK）
- `accounts` — OAuth アカウント連携（providerId, accountId, accessToken 等）
- `verifications` — メール認証トークン等

### `src/db/schema/index.ts` — エクスポート追加
```typescript
export * from './auth'
```

### マイグレーション
```bash
npx drizzle-kit generate && npx drizzle-kit migrate
```

## Step 3: Better Auth サーバー設定

### `src/lib/auth.ts` — 全面書き換え
- `'use server'` ディレクティブを除去
- `betterAuth()` で auth インスタンスを作成
- Drizzle アダプター（`provider: 'pg'`, `usePlural: true`）
- Google OAuth プロバイダー設定
- `user.fields.image: 'profileImage'` で既存カラムにマッピング

### `src/lib/auth-session.ts` — 新規作成
サーバーコンポーネント/アクション用ヘルパー:
- `getSession()` — `auth.api.getSession({ headers: await headers() })`
- `getCurrentUser()` — 既存と同じインターフェースを維持
- `getCurrentUserId()`

## Step 4: クライアント設定

### `src/lib/auth-client.ts` — 新規作成
```typescript
import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient()
```

## Step 5: API ルート

### `src/app/api/auth/[...all]/route.ts` — 新規作成
```typescript
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
export const { POST, GET } = toNextJsHandler(auth)
```

## Step 6: ミドルウェア

### `src/middleware.ts` — 新規作成
- `getSessionCookie()` で Cookie 存在チェック
- 現時点では認証必須ページはなし（ゲストも閲覧可能）
- 認証チェックは Server Actions 側で実施

## Step 7: 既存コード修正

### インポートパス変更（`@/lib/auth` → `@/lib/auth-session`）
- `src/app/page.tsx`
- `src/app/shadcn/page.tsx`
- `src/components/layout/Toolbar.tsx`

### `src/components/layout/Toolbar.tsx` — ログアウト機能
- ログアウト用の Client Component を作成（`authClient.signOut()`）
- `profileImage` の null チェック追加（nullable 化のため）

### `src/db/validation.ts` — omit に `emailVerified` 追加
```typescript
export const insertUserSchema = createInsertSchema(users).omit({
  id: true, createdAt: true, updatedAt: true, emailVerified: true,
})
```

### `src/actions/user-gear.actions.ts` — 認証チェック追加
- `createUserGearAction` でセッション検証

## Step 8: ログインページ

### `src/app/login/page.tsx` — 新規作成
- 「Google でログイン」ボタン
- `authClient.signIn.social({ provider: 'google', callbackURL: '/' })`

## Step 9: 環境変数

`.env.local` に追加:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
BETTER_AUTH_SECRET=  # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
```

---

## 変更ファイル一覧

| ファイル | 種別 |
|---------|------|
| `src/db/schema/users.ts` | 変更 |
| `src/db/schema/auth.ts` | 新規 |
| `src/db/schema/index.ts` | 変更 |
| `src/db/validation.ts` | 変更 |
| `src/lib/auth.ts` | 書き換え |
| `src/lib/auth-session.ts` | 新規 |
| `src/lib/auth-client.ts` | 新規 |
| `src/app/api/auth/[...all]/route.ts` | 新規 |
| `src/middleware.ts` | 新規 |
| `src/app/login/page.tsx` | 新規 |
| `src/app/page.tsx` | 変更（インポートパス） |
| `src/app/shadcn/page.tsx` | 変更（インポートパス） |
| `src/components/layout/Toolbar.tsx` | 変更 |
| `src/actions/user-gear.actions.ts` | 変更 |

## 検証方法

1. `npx drizzle-kit generate` でマイグレーション SQL を確認
2. `npm run build` がエラーなく通ること
3. `/login` → Google ログイン → `/` にリダイレクト → ユーザー情報が表示されること
4. ブラウザリロードでログイン状態が維持されること
5. ログアウトでセッションが破棄されること
6. 未ログイン状態でもページ閲覧ができること
