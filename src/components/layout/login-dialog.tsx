'use client'

import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function LoginDialog({ children }: { children: React.ReactNode }) {
  function handleGoogleLogin() {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ログイン</DialogTitle>
        </DialogHeader>
        <Button onClick={handleGoogleLogin} className="w-full">
          Google でログイン
        </Button>
      </DialogContent>
    </Dialog>
  )
}
