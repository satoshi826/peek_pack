'use client'

import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui_shadcn/typography'
import { Container, Stack } from '@/components/ui_shadcn/layout'

export default function UserError({ reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <Container className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-16">
      <Stack spacing={4} className="items-center text-center">
        <Typography variant="h2">プロフィールを表示できません</Typography>
        <Typography variant="muted">ユーザー情報の取得に失敗しました。</Typography>
        <Button onClick={reset}>再試行</Button>
      </Stack>
    </Container>
  )
}
