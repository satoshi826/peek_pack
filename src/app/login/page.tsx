'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Typography } from '@/components/ui_shadcn/typography'
import { Stack, Container } from '@/components/ui_shadcn/layout'

export default function LoginPage() {
  function handleGoogleLogin() {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    })
  }

  return (
    <Container className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <Stack spacing={6} className="text-center">
            <Typography variant="h2">ログイン</Typography>
            <Button onClick={handleGoogleLogin} className="w-full">
              Google でログイン
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}
