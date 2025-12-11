# 📚 ドキュメント

peek_my_packプロジェクトの技術ドキュメントです。

## 📖 ガイド一覧

### [Convexガイド](./convex-guide.md)
Convexの基本概念、セットアップ、使い方を学ぶ

**内容:**
- Convexとは
- スキーマ定義
- クエリとミューテーション
- インデックスと検索
- リアルタイム更新
- ベストプラクティス

### [Clerk認証ガイド](./clerk-guide.md)
Clerk認証の統合方法とベストプラクティス

**内容:**
- Clerkとは
- セットアップ
- Next.jsとの統合
- 認証フロー
- ユーザー情報の取得
- ルート保護
- ベストプラクティス

### [Convex + Clerk統合ガイド](./convex-clerk-integration.md)
ConvexとClerkを連携させる方法

**内容:**
- 統合の概要
- アーキテクチャ
- セットアップ手順
- 認証フロー
- 実装パターン
- セキュリティ
- トラブルシューティング

---

## 🚀 クイックスタート

### 1. 環境構築

```bash
# 依存関係のインストール
pnpm install

# Convex開発サーバー起動
npx convex dev

# Next.js開発サーバー起動
pnpm dev
```

### 2. 環境変数設定

`.env.local`を作成:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
CONVEX_DEPLOYMENT=dev:xxx

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_JWT_ISSUER_DOMAIN=https://xxx.clerk.accounts.dev/
```

### 3. データベースシード

ブラウザで http://localhost:3000 にアクセスし、「Seed Database」ボタンをクリック

---

## 📁 プロジェクト構造

```
peek_my_pack/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト
│   ├── page.tsx                 # ホームページ
│   └── ConvexClientProvider.tsx # Convex + Clerk統合
├── convex/                       # Convexバックエンド
│   ├── schema.ts                # データベーススキーマ
│   ├── auth.config.js           # Clerk認証設定
│   ├── auth.ts                  # 認証ヘルパー関数
│   ├── masters.ts               # マスターデータ関数
│   ├── myGear.ts                # 認証付きギア管理
│   ├── userGear.ts              # ユーザーギア管理
│   ├── fixtureData.ts           # フィクスチャデータ
│   └── seed.ts                  # データベースシード
├── docs/                         # ドキュメント
│   ├── README.md                # このファイル
│   ├── convex-guide.md          # Convexガイド
│   ├── clerk-guide.md           # Clerkガイド
│   └── convex-clerk-integration.md # 統合ガイド
├── middleware.ts                 # Clerkミドルウェア
└── SPECIFICATION.md              # プロジェクト仕様書
```

---

## 🔑 主要な概念

### Convex

- **リアルタイムデータベース**: データ変更時に自動的にUIが更新
- **型安全**: TypeScriptで完全な型チェック
- **サーバーレス**: インフラ管理不要

### Clerk

- **認証サービス**: Google OAuth、Email認証など
- **セキュリティ**: JWT、MFA、セッション管理
- **UI**: プリビルトのサインイン/サインアップコンポーネント

### 統合

- **ConvexProviderWithClerk**: ClerkのJWTをConvexで自動検証
- **認証付きクエリ**: ログインユーザーのデータのみアクセス
- **セキュリティ**: サーバーサイドで所有者チェック

---

## 💡 よく使うコマンド

```bash
# 開発サーバー起動
pnpm dev

# Convex開発サーバー起動
npx convex dev

# データベースリセット
# Convex Dashboardで seed.resetDatabase を実行

# ビルド
pnpm build

# 本番環境起動
pnpm start
```

---

## 🐛 トラブルシューティング

### Convex接続エラー

```bash
# Convex devサーバーを再起動
npx convex dev
```

### Clerk認証エラー

1. `.env.local`の環境変数を確認
2. Clerk Dashboard → JWT Templates → Convex
3. Issuerが正しいか確認
4. Next.js開発サーバーを再起動

### 型エラー

```bash
# Convexの型を再生成
npx convex dev
```

---

## 📚 参考リンク

- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

## 🤝 コントリビューション

このプロジェクトは学習目的で作成されています。
改善提案やバグ報告は歓迎します!
