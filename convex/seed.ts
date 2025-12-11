import { mutation } from "./_generated/server";
import { cameraMastersData, lensMastersData } from "./fixtureData";

// データベースにフィクスチャデータをシードする
export const seedDatabase = mutation({
  handler: async (ctx) => {
    // 既存のデータをチェック
    const existingCameras = await ctx.db.query("cameraMasters").collect();
    const existingLenses = await ctx.db.query("lensMasters").collect();

    // データが既に存在する場合はスキップ
    if (existingCameras.length > 0 || existingLenses.length > 0) {
      return {
        success: false,
        message: "Database already seeded",
        cameras: existingCameras.length,
        lenses: existingLenses.length,
      };
    }

    // カメラマスターデータを挿入
    for (const camera of cameraMastersData) {
      await ctx.db.insert("cameraMasters", camera);
    }

    // レンズマスターデータを挿入
    for (const lens of lensMastersData) {
      await ctx.db.insert("lensMasters", lens);
    }

    return {
      success: true,
      message: "Database seeded successfully",
      cameras: cameraMastersData.length,
      lenses: lensMastersData.length,
    };
  },
});

// データベースをリセット(開発用)
export const resetDatabase = mutation({
  handler: async (ctx) => {
    // すべてのデータを削除
    const cameras = await ctx.db.query("cameraMasters").collect();
    const lenses = await ctx.db.query("lensMasters").collect();
    const userCameras = await ctx.db.query("userCameras").collect();
    const userLenses = await ctx.db.query("userLenses").collect();

    for (const camera of cameras) {
      await ctx.db.delete(camera._id);
    }
    for (const lens of lenses) {
      await ctx.db.delete(lens._id);
    }
    for (const userCamera of userCameras) {
      await ctx.db.delete(userCamera._id);
    }
    for (const userLens of userLenses) {
      await ctx.db.delete(userLens._id);
    }

    return {
      success: true,
      message: "Database reset successfully",
      deleted: {
        cameras: cameras.length,
        lenses: lenses.length,
        userCameras: userCameras.length,
        userLenses: userLenses.length,
      },
    };
  },
});
