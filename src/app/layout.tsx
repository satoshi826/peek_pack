import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import { Toolbar } from '@/components/layout/Toolbar'
import { ThemeProvider } from '@/components/theme-provider'
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
          <Toolbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
