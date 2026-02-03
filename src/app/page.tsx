import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserGears, getUserOwnedGears, getUserWantedGears } from "@/actions/user-gear.actions";
import { getCurrentUser } from "@/lib/auth";
import { Camera, Aperture } from "lucide-react";
import { TypographyH1, TypographyLead, TypographyH3, TypographyMuted, TypographyLarge } from "@/components/ui/typography";

export default async function Home() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
        <div className="max-w-6xl mx-auto text-center py-20">
          <TypographyH3>ログインが必要です</TypographyH3>
          <TypographyMuted className="mt-4">マイギアを表示するにはログインしてください。</TypographyMuted>
        </div>
      </main>
    );
  }

  const allGears = await getUserGears(currentUser.id);
  const ownedGears = await getUserOwnedGears(currentUser.id);
  const wantedGears = await getUserWantedGears(currentUser.id);

  const cameras = ownedGears.filter((g) => g.gearType === "camera");
  const lenses = ownedGears.filter((g) => g.gearType === "lens");

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <TypographyH1>マイギア</TypographyH1>
          <TypographyLead>
            {currentUser.name}さんのカメラとレンズのコレクション
          </TypographyLead>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/gears/new">ギアを追加</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/gears">すべてのギア</Link>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>総ギア数</CardDescription>
              <CardTitle className="text-4xl">{allGears.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>所有中</CardDescription>
              <CardTitle className="text-4xl text-green-600">{ownedGears.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>カメラ</CardDescription>
              <CardTitle className="text-4xl text-blue-600">{cameras.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>レンズ</CardDescription>
              <CardTitle className="text-4xl text-purple-600">{lenses.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Owned Gears */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>所有ギア</CardTitle>
                <CardDescription>現在所有しているカメラとレンズ</CardDescription>
              </div>
              <Button variant="outline" asChild>
                <Link href="/gears">すべて見る</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {ownedGears.length === 0 ? (
              <TypographyMuted className="text-center py-8">所有ギアがありません</TypographyMuted>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {ownedGears.map((gear) => (
                  <Link
                    key={gear.id}
                    href={`/gears/${gear.id}`}
                    className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {gear.gearType === "camera" ? (
                          <Camera className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Aperture className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <TypographyLarge className="text-base">{gear.masterName || gear.customName}</TypographyLarge>
                            <TypographyMuted>
                              {gear.makerName || "不明なメーカー"}
                            </TypographyMuted>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {gear.gearType === "camera" ? "カメラ" : "レンズ"}
                          </Badge>
                        </div>
                        {gear.comment && (
                          <TypographyMuted className="mt-2">{gear.comment}</TypographyMuted>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wanted Gears */}
        {wantedGears.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>欲しいギア</CardTitle>
              <CardDescription>購入予定のカメラとレンズ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {wantedGears.map((gear) => (
                  <div key={gear.id} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {gear.gearType === "camera" ? (
                          <Camera className="h-5 w-5 text-slate-400" />
                        ) : (
                          <Aperture className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <TypographyLarge className="text-base">{gear.masterName || gear.customName}</TypographyLarge>
                            <TypographyMuted>
                              {gear.makerName || "不明なメーカー"}
                            </TypographyMuted>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            欲しい
                          </Badge>
                        </div>
                        {gear.comment && (
                          <TypographyMuted className="mt-2">{gear.comment}</TypographyMuted>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
