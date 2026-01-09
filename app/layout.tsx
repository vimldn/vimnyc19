import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Building Health X | NYC building reality check',
  description:
    'A fast, decision-first building check: the last 30/90 days (and 1–3 years) of violations, complaints, and resident reviews—so you avoid surprises before you sign.',
  keywords: ['NYC', 'building', 'apartment', 'violations', 'complaints', 'heat', 'pests', 'noise', 'landlord', 'HPD', 'DOB', '311'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>{children}</body>
    </html>
  )
}
