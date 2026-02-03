import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SleepTracker - Track Your Sleep Quality',
  description: 'Log your sleep, track patterns, calculate sleep debt, and improve your rest with personalized insights.',
  keywords: ['sleep tracker', 'sleep quality', 'sleep debt', 'sleep analytics'],
  authors: [{ name: 'VibeCaaS' }],
  openGraph: {
    title: 'SleepTracker - Track Your Sleep Quality',
    description: 'Log your sleep, track patterns, and improve your rest.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
