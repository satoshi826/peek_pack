'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { setupUsername } from '@/actions/user.actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui_shadcn/layout'
import { Typography } from '@/components/ui_shadcn/typography'

type State = { success?: boolean, error?: string } | null

async function action(_prev: State, formData: FormData): Promise<State> {
  const username = formData.get('username') as string
  const name = formData.get('name') as string
  if (!username?.trim()) return { error: 'ユーザー名を入力してください' }
  if (!name?.trim()) return { error: '表示名を入力してください' }

  return setupUsername({ username: username.trim(), name: name.trim() })
}

export function WelcomeForm({ defaultName }: { defaultName: string }) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action, null)

  useEffect(() => {
    if (state?.success) router.push('/')
  }, [state?.success, router])

  return (
    <Card variant="inset">
      <CardContent className="pt-6">
        <form action={formAction}>
          <Stack spacing={5} className="text-left">
            <div>
              <label htmlFor="username" className="text-sm font-medium">
                ユーザー名
              </label>
              <Typography variant="muted" className="text-xs">後から変更できません</Typography>
              <div className="mt-1 flex items-center gap-0">
                <span className="text-sm text-muted-foreground shrink-0">peekpack.com/users/</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  pattern="[a-zA-Z0-9_.]{3,20}"
                  placeholder="satoshi_h"
                  className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Typography variant="muted" className="text-xs mt-1">英数字、アンダースコア、ピリオド（3〜20文字）</Typography>
            </div>

            <div>
              <label htmlFor="name" className="text-sm font-medium">
                表示名
              </label>
              <Typography variant="muted" className="text-xs">いつでも変更できます</Typography>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={defaultName}
                className="mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {state?.error && (
              <Typography variant="small" className="text-destructive">{state.error}</Typography>
            )}

            <Button type="submit" disabled={pending} size="lg" className="w-full">
              {pending ? '設定中...' : 'はじめる'}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}
