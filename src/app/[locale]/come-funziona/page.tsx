import Link from 'next/link'
import { getTranslations } from '@/lib/i18n'
import { Disclaimer } from '@/components/ui/Disclaimer'
import type { Locale } from '@/lib/constants'

interface PageProps {
  params: { locale: string }
}

export default async function ComeFunzionaPage({ params }: PageProps) {
  const locale = params.locale as Locale
  const t = await getTranslations(locale, 'come-funziona')
  const tc = await getTranslations(locale, 'common')

  const steps = [
    { key: 'step1', emoji: '🔍' },
    { key: 'step2', emoji: '💬' },
    { key: 'step3', emoji: '✅' },
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
        {steps.map(({ key, emoji }, i) => (
          <div key={key} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-xl shrink-0">
              {emoji}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-teal-600 uppercase tracking-wide">Passo {i + 1}</p>
              <p className="font-medium text-slate-800">{t(`steps.${key}.title`)}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{t(`steps.${key}.body`)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-sm font-semibold text-amber-800 mb-1">{t('notADiagnosis.title')}</p>
        <p className="text-sm text-amber-700 leading-relaxed">{t('notADiagnosis.body')}</p>
      </div>

      <Link
        href={`/${locale}/sintomi`}
        className="inline-flex items-center justify-center bg-teal-600 text-white rounded-2xl px-6 py-4 text-base font-medium hover:bg-teal-700 transition-colors"
      >
        {t('cta')}
      </Link>

      <Disclaimer text={tc('disclaimer.short')} />
    </div>
  )
}
