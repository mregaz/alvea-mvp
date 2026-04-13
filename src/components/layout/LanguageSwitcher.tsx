'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LOCALES, type Locale } from '@/lib/constants'

interface LanguageSwitcherProps {
  currentLocale: Locale
}

const LOCALE_LABELS: Record<Locale, string> = {
  it: 'IT',
  de: 'DE',
  fr: 'FR',
}

// Full language names for aria-label accessibility
const LOCALE_NAMES: Record<Locale, string> = {
  it: 'Italiano',
  de: 'Deutsch',
  fr: 'Français',
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const pathname = usePathname()
  const router   = useRouter()

  function switchLocale(newLocale: Locale) {
    if (newLocale === currentLocale) return

    // Swap the locale segment (always position [1] after leading slash)
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    // Persist preference in a cookie for future visits
    document.cookie = `alvea_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    router.push(newPath)
  }

  return (
    <nav
      aria-label="Selezione lingua"
      className="flex items-center gap-0.5"
    >
      {LOCALES.map((locale, i) => (
        <span key={locale} className="flex items-center">
          <button
            onClick={() => switchLocale(locale)}
            aria-label={`Passa a ${LOCALE_NAMES[locale]}`}
            aria-current={locale === currentLocale ? 'true' : undefined}
            className={[
              'px-2 py-1 rounded-lg text-xs font-semibold transition-colors',
              locale === currentLocale
                ? 'bg-teal-100 text-teal-700'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100',
            ].join(' ')}
          >
            {LOCALE_LABELS[locale]}
          </button>
          {/* Separator between buttons, not after last */}
          {i < LOCALES.length - 1 && (
            <span className="text-slate-200 text-xs select-none" aria-hidden="true">·</span>
          )}
        </span>
      ))}
    </nav>
  )
}
