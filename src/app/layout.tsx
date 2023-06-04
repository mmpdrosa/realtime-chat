import { Metadata } from 'next'
import * as React from 'react'

import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

export const metadata: Metadata = {
  title: 'Realtime Chat',
  description: '',
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Radix UI',
  ],
  authors: [
    {
      name: 'mmpdrosa',
    },
  ],
  creator: 'mmpdrosa',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen">{children}</div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
