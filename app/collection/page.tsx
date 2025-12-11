"use client";

import { useConvexAuth } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Link from "next/link";

export default function CollectionPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"owned" | "wanted">("owned");
  const [gearType, setGearType] = useState<"cameras" | "lenses">("cameras");

  // 自分のカメラとレンズを取得
  const ownedCameras = useQuery(
    api.myGear.getMyOwnedCameras,
    isAuthenticated ? undefined : "skip"
  );
  const wantedCameras = useQuery(
    api.myGear.getMyWantedCameras,
    isAuthenticated ? undefined : "skip"
  );
  const ownedLenses = useQuery(
    api.myGear.getMyOwnedLenses,
    isAuthenticated ? undefined : "skip"
  );
  const wantedLenses = useQuery(
    api.myGear.getMyWantedLenses,
    isAuthenticated ? undefined : "skip"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
            Please sign in to view your collection
          </h1>
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:underline"
          >
            Go to home
          </Link>
        </div>
      </div>
    );
  }

  const cameras = activeTab === "owned" ? ownedCameras : wantedCameras;
  const lenses = activeTab === "owned" ? ownedLenses : wantedLenses;
  const currentGear = gearType === "cameras" ? cameras : lenses;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-2 block"
              >
                ← Back to home
              </Link>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                My Collection
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            <Link
              href="/collection/add"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Add Gear
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("owned")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "owned"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            Owned ({(ownedCameras?.length || 0) + (ownedLenses?.length || 0)})
          </button>
          <button
            onClick={() => setActiveTab("wanted")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "wanted"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            Wanted ({(wantedCameras?.length || 0) + (wantedLenses?.length || 0)})
          </button>
        </div>

        {/* Gear Type Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setGearType("cameras")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gearType === "cameras"
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            Cameras ({cameras?.length || 0})
          </button>
          <button
            onClick={() => setGearType("lenses")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              gearType === "lenses"
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            Lenses ({lenses?.length || 0})
          </button>
        </div>

        {/* Gear List */}
        {currentGear && currentGear.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGear.map((item) => {
              const gear = gearType === "cameras" ? item.camera : item.lens;
              if (!gear) return null;

              return (
                <div
                  key={item._id}
                  className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-black dark:text-white">
                        {gear.manufacturer}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {gear.model}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        item.status === "owned"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      }`}
                    >
                      {item.status === "owned" ? "Owned" : "Wanted"}
                    </span>
                  </div>

                  {gearType === "cameras" && "sensor" in gear && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {gear.sensor} • {gear.mount} mount
                    </div>
                  )}

                  {gearType === "lenses" && "focalLength" in gear && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {gear.focalLength} • {gear.aperture} • {gear.mount} mount
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-3 italic">
                      {item.notes}
                    </p>
                  )}

                  {item.purchaseDate && (
                    <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                      Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              No {gearType} in your {activeTab} list yet
            </p>
            <Link
              href="/collection/add"
              className="text-black dark:text-white hover:underline"
            >
              Add your first {gearType === "cameras" ? "camera" : "lens"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
