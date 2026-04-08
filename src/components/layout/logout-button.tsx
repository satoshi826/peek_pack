'use client'

import { authClient } from '@/lib/auth-client'
import { DropdownMenuItem } from '@/components/ui_shadcn/dropdown-menu'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.refresh()
  }

  return (
    <DropdownMenuItem onClick={handleLogout}>
      ログアウト
    </DropdownMenuItem>
  )
}
