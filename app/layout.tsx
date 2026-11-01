import type { Metadata } from 'next'
import { StockProvider } from '@/lib/context/StockContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Market Dashboard - Real-time Stock Tracking',
  description:
    'Real-time stock market dashboard with live price updates and alerts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StockProvider>{children}</StockProvider>
      </body>
    </html>
  )
}