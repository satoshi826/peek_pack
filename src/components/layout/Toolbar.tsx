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
import { getCurrentUser } from '@/lib/auth'
import { ThemeToggle } from '@/components/theme-toggle'
import { Flex, Stack } from '@/components/ui_shadcn/layout'

export async function Toolbar() {
  const currentUser = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <Flex align="center" gap="4" className="container h-14">
        <Link href="/">
          <Flex align="center" gap="2" className="hover:opacity-80 transition-opacity">
            <span className="font-bold text-lg">PeekMyPack</span>
          </Flex>
        </Link>

        {/* <Flex as="nav" align="center" gap={6} className="flex-1">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            ホーム
          </Link>
          <Link
            href="/gears"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            ギア一覧
          </Link>
        </Flex> */}

        <div className="flex-grow" />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        {currentUser
          ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
                      <AvatarFallback>
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48" align="end">
                  <DropdownMenuLabel>
                    <Stack spacing="1">
                      <p className="text-sm font-medium">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </Stack>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    ログアウト
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )

          : (
              <Button size="sm" asChild>
                <Link href="/login">ログイン</Link>
              </Button>
            )}
      </Flex>
    </header>
  )
}
