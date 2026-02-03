import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Toolbar() {
  const currentUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        {/* Logo & App Name */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Camera className="h-5 w-5" />
          <span className="font-bold text-lg">PeekMyPack</span>
        </Link>

        <nav className="flex items-center gap-6 flex-1">
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
        </nav>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        {currentUser ? (
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
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" asChild>
            <Link href="/login">ログイン</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
