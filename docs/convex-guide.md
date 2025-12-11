# Convex ガイド

## 📚 目次

1. [Convexとは](#convexとは)
2. [基本概念](#基本概念)
3. [セットアップ](#セットアップ)
4. [スキーマ定義](#スキーマ定義)
5. [クエリとミューテーション](#クエリとミューテーション)
6. [インデックスと検索](#インデックスと検索)
7. [リアルタイム更新](#リアルタイム更新)
8. [ベストプラクティス](#ベストプラクティス)

---

## Convexとは

Convexは**TypeScriptファーストのリアルタイムバックエンド**プラットフォームです。

### 主な特徴

- **リアルタイム同期**: データ変更時に自動的にクライアントが更新される
- **型安全性**: スキーマから自動的にTypeScript型が生成される
- **サーバーレス**: インフラ管理不要、自動スケーリング
- **開発者体験**: シンプルなAPI、優れたローカル開発環境

---

## 基本概念

### 1. スキーマ (Schema)

データベースの構造を定義します。

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
  }),
});
```

### 2. クエリ (Query)

データを**読み取る**関数。リアルタイムで自動更新されます。

```typescript
// convex/users.ts
import { query } from "./_generated/server";

export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
```

### 3. ミューテーション (Mutation)

データを**書き込む**関数。トランザクション保証されます。

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addUser = mutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", args);
  },
});
```

---

## セットアップ

### 1. インストール

```bash
pnpm add convex
```

### 2. 初期化

```bash
npx convex dev
```

これにより:
- `.env.local`に環境変数が追加される
- `convex/`ディレクトリが作成される
- ローカル開発サーバーが起動する

### 3. Next.jsとの統合

```typescript
// app/ConvexClientProvider.tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```

```typescript
// app/layout.tsx
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
```

---

## スキーマ定義

### 基本的なテーブル定義

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // シンプルなテーブル
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.string(),
    createdAt: v.number(),
  }),

  // オプショナルフィールド
  users: defineTable({
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()), // オプショナル
  }),

  // ユニオン型
  tasks: defineTable({
    title: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  }),
});
```

### リレーション (参照)

```typescript
export default defineSchema({
  posts: defineTable({
    title: v.string(),
    authorId: v.id("users"), // usersテーブルへの参照
  }),

  users: defineTable({
    name: v.string(),
  }),
});
```

---

## クエリとミューテーション

### クエリの書き方

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

// 引数なしのクエリ
export const getAllPosts = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").collect();
  },
});

// 引数ありのクエリ
export const getPostById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// フィルタリング
export const getPostsByAuthor = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();
  },
});
```

### ミューテーションの書き方

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// 作成
export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// 更新
export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// 削除
export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
```

### クライアントでの使用

```typescript
"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PostList() {
  // クエリ
  const posts = useQuery(api.posts.getAllPosts);

  // ミューテーション
  const createPost = useMutation(api.posts.createPost);

  const handleCreate = async () => {
    await createPost({
      title: "New Post",
      content: "Content here",
      authorId: "user-123",
    });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Post</button>
      {posts?.map((post) => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  );
}
```

---

## インデックスと検索

### インデックスの定義

```typescript
export default defineSchema({
  posts: defineTable({
    title: v.string(),
    authorId: v.string(),
    category: v.string(),
    createdAt: v.number(),
  })
    // 単一フィールドのインデックス
    .index("by_author", ["authorId"])
    // 複合インデックス
    .index("by_author_and_category", ["authorId", "category"])
    // 検索インデックス
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["authorId", "category"],
    }),
});
```

### インデックスの使用

```typescript
// 単一インデックス
export const getPostsByAuthor = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .collect();
  },
});

// 複合インデックス
export const getPostsByAuthorAndCategory = query({
  args: { authorId: v.string(), category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_author_and_category", (q) =>
        q.eq("authorId", args.authorId).eq("category", args.category)
      )
      .collect();
  },
});

// 検索インデックス
export const searchPosts = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withSearchIndex("search_title", (q) => q.search("title", args.searchTerm))
      .collect();
  },
});
```

---

## リアルタイム更新

### 自動更新の仕組み

Convexのクエリは**リアクティブ**です。データが変更されると、自動的にクライアントが更新されます。

```typescript
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function RealtimeComponent() {
  // このクエリは自動的に更新される
  const posts = useQuery(api.posts.getAllPosts);

  // データが変更されると、自動的に再レンダリングされる
  return (
    <div>
      {posts?.map((post) => (
        <div key={post._id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 条件付きクエリ

```typescript
const userId = useUser()?.id;

// userIdがnullの場合はクエリをスキップ
const myPosts = useQuery(
  api.posts.getPostsByAuthor,
  userId ? { authorId: userId } : "skip"
);
```

---

## ベストプラクティス

### 1. スキーマ設計

✅ **推奨**
```typescript
// 明確なフィールド名
posts: defineTable({
  title: v.string(),
  content: v.string(),
  authorId: v.id("users"),
  publishedAt: v.number(),
})
```

❌ **非推奨**
```typescript
// 曖昧なフィールド名
posts: defineTable({
  t: v.string(), // 何のフィールドか不明
  c: v.string(),
  a: v.string(),
})
```

### 2. インデックスの活用

✅ **推奨**
```typescript
// よく使うクエリにはインデックスを作成
.index("by_author", ["authorId"])
```

❌ **非推奨**
```typescript
// インデックスなしでフィルタリング (遅い)
.filter((q) => q.eq(q.field("authorId"), authorId))
```

### 3. データの正規化

✅ **推奨**
```typescript
// マスターデータとユーザーデータを分離
cameraMasters: defineTable({ ... }),
userCameras: defineTable({
  userId: v.string(),
  cameraMasterId: v.id("cameraMasters"),
}),
```

### 4. エラーハンドリング

```typescript
export const getPost = query({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  },
});
```

### 5. トランザクション

ミューテーションは自動的にトランザクションとして実行されます。

```typescript
export const transferOwnership = mutation({
  args: { postId: v.id("posts"), newOwnerId: v.string() },
  handler: async (ctx, args) => {
    // この2つの操作は原子的に実行される
    await ctx.db.patch(args.postId, { authorId: args.newOwnerId });
    await ctx.db.insert("transfers", {
      postId: args.postId,
      newOwnerId: args.newOwnerId,
      timestamp: Date.now(),
    });
  },
});
```

---

## まとめ

Convexの主な利点:

1. **リアルタイム同期**: WebSocketの設定不要
2. **型安全性**: エンドツーエンドの型チェック
3. **シンプルなAPI**: 学習コストが低い
4. **スケーラビリティ**: 自動スケーリング
5. **開発者体験**: 優れたローカル開発環境

これらの特徴により、モダンなフルスタックアプリケーションを迅速に開発できます。
