import Link from 'next/link'
import { getTranslations } from '@/lib/i18n'
import type { Locale } from '@/lib/constants'

interface PageProps {
  params: { locale: string }
}

export default async function OsservazionePage({ params }: PageProps) {
  const locale = params.locale as Locale
  const t  = await getTranslations(locale, 'osservazione')
  const tc = await getTranslations(locale, 'common')

  const whenItems = ['item1','item2','item3','item4','item5'] as const
  const emergencyItems = ['item1','item2','item3','item4'] as const

  return (
    <div className="flex flex-col gap-8 py-4">

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight leading-snug">
          {t('title')}
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">{t('subtitle')}</p>
      </div>

      {/* Temperature */}
      <Section
        icon="🌡️"
        title={t('sections.temperature.title')}
        body={t('sections.temperature.body')}
      />

      {/* Hydration */}
      <Section
        icon="💧"
        title={t('sections.hydration.title')}
        body={t('sections.hydration.body')}
      />

      {/* Behavior */}
      <Section
        icon="👶"
        title={t('sections.behavior.title')}
        body={t('sections.behavior.body')}
      />

      {/* When to call pediatrician */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">📞</span>
          <h2 className="font-semibold text-amber-900">{t('sections.whenToAct.title')}</h2>
        </div>
        <ul className="flex flex-col gap-2">
          {whenItems.map((key) => (
            <li key={key} className="flex items-start gap-3 text-sm text-amber-800">
              <span className="mt-0.5 shrink-0 text-amber-500">—</span>
              <span>{t(`sections.whenToAct.items.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency signs */}
      <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">🚨</span>
          <h2 className="font-semibold text-red-800">{t('sections.emergency.title')}</h2>
        </div>
        <ul className="flex flex-col gap-2">
          {emergencyItems.map((key) => (
            <li key={key} className="flex items-start gap-3 text-sm text-red-700">
              <span className="mt-0.5 shrink-0 text-red-400">—</span>
              <span>{t(`sections.emergency.items.${key}`)}</span>
            </li>
          ))}
        </ul>
        <a
          href="tel:144"
          className="flex items-center justify-center gap-2 bg-red-600 text-white rounded-2xl px-6 py-3.5 text-sm font-semibold hover:bg-red-700 transition-colors mt-1"
        >
          📞 {tc('urgentHelp.callEmergency')}
        </a>
      </div>

      {/* Not a diagnosis */}
      <p className="text-xs text-slate-400 text-center leading-relaxed">
        {tc('disclaimer.short')}
      </p>

      {/* Navigation */}
      <div className="flex flex-col gap-2 pb-4">
        <Link
          href={`/${locale}/risultato/green`}
          className="flex items-center justify-center text-sm text-teal-600 font-medium hover:text-teal-800 py-2"
        >
          ← {t('backToResult')}
        </Link>
        <Link
          href={`/${locale}/flusso/febbre`}
          className="flex items-center justify-center text-sm text-slate-400 hover:text-slate-600 py-1"
        >
          ↺ {t('restart')}
        </Link>
      </div>

    </div>
  )
}

// ── Internal section component ────────────────────────────────────────────────

function Section({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
    </div>
  )
}
