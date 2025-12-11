import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ========================================
// User Cameras Queries
// ========================================

// ユーザーのカメラを取得
export const getUserCameras = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userCameras = await ctx.db
      .query("userCameras")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // カメラマスターデータと結合
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

// ユーザーの所有カメラを取得
export const getUserOwnedCameras = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userCameras = await ctx.db
      .query("userCameras")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "owned")
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

// ユーザーの欲しいカメラを取得
export const getUserWantedCameras = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userCameras = await ctx.db
      .query("userCameras")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "wanted")
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
// User Lenses Queries
// ========================================

// ユーザーのレンズを取得
export const getUserLenses = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userLenses = await ctx.db
      .query("userLenses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
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

// ユーザーの所有レンズを取得
export const getUserOwnedLenses = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userLenses = await ctx.db
      .query("userLenses")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "owned")
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

// ユーザーの欲しいレンズを取得
export const getUserWantedLenses = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userLenses = await ctx.db
      .query("userLenses")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "wanted")
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
// User Cameras Mutations
// ========================================

// ユーザーのカメラを追加
export const addUserCamera = mutation({
  args: {
    userId: v.string(),
    cameraMasterId: v.id("cameraMasters"),
    status: v.union(v.literal("owned"), v.literal("wanted")),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userCameras", args);
  },
});

// ユーザーのカメラを更新
export const updateUserCamera = mutation({
  args: {
    id: v.id("userCameras"),
    status: v.optional(v.union(v.literal("owned"), v.literal("wanted"))),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// ユーザーのカメラを削除
export const deleteUserCamera = mutation({
  args: { id: v.id("userCameras") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ========================================
// User Lenses Mutations
// ========================================

// ユーザーのレンズを追加
export const addUserLens = mutation({
  args: {
    userId: v.string(),
    lensMasterId: v.id("lensMasters"),
    status: v.union(v.literal("owned"), v.literal("wanted")),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userLenses", args);
  },
});

// ユーザーのレンズを更新
export const updateUserLens = mutation({
  args: {
    id: v.id("userLenses"),
    status: v.optional(v.union(v.literal("owned"), v.literal("wanted"))),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// ユーザーのレンズを削除
export const deleteUserLens = mutation({
  args: { id: v.id("userLenses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
