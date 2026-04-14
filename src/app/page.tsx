import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-session'
import { Container } from '@/components/ui_shadcn/layout'
import { UserProfile } from '@/components/layout/profile/user-profile'
import { LandingPage } from '@/components/landing-page'

export default async function Home() {
  const currentUser = await getCurrentUser()

  if (!currentUser) return <LandingPage />
  if (!currentUser.username) redirect('/welcome')

  return (
    <Container className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-2">
      <UserProfile user={currentUser} editable />
    </Container>
  )
}
