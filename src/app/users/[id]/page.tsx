import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { findUserByUsername } from '@/db/queries/user'
import { UserProfile } from '@/components/layout/profile/user-profile'
import { Container } from '@/components/ui_shadcn/layout'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: username } = await params
  const user = await findUserByUsername(username)
  if (!user) return { title: 'ユーザーが見つかりません - PeekPack' }
  return {
    title: `${user.name} (@${user.username}) - PeekPack`,
    description: user.bio || `${user.name}のカメラギア一覧`,
  }
}

export default async function UserPage({ params }: Props) {
  const { id: username } = await params
  const user = await findUserByUsername(username)
  if (!user) notFound()

  return (
    <Container className="min-h-[calc(100vh-4rem)] bg-(--neumo-base) px-8 py-2">
      <UserProfile user={user} />
    </Container>
  )
}
