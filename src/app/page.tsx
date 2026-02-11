import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui_shadcn/badge'
import { getUserOwnedGears, getUserWantedGears, getUserPreviouslyOwnedGears } from '@/actions/user-gear.actions'
import { getCurrentUser } from '@/lib/auth'
import { Typography } from '@/components/ui_shadcn/typography'
import { Flex, Stack, Container } from '@/components/ui_shadcn/layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui_shadcn/avatar'
import { GearTabs } from '@/components/gear-tabs'

export default async function Home() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) p-8">
        <Container className="text-center py-20">
          <Typography variant="h3">ログインが必要です</Typography>
          <Typography variant="muted" className="mt-4">マイギアを表示するにはログインしてください。</Typography>
        </Container>
      </main>
    )
  }

  const [ownedGears, wantedGears, previouslyOwnedGears] = await Promise.all([
    getUserOwnedGears(currentUser.id),
    getUserWantedGears(currentUser.id),
    getUserPreviouslyOwnedGears(currentUser.id),
  ])

  return (
    <Container className="p-8 min-h-[calc(100vh-4rem)] bg-(--neumo-base)">
      <Stack spacing={8}>
        {/* User Profile */}
        <Card variant="inset">
          <CardContent>
            <Flex align="center" gap={6}>
              <Avatar className="size-20">
                <AvatarImage src="https://github.com/shadcn.png" alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <Stack spacing={2}>
                <div>
                  <Typography variant="h2">{currentUser.name}</Typography>
                  <Typography variant="muted">{currentUser.email}</Typography>
                </div>
                <Flex gap={2}>
                  <Badge variant="secondary">
                    {ownedGears.length}
                    個のギア
                  </Badge>
                </Flex>
              </Stack>
            </Flex>
          </CardContent>
        </Card>

        {/* Statistics */}
        {/* <Grid gap={6} mdCols={2} lgCols={4}>
            <Card>
            <CardHeader className="pb-2">
              <CardDescription>総ギア数</CardDescription>
              <CardTitle className="text-4xl">{allGears.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>所有中</CardDescription>
              <CardTitle className="text-4xl">{ownedGears.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>カメラ</CardDescription>
              <CardTitle className="text-4xl">{cameras.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>レンズ</CardDescription>
              <CardTitle className="text-4xl">{lenses.length}</CardTitle>
            </CardHeader>
          </Card>
        </Grid> */}

        <GearTabs
          ownedGears={ownedGears}
          wantedGears={wantedGears}
          previouslyOwnedGears={previouslyOwnedGears}
        />
      </Stack>
    </Container>
  )
}
