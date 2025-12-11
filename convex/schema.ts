import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // カメラマスターデータ - 事前登録済みのカメラ情報
  cameraMasters: defineTable({
    manufacturer: v.string(), // メーカー (Canon, Nikon, Sony等)
    model: v.string(), // モデル名
    releaseYear: v.optional(v.number()), // 発売年
    sensor: v.optional(v.string()), // センサーサイズ (Full-frame, APS-C等)
    mount: v.optional(v.string()), // マウント
    imageUrl: v.optional(v.string()), // 公式画像URL
  })
    .index("by_manufacturer", ["manufacturer"])
    .index("by_model", ["model"])
    .searchIndex("search_cameras", {
      searchField: "model",
      filterFields: ["manufacturer"],
    }),

  // レンズマスターデータ - 事前登録済みのレンズ情報
  lensMasters: defineTable({
    manufacturer: v.string(), // メーカー
    model: v.string(), // モデル名
    focalLength: v.string(), // 焦点距離 (例: "24-70mm")
    aperture: v.string(), // 開放F値 (例: "f/2.8")
    mount: v.string(), // マウント (例: "EF", "Z", "E")
    releaseYear: v.optional(v.number()), // 発売年
    imageUrl: v.optional(v.string()), // 公式画像URL
  })
    .index("by_manufacturer", ["manufacturer"])
    .index("by_mount", ["mount"])
    .searchIndex("search_lenses", {
      searchField: "model",
      filterFields: ["manufacturer", "mount"],
    }),

  // ユーザーのカメラ - ユーザーが所有または欲しいカメラ
  userCameras: defineTable({
    userId: v.string(), // Clerk User ID
    cameraMasterId: v.id("cameraMasters"), // cameraMastersへの参照
    status: v.union(v.literal("owned"), v.literal("wanted")), // 所有 or 欲しい
    purchaseDate: v.optional(v.number()), // 購入日(所有の場合) - timestamp
    notes: v.optional(v.string()), // メモ
  })
    .index("by_user", ["userId"])
    .index("by_camera", ["cameraMasterId"])
    .index("by_user_and_status", ["userId", "status"]),

  // ユーザーのレンズ - ユーザーが所有または欲しいレンズ
  userLenses: defineTable({
    userId: v.string(), // Clerk User ID
    lensMasterId: v.id("lensMasters"), // lensMastersへの参照
    status: v.union(v.literal("owned"), v.literal("wanted")), // 所有 or 欲しい
    purchaseDate: v.optional(v.number()), // 購入日(所有の場合) - timestamp
    notes: v.optional(v.string()), // メモ
  })
    .index("by_user", ["userId"])
    .index("by_lens", ["lensMasterId"])
    .index("by_user_and_status", ["userId", "status"]),

  // フィルタ - 将来実装
  filters: defineTable({
    userId: v.string(),
    manufacturer: v.string(),
    model: v.string(),
    type: v.optional(v.string()),
    size: v.optional(v.string()),
    status: v.union(v.literal("owned"), v.literal("wanted")),
    imageUrl: v.optional(v.string()),
    purchaseDate: v.optional(v.number()),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"]),
});
