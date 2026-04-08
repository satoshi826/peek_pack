import { notFound } from 'next/navigation'
import { findUserByUsername } from '@/db/queries/user'
import { getUserGearsByStatus } from '@/actions/user-gear.actions'
import { UserProfile } from '@/components/layout/profile/user-profile'
import { Container } from '@/components/ui_shadcn/layout'

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: username } = await params
  const user = await findUserByUsername(username)
  if (!user) notFound()

  const [ownedGears, wantedGears, previouslyOwnedGears] = await Promise.all([
    getUserGearsByStatus(user.id, 'owned'),
    getUserGearsByStatus(user.id, 'wanted'),
    getUserGearsByStatus(user.id, 'previously-owned'),
  ])

  return (
    <Container className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-2">
      <UserProfile
        user={{ id: user.id, username: user.username, name: user.name, profileImage: user.profileImage, bio: user.bio }}
        ownedGears={ownedGears}
        wantedGears={wantedGears}
        previouslyOwnedGears={previouslyOwnedGears}
      />
    </Container>
  )
}
