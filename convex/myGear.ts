import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getUserId } from "./auth";

// ========================================
// My Cameras Queries (認証必須)
// ========================================

// 自分のカメラを取得
export const getMyCameras = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const userCameras = await ctx.db
      .query("userCameras")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return await Promise.all(
      userCameras.map(async (userCamera) => {
        const cameraMaster = await ctx.db.get(userCamera.cameraMasterId);
        return {
          ...userCamera,
          camera: cameraMaster,
        };
      })
    );
  },
});

// 自分の所有カメラを取得
export const getMyOwnedCameras = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const userCameras = await ctx.db
      .query("userCameras")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", userId).eq("status", "owned")
      )
      .collect();

    return await Promise.all(
      userCameras.map(async (userCamera) => {
        const cameraMaster = await ctx.db.get(userCamera.cameraMasterId);
        return {
          ...userCamera,
          camera: cameraMaster,
        };
      })
    );
  },
});

// 自分の欲しいカメラを取得
export const getMyWantedCameras = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const userCameras = await ctx.db
      .query("userCameras")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", userId).eq("status", "wanted")
      )
      .collect();

    return await Promise.all(
      userCameras.map(async (userCamera) => {
        const cameraMaster = await ctx.db.get(userCamera.cameraMasterId);
        return {
          ...userCamera,
          camera: cameraMaster,
        };
      })
    );
  },
});

// ========================================
// My Lenses Queries (認証必須)
// ========================================

// 自分のレンズを取得
export const getMyLenses = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const userLenses = await ctx.db
      .query("userLenses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return await Promise.all(
      userLenses.map(async (userLens) => {
        const lensMaster = await ctx.db.get(userLens.lensMasterId);
        return {
          ...userLens,
          lens: lensMaster,
        };
      })
    );
  },
});

// 自分の所有レンズを取得
export const getMyOwnedLenses = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const userLenses = await ctx.db
      .query("userLenses")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", userId).eq("status", "owned")
      )
      .collect();

    return await Promise.all(
      userLenses.map(async (userLens) => {
        const lensMaster = await ctx.db.get(userLens.lensMasterId);
        return {
          ...userLens,
          lens: lensMaster,
        };
      })
    );
  },
});

// 自分の欲しいレンズを取得
export const getMyWantedLenses = query({
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const userLenses = await ctx.db
      .query("userLenses")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", userId).eq("status", "wanted")
      )
      .collect();

    return await Promise.all(
      userLenses.map(async (userLens) => {
        const lensMaster = await ctx.db.get(userLens.lensMasterId);
        return {
          ...userLens,
          lens: lensMaster,
        };
      })
    );
  },
});

// ========================================
// My Cameras Mutations (認証必須)
// ========================================

// 自分のカメラを追加
export const addMyCamera = mutation({
  args: {
    cameraMasterId: v.id("cameraMasters"),
    status: v.union(v.literal("owned"), v.literal("wanted")),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    return await ctx.db.insert("userCameras", {
      userId,
      ...args,
    });
  },
});

// 自分のカメラを更新
export const updateMyCamera = mutation({
  args: {
    id: v.id("userCameras"),
    status: v.optional(v.union(v.literal("owned"), v.literal("wanted"))),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const { id, ...updates } = args;

    // 自分のカメラかチェック
    const userCamera = await ctx.db.get(id);
    if (!userCamera || userCamera.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, updates);
  },
});

// 自分のカメラを削除
export const deleteMyCamera = mutation({
  args: { id: v.id("userCameras") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // 自分のカメラかチェック
    const userCamera = await ctx.db.get(args.id);
    if (!userCamera || userCamera.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});

// ========================================
// My Lenses Mutations (認証必須)
// ========================================

// 自分のレンズを追加
export const addMyLens = mutation({
  args: {
    lensMasterId: v.id("lensMasters"),
    status: v.union(v.literal("owned"), v.literal("wanted")),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    return await ctx.db.insert("userLenses", {
      userId,
      ...args,
    });
  },
});

// 自分のレンズを更新
export const updateMyLens = mutation({
  args: {
    id: v.id("userLenses"),
    status: v.optional(v.union(v.literal("owned"), v.literal("wanted"))),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const { id, ...updates } = args;

    // 自分のレンズかチェック
    const userLens = await ctx.db.get(id);
    if (!userLens || userLens.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id, updates);
  },
});

// 自分のレンズを削除
export const deleteMyLens = mutation({
  args: { id: v.id("userLenses") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // 自分のレンズかチェック
    const userLens = await ctx.db.get(args.id);
    if (!userLens || userLens.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
  },
});
