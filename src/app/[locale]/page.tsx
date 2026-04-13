import Link from 'next/link'
import { getTranslations } from '@/lib/i18n'
import { SYMPTOMS } from '@/lib/symptoms'
import type { Locale } from '@/lib/constants'

interface HomePageProps {
  params: { locale: string }
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = params.locale as Locale
  const t  = await getTranslations(locale, 'home')
  const tc = await getTranslations(locale, 'common')

  return (
    <div className="flex flex-col gap-0">

      {/* 1. HERO */}
      <section className="flex flex-col gap-6 pt-4 pb-12">
        <h1 className="text-[1.75rem] font-semibold text-slate-800 leading-snug tracking-tight">
          {t('hero.title')}
        </h1>
        <p className="text-base text-slate-500 leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href={`/${locale}/sintomi`}
            className="flex items-center justify-center bg-teal-600 text-white rounded-2xl px-6 py-4 text-base font-semibold hover:bg-teal-700 active:bg-teal-800 transition-colors"
          >
            {t('hero.ctaPrimary')}
          </Link>
          <Link
            href={`/${locale}/come-funziona`}
            className="flex items-center justify-center bg-white text-teal-700 border border-teal-200 rounded-2xl px-6 py-3.5 text-base font-medium hover:bg-teal-50 transition-colors"
          >
            {t('hero.ctaSecondary')}
          </Link>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed text-center">
          {t('hero.trustNote')}
        </p>
      </section>

      {/* 2. PROBLEM */}
      <section className="py-10 border-t border-slate-100">
        <div className="bg-slate-50 rounded-3xl px-6 py-7 flex flex-col gap-3">
          <p className="text-base font-semibold text-slate-700">{t('problem.title')}</p>
          <p className="text-sm text-slate-500 leading-relaxed">{t('problem.body')}</p>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-10 border-t border-slate-100 flex flex-col gap-6">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">
          {t('howItWorks.title')}
        </p>
        <div className="flex flex-col gap-3">
          {(['step1', 'step2', 'step3'] as const).map((step, i) => (
            <div key={step} className="flex gap-4 bg-white rounded-2xl px-5 py-5 border border-slate-100 shadow-sm">
              <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-slate-800 text-sm">{t(`howItWorks.${step}.label`)}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{t(`howItWorks.${step}.detail`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SYMPTOMS GRID — uses shared SYMPTOMS registry */}
      <section className="py-10 border-t border-slate-100 flex flex-col gap-6">
        <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">
          {t('symptoms.title')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SYMPTOMS.map(({ key, slug, icon, active }) => {
            const label       = t(`symptoms.${key}.label`)
            const description = t(`symptoms.${key}.description`)
            const startLabel  = t('symptoms.startLabel')   // Fix F: localised
            const comingSoon  = t('symptoms.comingSoon')

            if (active) {
              return (
                <Link
                  key={key}
                  href={`/${locale}/flusso/${slug}`}
                  className="group flex flex-col gap-2 bg-white border border-slate-100 rounded-2xl px-4 py-4 shadow-sm hover:border-teal-300 hover:shadow-md active:scale-[0.97] transition-all duration-150"
                >
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm leading-tight">{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-snug">{description}</p>
                  </div>
                  <span className="text-xs text-teal-600 font-medium mt-auto">{startLabel} →</span>
                </Link>
              )
            }

            return (
              <div
                key={key}
                className="flex flex-col gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 opacity-55"
              >
                <span className="text-2xl grayscale">{icon}</span>
                <div>
                  <p className="font-semibold text-slate-500 text-sm leading-tight">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{description}</p>
                </div>
                <span className="text-xs text-slate-400 mt-auto">{comingSoon}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* 5. TRAFFIC LIGHT */}
      <section className="py-10 border-t border-slate-100 flex flex-col gap-6">
        <div>
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-2">
            {t('trafficLight.title')}
          </p>
          <p className="text-sm text-slate-500">{t('trafficLight.subtitle')}</p>
        </div>
        <div className="flex flex-col gap-3">
          {([
            { key: 'green',  dot: 'bg-emerald-500', bg: 'bg-emerald-50',  border: 'border-emerald-100', label: 'text-emerald-800', body: 'text-emerald-700' },
            { key: 'yellow', dot: 'bg-amber-400',   bg: 'bg-amber-50',    border: 'border-amber-100',   label: 'text-amber-800',   body: 'text-amber-700'  },
            { key: 'red',    dot: 'bg-red-500',     bg: 'bg-red-50',      border: 'border-red-100',     label: 'text-red-800',     body: 'text-red-700'    },
          ] as const).map(({ key, dot, bg, border, label, body }) => (
            <div key={key} className={`flex gap-4 items-start ${bg} border ${border} rounded-2xl px-5 py-4`}>
              <span className={`w-3 h-3 rounded-full ${dot} mt-1.5 shrink-0`} aria-hidden="true" />
              <div>
                <p className={`font-semibold text-sm ${label}`}>{t(`trafficLight.${key}.label`)}</p>
                <p className={`text-sm mt-0.5 leading-relaxed ${body}`}>{t(`trafficLight.${key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. URGENT HELP */}
      <section className="py-10 border-t border-slate-100">
        <div className="bg-red-50 border border-red-200 rounded-3xl px-6 py-6 flex flex-col gap-4">
          <p className="font-semibold text-red-800">{t('urgentHelp.title')}</p>
          <p className="text-sm text-red-700 leading-relaxed">{t('urgentHelp.body')}</p>
          <a
            href="tel:144"
            className="flex items-center justify-center gap-2 bg-red-600 text-white rounded-2xl px-6 py-4 text-base font-semibold hover:bg-red-700 active:bg-red-800 transition-colors"
          >
            📞 {t('urgentHelp.cta')}
          </a>
          <Link
            href={`/${locale}/aiuto-urgente`}
            className="text-sm text-red-700 text-center underline underline-offset-2 hover:text-red-900"
          >
            {t('urgentHelp.secondary')}
          </Link>
        </div>
      </section>

      {/* 7. WHAT ALVEA IS / IS NOT */}
      <section className="py-10 border-t border-slate-100 flex flex-col gap-6">
        <p className="text-xl font-semibold text-slate-800 leading-snug">{t('whatItIs.title')}</p>
        <div className="flex flex-col gap-3">
          <div className="bg-white border border-slate-100 rounded-2xl px-5 py-5 shadow-sm flex flex-col gap-3">
            <p className="text-sm font-semibold text-emerald-700">{t('whatItIs.isTitle')}</p>
            <ul className="flex flex-col gap-2">
              {(['is1', 'is2', 'is3'] as const).map((k) => (
                <li key={k} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true">✓</span>
                  {t(`whatItIs.${k}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-5 flex flex-col gap-3">
            <p className="text-sm font-semibold text-slate-500">{t('whatItIs.isNotTitle')}</p>
            <ul className="flex flex-col gap-2">
              {(['isNot1', 'isNot2', 'isNot3'] as const).map((k) => (
                <li key={k} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="shrink-0 mt-0.5" aria-hidden="true">✕</span>
                  {t(`whatItIs.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link
          href={`/${locale}/limiti`}
          className="text-sm text-slate-400 underline underline-offset-2 hover:text-slate-600 text-center"
        >
          {tc('footer.limits')}
        </Link>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-10 border-t border-slate-100 flex flex-col gap-5 items-center text-center">
        <p className="text-xl font-semibold text-slate-800">{t('finalCta.title')}</p>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{t('finalCta.body')}</p>
        <Link
          href={`/${locale}/sintomi`}
          className="flex items-center justify-center bg-teal-600 text-white rounded-2xl px-8 py-4 text-base font-semibold hover:bg-teal-700 active:bg-teal-800 transition-colors w-full"
        >
          {t('finalCta.cta')}
        </Link>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
          {t('hero.trustNote')}
        </p>
      </section>

    </div>
  )
}
