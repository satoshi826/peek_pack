import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui_shadcn/avatar'
import { Typography } from '@/components/ui_shadcn/typography'
import { Flex, Stack } from '@/components/ui_shadcn/layout'
import { GearTabsLoader } from './gear-tabs-loader'

type Props = {
  user: {
    id: string
    username?: string | null
    name: string
    profileImage: string | null
    email?: string
    bio?: string | null
  }
  editable?: boolean
}

export function UserProfile({ user, editable }: Props) {
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
              <Typography variant="h2">{user.name}</Typography>
              {user.username && (
                <Typography variant="muted">
                  @
                  {user.username}
                </Typography>
              )}
              {user.bio && <Typography variant="muted">{user.bio}</Typography>}
            </Stack>
          </Flex>
        </CardContent>
      </Card>
      <GearTabsLoader userId={user.id} editable={editable} />
    </Stack>
  )
}
