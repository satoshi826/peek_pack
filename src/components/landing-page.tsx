import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui_shadcn/typography'
import { Grid, Stack, Container } from '@/components/ui_shadcn/layout'
import { LoginDialog } from '@/components/layout/login-dialog'
import { Camera, Users, Eye } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'ギア管理',
    description: 'カメラ・レンズを登録して、あなたの機材リストを一元管理。所有・欲しい・過去所有をステータスで整理。',
  },
  {
    icon: Users,
    title: 'パック共有',
    description: 'あなたの機材構成をプロフィールとして公開。同じ趣味のユーザーと繋がるきっかけに。',
  },
  {
    icon: Eye,
    title: '発見',
    description: '他のユーザーの機材を覗いて、新しいギアとの出会いを。購入の参考にも。',
  },
]

export function LandingPage() {
  return (
    <Container maxWidth="4xl" className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-16">
      <Stack spacing={12}>
        <Stack spacing={6} className="text-center pt-12">
          <Typography variant="h1" className="text-5xl tracking-tight">
            あなたのカメラギアを、
            <br />
            見せ合おう。
          </Typography>
          <Typography variant="lead" className="max-w-xl mx-auto">
            PeekPack は、カメラとレンズのコレクションを管理・共有できるサービスです。
            あなたの機材構成を記録して、仲間と見せ合いましょう。
          </Typography>
          <div className="pt-4">
            <LoginDialog>
              <Button size="lg">はじめる</Button>
            </LoginDialog>
          </div>
        </Stack>

        <Grid gap={6} mdCols={3}>
          {features.map(f => (
            <Card key={f.title} variant="inset">
              <CardContent className="pt-6">
                <Stack spacing={3}>
                  <f.icon className="size-8 text-primary" />
                  <Typography variant="h3">{f.title}</Typography>
                  <Typography variant="muted">{f.description}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Container>
  )
}
