'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAccount } from '@/actions/user.actions'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Stack } from '@/components/ui_shadcn/layout'
import { Typography } from '@/components/ui_shadcn/typography'

const CONFIRM_TEXT = 'アカウントを削除する'

export function DeleteAccountDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteAccount()
      await authClient.signOut()
      router.push('/login')
    })
  }

  return (
    <Card variant="inset">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3" className="text-destructive">アカウント削除</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Stack spacing={4}>
          <Typography variant="muted">
            アカウントを削除すると、すべてのギアデータ、ブックマークが完全に削除されます。この操作は取り消せません。
          </Typography>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-fit bg-destructive text-destructive-foreground hover:bg-destructive/90">
                アカウントを削除
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>本当に削除しますか？</DialogTitle>
                <DialogDescription>
                  確認のため「
                  {CONFIRM_TEXT}
                  」と入力してください。
                </DialogDescription>
              </DialogHeader>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={CONFIRM_TEXT}
                className="w-full rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-destructive"
              />
              <DialogFooter>
                <Button
                  onClick={handleDelete}
                  disabled={input !== CONFIRM_TEXT || pending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {pending ? '削除中...' : '完全に削除する'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Stack>
      </CardContent>
    </Card>
  )
}
