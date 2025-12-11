import { Auth } from "convex/server";
import { QueryCtx, MutationCtx } from "./_generated/server";

// 認証されたユーザーIDを取得するヘルパー関数
export async function getUserId(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }
  return identity.subject;
}

// 認証されたユーザーIDを取得（オプショナル）
export async function getUserIdOrNull(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}

// ユーザー情報を取得
export async function getUserIdentity(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated");
  }
  return identity;
}
