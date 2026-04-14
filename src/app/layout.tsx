import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import { Toolbar } from '@/components/layout/Toolbar'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-zen-kaku-gothic-new',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PeekPack - カメラギア管理',
  description: 'あなたのカメラとレンズのコレクションを管理',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${zenKakuGothicNew.variable} font-sans antialiased bg-(--neumo-base)`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={(
            <header className="sticky top-0 z-50 w-full backdrop-blur-sm">
              <div className="mx-auto max-w-7xl px-8 py-2">
                <div className="flex items-center gap-4">
                  <span className="font-f18 text-xl tracking-wide">PeekPack</span>
                  <div className="grow" />
                  <div className="size-8 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
            </header>
          )}
          >
            <Toolbar />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
