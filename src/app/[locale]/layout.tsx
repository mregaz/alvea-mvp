import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTranslations } from '@/lib/i18n'
import { LOCALES } from '@/lib/constants'
import type { Locale } from '@/lib/constants'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: { locale: string }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const locale = params.locale as Locale
  return {
    // Sets <html lang> correctly per locale via Next.js
    other: { lang: locale },
    alternates: {
      languages: { it: '/it', de: '/de', fr: '/fr' },
    },
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = params.locale as Locale
  const t = await getTranslations(locale, 'common')

  return (
    <div className="min-h-screen flex flex-col" lang={locale}>
      <Header
        locale={locale}
        navLabels={{
          home:        t('nav.home'),
          howItWorks:  t('nav.howItWorks'),
          urgentHelp:  t('nav.urgentHelp'),
        }}
      />
      <main id="main-content" className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <Footer
        locale={locale}
        labels={{
          limits:      t('footer.limits'),
          privacy:     t('footer.privacy'),
          tagline:     t('footer.tagline'),
          howItWorks:  t('nav.howItWorks'),
        }}
      />
    </div>
  )
}
