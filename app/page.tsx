"use client";

import { useConvexAuth } from "convex/react";
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const cameras = useQuery(api.masters.getAllCameraMasters);
  const lenses = useQuery(api.masters.getAllLensMasters);
  const seedDatabase = useMutation(api.seed.seedDatabase);

  // 認証済みユーザーの自分のカメラとレンズを取得
  const myCameras = useQuery(
    api.myGear.getMyCameras,
    isAuthenticated ? undefined : "skip"
  );
  const myLenses = useQuery(
    api.myGear.getMyLenses,
    isAuthenticated ? undefined : "skip"
  );

  const handleSeed = async () => {
    try {
      const result = await seedDatabase();
      alert(JSON.stringify(result, null, 2));
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            peek_my_pack
          </h1>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.emailAddresses[0]?.emailAddress}
                </div>
                <UserButton />
                <SignOutButton>
                  <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-black dark:text-white">
                My Collection
              </h2>
              <Link
                href="/collection"
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-3xl font-bold text-black dark:text-white">
                  {(myCameras?.length || 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cameras
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="text-3xl font-bold text-black dark:text-white">
                  {(myLenses?.length || 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Lenses
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={handleSeed}
            className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Seed Database
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              Cameras ({cameras?.length || 0})
            </h2>
            <div className="space-y-2">
              {cameras?.slice(0, 5).map((camera) => (
                <div
                  key={camera._id}
                  className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                >
                  <div className="font-medium text-black dark:text-white">
                    {camera.manufacturer} {camera.model}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {camera.sensor} • {camera.mount} mount
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              Lenses ({lenses?.length || 0})
            </h2>
            <div className="space-y-2">
              {lenses?.slice(0, 5).map((lens) => (
                <div
                  key={lens._id}
                  className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                >
                  <div className="font-medium text-black dark:text-white">
                    {lens.manufacturer} {lens.model}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {lens.focalLength} • {lens.aperture} • {lens.mount} mount
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
