import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'INSCAE Section Chrétienne',
  description: 'La communauté chrétienne des étudiants et anciens de l\'INSCAE Madagascar — Foi · Excellence · Service',
  keywords: ['INSCAE', 'chrétien', 'Madagascar', 'association', 'foi', 'étudiant'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  )
}
