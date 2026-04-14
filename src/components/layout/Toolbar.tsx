import Link from 'next/link'
import { Button } from '@/components/ui_shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui_shadcn/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui_shadcn/avatar'
import { getCurrentUser } from '@/lib/auth-session'
import { ThemeToggle } from '@/components/theme-toggle'
import { LogoutButton } from '@/components/layout/logout-button'
import { LoginDialog } from '@/components/layout/login-dialog'
import { Container, Flex, Stack } from '@/components/ui_shadcn/layout'

export async function Toolbar() {
  const currentUser = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm">
      <Container className="px-8 py-2">
        <Flex align="center" gap={4}>
          <Link href="/">
            <Flex align="center" gap={2} className="hover:opacity-80 transition-opacity">
              <span className="font-f18 text-xl tracking-wide">PeekPack</span>
            </Flex>
          </Link>

          <div className="grow" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          {currentUser
            ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.profileImage ?? undefined} alt={currentUser.name} />
                        <AvatarFallback>
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuLabel>
                      <Stack spacing={1}>
                        <p className="text-sm font-medium">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </Stack>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings">設定</Link>
                    </DropdownMenuItem>
                    <LogoutButton />
                  </DropdownMenuContent>
                </DropdownMenu>
              )

            : (
                <LoginDialog>
                  <Button size="sm">ログイン</Button>
                </LoginDialog>
              )}
        </Flex>
      </Container>
    </header>
  )
}
