import { getTranslations } from '@/lib/i18n'
import { Disclaimer } from '@/components/ui/Disclaimer'
import type { Locale } from '@/lib/constants'

interface PageProps {
  params: { locale: string }
}

export default async function PrivacyPage({ params }: PageProps) {
  const locale = params.locale as Locale
  const t = await getTranslations(locale, 'privacy')
  const tc = await getTranslations(locale, 'common')

  const sections = [
    { key: 'noData', icon: '🔒' },
    { key: 'sessionStorage', icon: '💾' },
    { key: 'analytics', icon: '📊' },
    { key: 'contact', icon: '✉️' },
  ] as const

  return (
    <div className="flex flex-col gap-8 py-4">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">
          {t('title')}
        </h1>
        <p className="text-slate-500 leading-relaxed">{t('intro')}</p>
      </div>

      <div className="flex flex-col gap-4">
        {sections.map(({ key, icon }) => (
          <div
            key={key}
            className="bg-white border border-slate-100 rounded-2xl px-5 py-5 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <h2 className="font-semibold text-slate-800 text-sm">{t(`${key}.title`)}</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{t(`${key}.body`)}</p>
          </div>
        ))}
      </div>

      <Disclaimer text={tc('disclaimer.short')} />
    </div>
  )
}
