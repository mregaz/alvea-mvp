import Link from 'next/link'
import type { Locale } from '@/lib/constants'

interface FooterProps {
  locale: Locale
  labels: {
    limits: string
    privacy: string
    tagline: string
    howItWorks: string
  }
}

export function Footer({ locale, labels }: FooterProps) {
  return (
    <footer className="border-t border-slate-100 mt-16">
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col items-center gap-5">
        <span className="text-teal-700 font-semibold text-lg tracking-tight">Alvea</span>
        <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
          {labels.tagline}
        </p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link
            href={`/${locale}/come-funziona`}
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2"
          >
            {labels.howItWorks}
          </Link>
          <Link
            href={`/${locale}/limiti`}
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2"
          >
            {labels.limits}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2"
          >
            {labels.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
