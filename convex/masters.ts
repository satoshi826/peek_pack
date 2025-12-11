import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ========================================
// Camera Masters Queries
// ========================================

// すべてのカメラマスターデータを取得
export const getAllCameraMasters = query({
  handler: async (ctx) => {
    return await ctx.db.query("cameraMasters").collect();
  },
});

// メーカーでカメラを検索
export const searchCamerasByManufacturer = query({
  args: { manufacturer: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cameraMasters")
      .withIndex("by_manufacturer", (q) =>
        q.eq("manufacturer", args.manufacturer)
      )
      .collect();
  },
});

// カメラを検索 (モデル名)
export const searchCameras = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cameraMasters")
      .withSearchIndex("search_cameras", (q) =>
        q.search("model", args.searchTerm)
      )
      .collect();
  },
});

// ========================================
// Lens Masters Queries
// ========================================

// すべてのレンズマスターデータを取得
export const getAllLensMasters = query({
  handler: async (ctx) => {
    return await ctx.db.query("lensMasters").collect();
  },
});

// マウントでレンズを検索
export const searchLensesByMount = query({
  args: { mount: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lensMasters")
      .withIndex("by_mount", (q) => q.eq("mount", args.mount))
      .collect();
  },
});

// レンズを検索 (モデル名)
export const searchLenses = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lensMasters")
      .withSearchIndex("search_lenses", (q) =>
        q.search("model", args.searchTerm)
      )
      .collect();
  },
});

// ========================================
// Camera Masters Mutations
// ========================================

// カメラマスターデータを追加
export const addCameraMaster = mutation({
  args: {
    manufacturer: v.string(),
    model: v.string(),
    releaseYear: v.optional(v.number()),
    sensor: v.optional(v.string()),
    mount: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cameraMasters", args);
  },
});

// ========================================
// Lens Masters Mutations
// ========================================

// レンズマスターデータを追加
export const addLensMaster = mutation({
  args: {
    manufacturer: v.string(),
    model: v.string(),
    focalLength: v.string(),
    aperture: v.string(),
    mount: v.string(),
    releaseYear: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lensMasters", args);
  },
});
