import Link from 'next/link'
import { Button } from '@/components/ui_shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui_shadcn/card'
import { Badge } from '@/components/ui_shadcn/badge'
import { getUserGears, getUserOwnedGears, getUserWantedGears } from '@/actions/user-gear.actions'
import { getCurrentUser } from '@/lib/auth'
import { Camera, Aperture } from 'lucide-react'
import { Typography } from '@/components/ui_shadcn/typography'
import { Flex, Grid, Stack, Container } from '@/components/ui_shadcn/layout'

export default async function Home() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
        <Container className="text-center py-20">
          <Typography variant="h3">ログインが必要です</Typography>
          <Typography variant="muted" className="mt-4">マイギアを表示するにはログインしてください。</Typography>
        </Container>
      </main>
    )
  }

  const allGears = await getUserGears(currentUser.id)
  const ownedGears = await getUserOwnedGears(currentUser.id)
  const wantedGears = await getUserWantedGears(currentUser.id)

  const cameras = ownedGears.filter(g => g.gearType === 'camera')
  const lenses = ownedGears.filter(g => g.gearType === 'lens')

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <Container>
        <Stack spacing={8}>
          {/* Header */}
          <Stack spacing={4} className="text-center">
            <Typography variant="h1">マイギア</Typography>
            <Typography variant="lead">
              {currentUser.name}
              さんのカメラとレンズのコレクション
            </Typography>
            <Flex gap={4} justify="center" className="pt-4">
              <Button size="lg" asChild>
                <Link href="/gears/new">ギアを追加</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/gears">すべてのギア</Link>
              </Button>
            </Flex>
          </Stack>

          {/* Statistics */}
          <Grid gap={6} mdCols={2} lgCols={4}>
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
          </Grid>

          {/* Owned Gears */}
          <Card>
            <CardHeader>
              <Flex justify="between" align="center">
                <div>
                  <CardTitle>所有ギア</CardTitle>
                  <CardDescription>現在所有しているカメラとレンズ</CardDescription>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/gears">すべて見る</Link>
                </Button>
              </Flex>
            </CardHeader>
            <CardContent>
              {ownedGears.length === 0
                ? <Typography variant="muted" className="text-center py-8">所有ギアがありません</Typography>

                : (
                    <Grid gap={4} mdCols={2}>
                      {ownedGears.map(gear => (
                        <Link
                          key={gear.id}
                          href={`/gears/${gear.id}`}
                          className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <Flex align="start" gap={3}>
                            <div className="mt-1">
                              {gear.gearType === 'camera'
                                ? <Camera className="h-5 w-5 text-blue-600" />

                                : <Aperture className="h-5 w-5 text-purple-600" />}
                            </div>
                            <div className="flex-1">
                              <Flex align="start" justify="between">
                                <div>
                                  <Typography variant="large" className="text-base">{gear.masterName || gear.customName}</Typography>
                                  <Typography variant="muted">
                                    {gear.makerName || '不明なメーカー'}
                                  </Typography>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                  {gear.gearType === 'camera'
                                    ? 'カメラ'
                                    : 'レンズ'}
                                </Badge>
                              </Flex>
                              {gear.comment
                                && <Typography variant="muted" className="mt-2">{gear.comment}</Typography>}
                            </div>
                          </Flex>
                        </Link>
                      ))}
                    </Grid>
                  )}
            </CardContent>
          </Card>

          {/* Wanted Gears */}
          {wantedGears.length > 0
            && (
              <Card>
                <CardHeader>
                  <CardTitle>欲しいギア</CardTitle>
                  <CardDescription>購入予定のカメラとレンズ</CardDescription>
                </CardHeader>
                <CardContent>
                  <Grid gap={4} mdCols={2}>
                    {wantedGears.map(gear => (
                      <div key={gear.id} className="p-4 rounded-lg border">
                        <Flex align="start" gap={3}>
                          <div className="mt-1">
                            {gear.gearType === 'camera'
                              ? <Camera className="h-5 w-5 text-slate-400" />

                              : <Aperture className="h-5 w-5 text-slate-400" />}
                          </div>
                          <div className="flex-1">
                            <Flex align="start" justify="between">
                              <div>
                                <Typography variant="large" className="text-base">{gear.masterName || gear.customName}</Typography>
                                <Typography variant="muted">
                                  {gear.makerName || '不明なメーカー'}
                                </Typography>
                              </div>
                              <Badge variant="secondary" className="ml-2">
                                欲しい
                              </Badge>
                            </Flex>
                            {gear.comment
                              && <Typography variant="muted" className="mt-2">{gear.comment}</Typography>}
                          </div>
                        </Flex>
                      </div>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
        </Stack>
      </Container>
    </main>
  )
}
