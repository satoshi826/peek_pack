export const dynamic = 'force-dynamic'

import { getUserGearsByStatus } from '@/actions/user-gear.actions'
import { getCurrentUser } from '@/lib/auth-session'
import { Container } from '@/components/ui_shadcn/layout'
import { UserProfile } from '@/components/layout/profile/user-profile'
import { LandingPage } from '@/components/landing-page'

export default async function Home() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return <LandingPage />
  }

  const [ownedGears, wantedGears, previouslyOwnedGears] = await Promise.all([
    getUserGearsByStatus(currentUser.id, 'owned'),
    getUserGearsByStatus(currentUser.id, 'wanted'),
    getUserGearsByStatus(currentUser.id, 'previously-owned'),
  ])

  return (
    <Container className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-2">
      <UserProfile
        user={{ ...currentUser, email: currentUser.email }}
        ownedGears={ownedGears}
        wantedGears={wantedGears}
        previouslyOwnedGears={previouslyOwnedGears}
        editable
      />
    </Container>
  )
}
