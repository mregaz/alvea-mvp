import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Alvea',
    template: '%s — Alvea',
  },
  description: 'Guida ai sintomi pediatrici per genitori. Switzerland-first, non-diagnostic.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="bg-slate-50 text-slate-800 antialiased">{children}</body>
    </html>
  )
}
