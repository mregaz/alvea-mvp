import { getTranslations } from '@/lib/i18n'
import { Disclaimer } from '@/components/ui/Disclaimer'
import type { Locale } from '@/lib/constants'

interface PageProps {
  params: { locale: string }
}

export default async function LimitiPage({ params }: PageProps) {
  const locale = params.locale as Locale
  const t = await getTranslations(locale, 'limiti')
  const tc = await getTranslations(locale, 'common')

  const doesDoItems = [
    t('doesDo.item1'),
    t('doesDo.item2'),
    t('doesDo.item3'),
    t('doesDo.item4'),
  ]

  const doesNotDoItems = [
    t('doesNotDo.item1'),
    t('doesNotDo.item2'),
    t('doesNotDo.item3'),
    t('doesNotDo.item4'),
    t('doesNotDo.item5'),
  ]

  return (
    <div className="flex flex-col gap-8 py-4">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight mb-2">
          {t('title')}
        </h1>
        <p className="text-slate-500 leading-relaxed">{t('intro')}</p>
      </div>

      {/* Does do */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <h2 className="font-semibold text-slate-800">{t('doesDo.title')}</h2>
        </div>
        <ul className="flex flex-col gap-2">
          {doesDoItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="mt-0.5 shrink-0 text-emerald-500">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Does not do */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <h2 className="font-semibold text-slate-800">{t('doesNotDo.title')}</h2>
        </div>
        <ul className="flex flex-col gap-2">
          {doesNotDoItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="mt-0.5 shrink-0 text-amber-400">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Responsibility */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-5 flex flex-col gap-2">
        <h2 className="font-semibold text-slate-700 text-sm">{t('responsibility.title')}</h2>
        <p className="text-sm text-slate-500 leading-relaxed">{t('responsibility.body')}</p>
      </div>

      <Disclaimer text={tc('disclaimer.short')} />
    </div>
  )
}
