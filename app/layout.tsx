import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-88LHQSVE0N"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-88LHQSVE0N');
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>{children}</body>
    </html>
  )
}
