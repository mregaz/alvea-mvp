import Link from 'next/link'
import type { Locale } from '@/lib/constants'
import { LanguageSwitcher } from './LanguageSwitcher'

interface HeaderProps {
  locale: Locale
  navLabels: {
    home: string
    howItWorks: string
    urgentHelp: string
  }
}

export function Header({ locale, navLabels }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      {/* Skip to main content — screen readers and keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-600 focus:text-white focus:rounded-xl focus:text-sm focus:font-medium"
      >
        Vai al contenuto
      </a>
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="text-teal-700 font-semibold text-xl tracking-tight shrink-0"
        >
          Alvea
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} />
          <div className="w-px h-4 bg-slate-200" />
          <Link
            href={`/${locale}/aiuto-urgente`}
            className="text-sm text-red-600 font-medium hover:text-red-700 shrink-0"
          >
            {navLabels.urgentHelp}
          </Link>
        </div>
      </div>
    </header>
  )
}
