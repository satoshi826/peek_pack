# Clerk 認証ガイド

## 📚 目次

1. [Clerkとは](#clerkとは)
2. [基本概念](#基本概念)
3. [セットアップ](#セットアップ)
4. [Next.jsとの統合](#nextjsとの統合)
5. [認証フロー](#認証フロー)
6. [ユーザー情報の取得](#ユーザー情報の取得)
7. [ルート保護](#ルート保護)
8. [Convexとの連携](#convexとの連携)
9. [ベストプラクティス](#ベストプラクティス)

---

## Clerkとは

Clerkは**モダンな認証・ユーザー管理サービス**です。

### 主な特徴

- **簡単な統合**: 数分でNext.jsに認証機能を追加
- **豊富なUI**: プリビルトのサインイン/サインアップコンポーネント
- **OAuth対応**: Google, GitHub, Facebookなど
- **セキュリティ**: MFA、セッション管理、JWT発行
- **カスタマイズ可能**: UIとフローを自由にカスタマイズ

---

## 基本概念

### 1. ユーザー (User)

Clerkが管理するユーザーアカウント。

```typescript
{
  id: "user_xxx",
  emailAddresses: [{
    emailAddress: "user@example.com"
  }],
  firstName: "John",
  lastName: "Doe",
  imageUrl: "https://...",
}
```

### 2. セッション (Session)

ユーザーのログイン状態を管理。

### 3. JWT Token

認証されたユーザーを識別するトークン。Convexなどのバックエンドで検証します。

---

## セットアップ

### 1. Clerkアカウント作成

1. [https://clerk.com/](https://clerk.com/) にアクセス
2. アカウントを作成
3. アプリケーションを作成

### 2. パッケージインストール

```bash
pnpm add @clerk/nextjs
```

### 3. 環境変数設定

`.env.local`に以下を追加:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

---

## Next.jsとの統合

### 1. ClerkProviderの設定

```typescript
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 2. ミドルウェアの設定

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

### 1. サインインボタン

```typescript
"use client";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

export default function AuthButtons() {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <div>
        <p>Welcome, {user.firstName}!</p>
        <SignOutButton>
          <button>Sign Out</button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <SignInButton mode="modal">
      <button>Sign In</button>
    </SignInButton>
  );
}
```

### 2. サインインページ

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

### 3. サインアップページ

```typescript
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

---

## ユーザー情報の取得

### クライアントサイド

```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export default function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <h1>{user.fullName}</h1>
      <p>{user.emailAddresses[0].emailAddress}</p>
      <img src={user.imageUrl} alt="Profile" />
    </div>
  );
}
```

### サーバーサイド

```typescript
// app/profile/page.tsx
import { currentUser } from "@clerk/nextjs/server";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    return <div>Not signed in</div>;
  }

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.emailAddresses[0].emailAddress}</p>
    </div>
  );
}
```

---

## ルート保護

### 1. ミドルウェアでの保護

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/public(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // 認証必須
  }
});
```

### 2. コンポーネントレベルでの保護

```typescript
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return <div>Protected Content</div>;
}
```

---

## Convexとの連携

### 1. JWT Templateの作成

Clerkダッシュボードで:
1. **JWT Templates** → **New template** → **Convex**
2. **Issuer**をコピー
3. **Apply Changes**

### 2. Convex認証設定

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

環境変数:
```bash
CLERK_JWT_ISSUER_DOMAIN=https://your-domain.clerk.accounts.dev/
```

### 3. ConvexProviderWithClerkの使用

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

### 4. Convex関数で認証情報を取得

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
```

### 5. 認証付きクエリ/ミューテーション

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

// 投稿を作成
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
```

---

## ベストプラクティス

### 1. 環境変数の管理

✅ **推奨**
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_JWT_ISSUER_DOMAIN=https://xxx.clerk.accounts.dev/
```

❌ **非推奨**
```typescript
// ハードコード
const publishableKey = "pk_test_xxx"; // 絶対にしない!
```

### 2. ローディング状態の処理

✅ **推奨**
```typescript
const { isLoaded, isSignedIn, user } = useUser();

if (!isLoaded) {
  return <LoadingSpinner />;
}

if (!isSignedIn) {
  return <SignInPrompt />;
}

return <UserContent user={user} />;
```

### 3. エラーハンドリング

```typescript
"use client";

import { useUser } from "@clerk/nextjs";

export default function Component() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }

  if (!user.emailAddresses[0]?.emailAddress) {
    return <div>Email not available</div>;
  }

  return <div>{user.emailAddresses[0].emailAddress}</div>;
}
```

### 4. セキュリティ

✅ **推奨**
- ミドルウェアでルートを保護
- サーバーサイドで認証チェック
- JWT検証をバックエンドで実施

❌ **非推奨**
- クライアントサイドのみで認証チェック
- 認証なしで機密データを表示

### 5. OAuth設定

Clerkダッシュボードで推奨設定:
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Email + Password
- ✅ Magic Links

---

## よくある問題と解決方法

### 問題1: "Unauthenticated" エラー

**原因**: JWT Templateが正しく設定されていない

**解決**:
1. Clerk Dashboard → JWT Templates → Convex
2. `CLERK_JWT_ISSUER_DOMAIN`が正しいか確認
3. Convex devサーバーを再起動

### 問題2: サインインボタンが動作しない

**原因**: 環境変数が読み込まれていない

**解決**:
1. `.env.local`に`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`があるか確認
2. Next.js開発サーバーを再起動

### 問題3: リダイレクトループ

**原因**: ミドルウェアの設定が間違っている

**解決**:
```typescript
// サインインページをパブリックルートに追加
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)", // これを忘れずに!
  "/sign-up(.*)",
]);
```

---

## まとめ

Clerkの主な利点:

1. **簡単な統合**: 数分で認証機能を追加
2. **セキュリティ**: 業界標準のセキュリティ実装
3. **UI/UX**: 美しいプリビルトコンポーネント
4. **柔軟性**: カスタマイズ可能
5. **Convex連携**: シームレスな統合

これらの特徴により、セキュアな認証システムを迅速に構築できます。
