import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vijayvargiya Electronics Rewards',
  description: 'Spin & Win at Vijayvargiya Electronics. Register for a free spin and get a chance to win coupons, gifts, LED TV, Washing Machine, and FREE AC.',
  openGraph: {
    title: 'SPIN & WIN - Vijayvargiya Electronics',
    description: 'Register for a FREE SPIN and win exciting coupons, gifts, LED TV, Washing Machine, and FREE AC.',
    url: 'https://vijayvargiya.vercel.app',
    siteName: 'Vijayvargiya Electronics',
    images: [{ url: '/images/wheel-mystery-gift.png', width: 512, height: 512, alt: 'Vijayvargiya Electronics Spin & Win rewards' }],
    locale: 'en_IN',
    type: 'website',
  },
  generator: 'v0.app',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
