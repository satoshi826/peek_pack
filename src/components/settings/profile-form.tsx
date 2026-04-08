'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/actions/user.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Stack } from '@/components/ui_shadcn/layout'
import { Typography } from '@/components/ui_shadcn/typography'

type Props = {
  user: {
    name: string
    profileImage: string | null
    bio: string | null
  }
}

type State = { success?: boolean; error?: string } | null

async function action(_prev: State, formData: FormData): Promise<State> {
  try {
    const name = formData.get('name') as string
    if (!name?.trim()) return { error: '名前は必須です' }

    const profileImage = (formData.get('profileImage') as string) || null
    const bio = (formData.get('bio') as string) || null

    await updateProfile({ name: name.trim(), profileImage, bio })
    return { success: true }
  } catch {
    return { error: '更新に失敗しました' }
  }
}

export function ProfileForm({ user }: Props) {
  const [state, formAction, pending] = useActionState(action, null)

  return (
    <Card variant="inset">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3">プロフィール</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <Stack spacing={4}>
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={user.name}
                className="mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="profileImage" className="text-sm font-medium">
                プロフィール画像URL
              </label>
              <input
                id="profileImage"
                name="profileImage"
                type="url"
                defaultValue={user.profileImage ?? ''}
                placeholder="https://example.com/avatar.jpg"
                className="mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="bio" className="text-sm font-medium">
                自己紹介
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                defaultValue={user.bio ?? ''}
                placeholder="カメラ好きです..."
                className="mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {state?.error && (
              <Typography variant="small" className="text-destructive">{state.error}</Typography>
            )}
            {state?.success && (
              <Typography variant="small" className="text-green-600">保存しました</Typography>
            )}

            <Button type="submit" disabled={pending}>
              {pending ? '保存中...' : '保存'}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
