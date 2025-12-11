# Convex + Clerk 統合ガイド

## 📚 目次

1. [統合の概要](#統合の概要)
2. [アーキテクチャ](#アーキテクチャ)
3. [セットアップ手順](#セットアップ手順)
4. [認証フロー](#認証フロー)
5. [実装パターン](#実装パターン)
6. [セキュリティ](#セキュリティ)
7. [トラブルシューティング](#トラブルシューティング)

---

## 統合の概要

Convex + Clerkの統合により、**型安全でリアルタイムな認証付きアプリケーション**を構築できます。

### 統合のメリット

- **シームレスな認証**: ClerkのJWTをConvexが自動検証
- **型安全性**: エンドツーエンドのTypeScript型チェック
- **リアルタイム**: 認証されたユーザーのデータが自動更新
- **セキュリティ**: 業界標準のセキュリティ実装

---

## アーキテクチャ

### データフロー

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │
       │ 1. Sign In
       ▼
┌─────────────┐
│    Clerk    │ ← OAuth Provider (Google, GitHub)
│   (Auth)    │
└──────┬──────┘
       │
       │ 2. JWT Token
       ▼
┌─────────────┐
│  Next.js    │
│   Client    │
└──────┬──────┘
       │
       │ 3. Query/Mutation with JWT
       ▼
┌─────────────┐
│   Convex    │
│ (Backend)   │ ← 4. Verify JWT
└──────┬──────┘
       │
       │ 5. Authenticated Data
       ▼
┌─────────────┐
│  Database   │
└─────────────┘
```

### コンポーネント構成

```
app/
├── layout.tsx                    # ClerkProvider + ConvexProvider
├── ConvexClientProvider.tsx      # Clerk + Convex統合
└── page.tsx                      # 認証UI

convex/
├── auth.config.js                # Clerk JWT設定
├── auth.ts                       # 認証ヘルパー関数
├── schema.ts                     # データベーススキーマ
└── myData.ts                     # 認証付きクエリ/ミューテーション

middleware.ts                     # ルート保護
```

---

## セットアップ手順

### 1. パッケージインストール

```bash
pnpm add convex @clerk/nextjs
```

### 2. Clerk設定

#### 2.1 Clerkアプリケーション作成

1. [clerk.com](https://clerk.com) でアカウント作成
2. アプリケーション作成
3. OAuth設定 (Google, GitHub等)

#### 2.2 環境変数設定

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

#### 2.3 JWT Template作成

1. Clerk Dashboard → **JWT Templates**
2. **New template** → **Convex**
3. **Issuer**をコピー
4. 環境変数に追加:

```bash
CLERK_JWT_ISSUER_DOMAIN=https://your-domain.clerk.accounts.dev/
```

### 3. Convex設定

#### 3.1 Convex初期化

```bash
npx convex dev
```

#### 3.2 認証設定ファイル作成

```javascript
// convex/auth.config.js
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```

### 4. Next.js統合

#### 4.1 ConvexClientProvider作成

```typescript
// app/ConvexClientProvider.tsx
"use client";

import { ReactNode } from "react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

#### 4.2 Layout更新

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

#### 4.3 ミドルウェア設定

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)", "/"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## 認証フロー

### 1. ユーザーサインイン

```typescript
"use client";

import { SignInButton, useUser } from "@clerk/nextjs";

export default function AuthButton() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return <div>Welcome, {user.firstName}!</div>;
  }

  return (
    <SignInButton mode="modal">
      <button>Sign In</button>
    </SignInButton>
  );
}
```

### 2. 認証状態の確認

```typescript
"use client";

import { useConvexAuth } from "convex/react";

export default function Component() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return <div>Authenticated content</div>;
}
```

### 3. Convexでユーザー情報取得

```typescript
// convex/auth.ts
import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }
  return identity.subject; // Clerk User ID
}

export async function getUserIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }
  return identity;
}
```

---

## 実装パターン

### パターン1: 自分のデータのみアクセス

```typescript
// convex/posts.ts
import { query, mutation } from "./_generated/server";
import { getUserId } from "./auth";
import { v } from "convex/values";

// 自分の投稿を取得
export const getMyPosts = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .collect();
  },
});

// 投稿を作成 (自動的に自分のuserIdを設定)
export const createPost = mutation({
  args: { title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    return await ctx.db.insert("posts", {
      ...args,
      authorId: userId,
      createdAt: Date.now(),
    });
  },
});

// 投稿を更新 (自分の投稿のみ)
export const updatePost = mutation({
  args: {
    id: v.id("posts"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const { id, ...updates } = args;

    // 所有者チェック
    const post = await ctx.db.get(id);
    if (!post || post.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, updates);
  },
});
```

### パターン2: 公開データと非公開データ

```typescript
// 公開データ (認証不要)
export const getPublicPosts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
      .collect();
  },
});

// 非公開データ (認証必須)
export const getPrivatePosts = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("posts")
      .withIndex("by_author_and_visibility", (q) =>
        q.eq("authorId", userId).eq("visibility", "private")
      )
      .collect();
  },
});
```

### パターン3: オプショナル認証

```typescript
// convex/auth.ts
export async function getUserIdOrNull(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}

// convex/posts.ts
export const getPosts = query({
  handler: async (ctx) => {
    const userId = await getUserIdOrNull(ctx);

    if (userId) {
      // 認証済み: 自分の投稿 + 公開投稿
      return await ctx.db
        .query("posts")
        .filter((q) =>
          q.or(
            q.eq(q.field("authorId"), userId),
            q.eq(q.field("visibility"), "public")
          )
        )
        .collect();
    } else {
      // 未認証: 公開投稿のみ
      return await ctx.db
        .query("posts")
        .withIndex("by_visibility", (q) => q.eq("visibility", "public"))
        .collect();
    }
  },
});
```

---

## セキュリティ

### 1. 常にサーバーサイドで検証

✅ **推奨**
```typescript
// Convex関数内で認証チェック
export const deletePost = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx); // 認証必須
    const post = await ctx.db.get(args.id);

    if (!post || post.authorId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
```

❌ **非推奨**
```typescript
// クライアントサイドのみで認証チェック (危険!)
"use client";
export default function DeleteButton({ postId }) {
  const { user } = useUser();

  // これだけでは不十分!
  if (!user) return null;

  return <button onClick={() => deletePost({ id: postId })}>Delete</button>;
}
```

### 2. 最小権限の原則

```typescript
// ユーザーは自分のデータのみアクセス可能
export const updateProfile = mutation({
  args: { bio: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // 自分のプロフィールのみ更新
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!profile) {
      throw new Error("Profile not found");
    }

    await ctx.db.patch(profile._id, { bio: args.bio });
  },
});
```

### 3. データの分離

```typescript
// マスターデータ (公開)
export default defineSchema({
  cameraMasters: defineTable({
    manufacturer: v.string(),
    model: v.string(),
  }),

  // ユーザーデータ (非公開)
  userCameras: defineTable({
    userId: v.string(), // Clerk User ID
    cameraMasterId: v.id("cameraMasters"),
    status: v.union(v.literal("owned"), v.literal("wanted")),
  }).index("by_user", ["userId"]),
});
```

---

## トラブルシューティング

### 問題1: "Unauthenticated" エラー

**症状**: Convex関数で認証エラー

**原因**:
- JWT Templateが正しく設定されていない
- `CLERK_JWT_ISSUER_DOMAIN`が間違っている

**解決**:
1. Clerk Dashboard → JWT Templates → Convex
2. Issuerが正しいか確認
3. `.env.local`の`CLERK_JWT_ISSUER_DOMAIN`を確認
4. Convex devサーバーを再起動

### 問題2: リアルタイム更新が動作しない

**症状**: データ変更時にUIが更新されない

**原因**: `ConvexProviderWithClerk`が正しく設定されていない

**解決**:
```typescript
// 正しい設定
<ConvexProviderWithClerk useAuth={useAuth} client={convex}>
  {children}
</ConvexProviderWithClerk>
```

### 問題3: 無限ループ

**症状**: サインインページにリダイレクトされ続ける

**原因**: ミドルウェアでサインインページが保護されている

**解決**:
```typescript
// サインインページをパブリックルートに追加
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)", // 必須!
  "/sign-up(.*)",
  "/",
]);
```

---

## まとめ

### Convex + Clerk統合の利点

1. **簡単なセットアップ**: 数ステップで認証機能を追加
2. **型安全性**: エンドツーエンドのTypeScript型チェック
3. **リアルタイム**: 認証されたユーザーのデータが自動更新
4. **セキュリティ**: JWT検証、所有者チェック
5. **開発者体験**: シンプルなAPI、優れたドキュメント

### 推奨される使い方

- ✅ Convex関数で認証チェック
- ✅ 自分のデータのみアクセス
- ✅ 所有者チェックを実装
- ✅ 公開データと非公開データを分離
- ✅ エラーハンドリングを適切に実装

この統合により、セキュアでスケーラブルな認証付きアプリケーションを迅速に構築できます。
