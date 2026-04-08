export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import { Toolbar } from '@/components/layout/Toolbar'
import { ThemeProvider } from '@/components/theme-provider'
import { getCurrentUser } from '@/lib/auth-session'
import './globals.css'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-zen-kaku-gothic-new',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PeekPack - カメラギア管理',
  description: 'あなたのカメラとレンズのコレクションを管理',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const skipCheck = ['/welcome', '/login'].some(p => pathname.startsWith(p))

  if (!skipCheck) {
    const user = await getCurrentUser()
    if (user && !user.username) redirect('/welcome')
  }

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${zenKakuGothicNew.variable} font-sans antialiased bg-(--neumo-base)`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toolbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
