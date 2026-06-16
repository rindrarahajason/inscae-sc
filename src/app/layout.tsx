import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import PwaRegister from '@/components/PwaRegister'
import PwaInstallBanner from '@/components/PwaInstallBanner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'INSCAE Section Chrétienne',
  description: 'La communauté chrétienne des étudiants et anciens de l\'INSCAE Madagascar — Foi · Excellence · Service',
  keywords: ['INSCAE', 'chrétien', 'Madagascar', 'association', 'foi', 'étudiant'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ISC',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'ISC',
    'msapplication-TileColor': '#5B21B6',
    'theme-color': '#5B21B6',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <PwaRegister />
        <PwaInstallBanner />
        {children}
      </body>
    </html>
  )
}
