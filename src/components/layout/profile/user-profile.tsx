import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui_shadcn/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui_shadcn/avatar'
import { Typography } from '@/components/ui_shadcn/typography'
import { Flex, Stack } from '@/components/ui_shadcn/layout'
import { GearTabs } from './gear-tabs'
import type { UserGearWithDetails } from '@/types/user-gear'

type Props = {
  user: {
    id: string
    username?: string | null
    name: string
    profileImage: string | null
    email?: string
    bio?: string | null
  }
  ownedGears: UserGearWithDetails[]
  wantedGears: UserGearWithDetails[]
  previouslyOwnedGears: UserGearWithDetails[]
  editable?: boolean
}

export function UserProfile({ user, ownedGears, wantedGears, previouslyOwnedGears, editable }: Props) {
  return (
    <Stack spacing={8}>
      <Card variant="inset">
        <CardContent>
          <Flex align="center" gap={6}>
            <Avatar className="size-20">
              {user.profileImage && <AvatarImage src={user.profileImage} alt={user.name} />}
              <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Stack spacing={2}>
              <div>
                <Typography variant="h2">{user.name}</Typography>
                {user.username && (
                  <Typography variant="muted">
                    @
                    {user.username}
                  </Typography>
                )}
                {user.bio && <Typography variant="muted">{user.bio}</Typography>}
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
        userId={user.id}
        editable={editable}
      />
    </Stack>
  )
}
