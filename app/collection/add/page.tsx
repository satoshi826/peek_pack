"use client";

import { useConvexAuth } from "convex/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function AddGearPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  const [gearType, setGearType] = useState<"camera" | "lens">("camera");
  const [status, setStatus] = useState<"owned" | "wanted">("owned");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGearId, setSelectedGearId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  // マスターデータを取得
  const allCameras = useQuery(api.masters.getAllCameraMasters);
  const allLenses = useQuery(api.masters.getAllLensMasters);

  // ミューテーション
  const addCamera = useMutation(api.myGear.addMyCamera);
  const addLens = useMutation(api.myGear.addMyLens);

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
            Please sign in to add gear
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

  // 検索フィルタリング
  const cameras = allCameras?.filter(
    (camera) =>
      camera.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      camera.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lenses = allLenses?.filter(
    (lens) =>
      lens.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lens.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentGearList = gearType === "camera" ? cameras : lenses;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGearId) {
      alert("Please select a gear");
      return;
    }

    try {
      if (gearType === "camera") {
        await addCamera({
          cameraMasterId: selectedGearId as Id<"cameraMasters">,
          status,
          notes: notes || undefined,
          purchaseDate: purchaseDate ? new Date(purchaseDate).getTime() : undefined,
        });
      } else {
        await addLens({
          lensMasterId: selectedGearId as Id<"lensMasters">,
          status,
          notes: notes || undefined,
          purchaseDate: purchaseDate ? new Date(purchaseDate).getTime() : undefined,
        });
      }

      router.push("/collection");
    } catch (error) {
      console.error("Error adding gear:", error);
      alert("Failed to add gear. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/collection"
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline mb-2 block"
          >
            ← Back to collection
          </Link>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Add Gear
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Gear Type Selection */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Gear Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setGearType("camera");
                  setSelectedGearId("");
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  gearType === "camera"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                }`}
              >
                Camera
              </button>
              <button
                type="button"
                onClick={() => {
                  setGearType("lens");
                  setSelectedGearId("");
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  gearType === "lens"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                }`}
              >
                Lens
              </button>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStatus("owned")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  status === "owned"
                    ? "bg-green-600 dark:bg-green-700 text-white"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                }`}
              >
                Owned
              </button>
              <button
                type="button"
                onClick={() => setStatus("wanted")}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  status === "wanted"
                    ? "bg-blue-600 dark:bg-blue-700 text-white"
                    : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                }`}
              >
                Wanted
              </button>
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Search {gearType === "camera" ? "Camera" : "Lens"}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search by manufacturer or model...`}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Gear Selection */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Select {gearType === "camera" ? "Camera" : "Lens"}
            </label>
            <div className="max-h-96 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg">
              {currentGearList && currentGearList.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {currentGearList.map((gear) => (
                    <button
                      key={gear._id}
                      type="button"
                      onClick={() => setSelectedGearId(gear._id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                        selectedGearId === gear._id
                          ? "bg-gray-100 dark:bg-gray-800"
                          : ""
                      }`}
                    >
                      <div className="font-medium text-black dark:text-white">
                        {gear.manufacturer} {gear.model}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {gearType === "camera" && "sensor" in gear
                          ? `${gear.sensor} • ${gear.mount} mount`
                          : "focalLength" in gear
                          ? `${gear.focalLength} • ${gear.aperture} • ${gear.mount} mount`
                          : ""}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-500">
                  No {gearType === "camera" ? "cameras" : "lenses"} found
                </div>
              )}
            </div>
          </div>

          {/* Purchase Date (for owned items) */}
          {status === "owned" && (
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Purchase Date (Optional)
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add any notes about this gear..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!selectedGearId}
              className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Collection
            </button>
            <Link
              href="/collection"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
