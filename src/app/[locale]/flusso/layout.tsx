import Link from 'next/link'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import type { Locale } from '@/lib/constants'
import { getTranslations } from '@/lib/i18n'

interface FlowLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export default async function FlowLayout({ children, params }: FlowLayoutProps) {
  const locale = params.locale as Locale
  const t = await getTranslations(locale, 'common')

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" lang={locale}>
      {/* Minimal flow header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            href={`/${locale}`}
            className="text-teal-700 font-semibold text-xl tracking-tight shrink-0"
          >
            Alvea
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={locale} />
            <div className="w-px h-4 bg-slate-200" aria-hidden="true" />
            <Link
              href={`/${locale}/aiuto-urgente`}
              className="text-sm text-red-600 font-medium hover:text-red-700 shrink-0"
            >
              {t('nav.urgentHelp')}
            </Link>
          </div>
        </div>
      </header>

      {/* Content — padded for sticky CTA */}
      <main id="main-content" className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flow-content-pad">
        {children}
      </main>
    </div>
  )
}
