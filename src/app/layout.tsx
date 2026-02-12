import type { Metadata } from 'next'
import { Kosugi_Maru } from 'next/font/google'
import { Toolbar } from '@/components/layout/Toolbar'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const kosugiMaru = Kosugi_Maru({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kosugi-maru',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PeekPack - カメラギア管理',
  description: 'あなたのカメラとレンズのコレクションを管理',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${kosugiMaru.variable} font-sans antialiased bg-(--neumo-base)`}>
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
