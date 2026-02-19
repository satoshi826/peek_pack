import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui_shadcn/badge'
import { getUserOwnedGears, getUserWantedGears, getUserPreviouslyOwnedGears, getCameraMasters, getLensMasters } from '@/actions/user-gear.actions'
import { getCurrentUser } from '@/lib/auth'
import { Typography } from '@/components/ui_shadcn/typography'
import { Flex, Stack, Container } from '@/components/ui_shadcn/layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui_shadcn/avatar'
import { GearTabs } from '@/components/layout/profile/gear-tabs'

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

  const [ownedGears, wantedGears, previouslyOwnedGears, cameraMasters, lensMasters] = await Promise.all([
    getUserOwnedGears(currentUser.id),
    getUserWantedGears(currentUser.id),
    getUserPreviouslyOwnedGears(currentUser.id),
    getCameraMasters(),
    getLensMasters(),
  ])

  return (
    <Container className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-2">
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
        <GearTabs
          ownedGears={ownedGears}
          wantedGears={wantedGears}
          previouslyOwnedGears={previouslyOwnedGears}
          cameraMasters={cameraMasters}
          lensMasters={lensMasters}
          userId={currentUser.id}
        />
      </Stack>
    </Container>
  )
}
