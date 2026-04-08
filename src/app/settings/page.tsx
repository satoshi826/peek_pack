import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-session'
import { findUserById } from '@/db/queries/user'
import { ProfileForm } from '@/components/settings/profile-form'
import { DeleteAccountDialog } from '@/components/settings/delete-account-dialog'
import { Typography } from '@/components/ui_shadcn/typography'
import { Container, Stack } from '@/components/ui_shadcn/layout'

export default async function SettingsPage() {
  const sessionUser = await getCurrentUser()
  if (!sessionUser) redirect('/login')

  const user = await findUserById(sessionUser.id)
  if (!user) redirect('/login')

  return (
    <Container maxWidth="2xl" className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-8">
      <Stack spacing={8}>
        <Typography variant="h2">設定</Typography>

        <ProfileForm user={{
          name: user.name,
          profileImage: user.profileImage,
          bio: user.bio,
        }}
        />

        <DeleteAccountDialog />
      </Stack>
    </Container>
  )
}
