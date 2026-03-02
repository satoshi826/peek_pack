# Peek Pack

## セットアップ

```bash
npm install
```

### 環境変数

| ファイル | 用途 |
|---|---|
| `.env.local` | ローカル開発用 |
| `.env.prod` | 本番用 |

それぞれに `DATABASE_URL` を設定する。

## 開発

```bash
npm run dev
```

## DBマイグレーション

### 1. スキーマを変更する

`src/db/schema/` 配下の `.ts` ファイルを編集する。

### 2. マイグレーションSQLを生成する

```bash
npx drizzle-kit generate
```

`supabase/migrations/` に差分SQLが出力される。

### 3. マイグレーションを適用する

```bash
# ローカル (.env.local)
npx drizzle-kit migrate

# 本番 (.env.prod)
npm run db:migrate:prod
```

### シードデータの投入

```bash
npm run db:seed
```

## デプロイ

`main` ブランチへの push で Vercel に自動デプロイされる。

DBマイグレーションは自動適用されないため、スキーマ変更がある場合は手動で `npm run db:migrate:prod` を実行する。
