import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-session'
import { WelcomeForm } from '@/components/settings/welcome-form'
import { Typography } from '@/components/ui_shadcn/typography'
import { Container, Stack } from '@/components/ui_shadcn/layout'

export default async function WelcomePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.username) redirect('/')

  return (
    <Container maxWidth="sm" className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-16">
      <Stack spacing={8} className="text-center">
        <Stack spacing={2}>
          <Typography variant="h1">Welcome</Typography>
          <Typography variant="muted">アカウントを設定しましょう</Typography>
        </Stack>
        <WelcomeForm defaultName={user.name} />
      </Stack>
    </Container>
  )
}
