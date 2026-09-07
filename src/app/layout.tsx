import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '../index.css'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#07080d',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'CrimeGraph AI — Investigative Intelligence Platform',
  description: 'Enterprise Explainable Criminal Network Analysis & Cyber Intelligence Console',
  icons: {
    icon: '/images/crimegraph_logo_emblem.jpg',
    shortcut: '/images/crimegraph_logo_emblem.jpg',
    apple: '/images/crimegraph_logo_emblem.jpg'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#07080d] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
