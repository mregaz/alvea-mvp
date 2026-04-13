import Link from 'next/link'
import type { ResultContent, ResultList, ResultCTA } from '@/types/result'
import type { ResultLevel } from '@/lib/constants'

// ── Level visual config ───────────────────────────────────────────────────────
// Color always paired with badge text, icon, and copy — never color alone.

const LEVEL_CONFIG: Record<ResultLevel, {
  band:        string
  bandText:    string
  badgeBg:     string
  badgeText:   string
  primaryBtn:  string
}> = {
  green: {
    band:       'bg-emerald-600',
    bandText:   'text-white',
    badgeBg:    'bg-emerald-100',
    badgeText:  'text-emerald-800',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white',
  },
  yellow: {
    band:       'bg-amber-500',
    bandText:   'text-white',
    badgeBg:    'bg-amber-100',
    badgeText:  'text-amber-800',
    primaryBtn: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white',
  },
  red: {
    band:       'bg-red-600',
    bandText:   'text-white',
    badgeBg:    'bg-red-100',
    badgeText:  'text-red-800',
    primaryBtn: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white',
  },
}

// ── List variant styles ───────────────────────────────────────────────────────

const LIST_CONFIG: Record<ResultList['variant'], {
  bg: string; border: string; titleColor: string; dotColor: string; textColor: string
}> = {
  observe: {
    bg: 'bg-slate-50', border: 'border-slate-200',
    titleColor: 'text-slate-700', dotColor: 'text-slate-400', textColor: 'text-slate-600',
  },
  contact: {
    bg: 'bg-teal-50', border: 'border-teal-200',
    titleColor: 'text-teal-800', dotColor: 'text-teal-400', textColor: 'text-teal-700',
  },
  attention: {
    bg: 'bg-red-50', border: 'border-red-200',
    titleColor: 'text-red-800', dotColor: 'text-red-400', textColor: 'text-red-700',
  },
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ResultBadge({ badge, level }: { badge: string; level: ResultLevel }) {
  const { badgeBg, badgeText } = LEVEL_CONFIG[level]
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${badgeBg} ${badgeText}`}>
      {badge}
    </span>
  )
}

function ResultListSection({ list }: { list: ResultList }) {
  const s = LIST_CONFIG[list.variant]
  return (
    <div className={`${s.bg} border ${s.border} rounded-2xl px-5 py-4 flex flex-col gap-3`}>
      <p className={`text-sm font-semibold ${s.titleColor}`}>{list.title}</p>
      <ul className="flex flex-col gap-2">
        {list.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${s.dotColor.replace('text-', 'bg-')}`} aria-hidden="true" />
            <span className={`text-sm leading-relaxed ${s.textColor}`}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CTAButton({ cta, primaryClass }: { cta: ResultCTA; primaryClass: string }) {
  const base = 'flex items-center justify-center w-full rounded-2xl px-6 py-4 text-base font-semibold transition-colors'
  const secondary = 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100'
  const ghost = 'text-slate-500 hover:text-slate-700 py-3 text-sm'

  const cls = cta.style === 'primary' ? `${base} ${primaryClass}`
            : cta.style === 'secondary' ? `${base} ${secondary}`
            : `flex items-center justify-center w-full ${ghost}`

  if (cta.external) {
    return <a href={cta.href} className={cls}>{cta.label}</a>
  }
  return <Link href={cta.href} className={cls}>{cta.label}</Link>
}

// ── ResultCard ────────────────────────────────────────────────────────────────

interface ResultCardProps {
  content: ResultContent
  basedOnLabel: string
  restartLabel: string
  restartHref:  string
  notDiagnosisText: string
}

export function ResultCard({
  content,
  basedOnLabel,
  restartLabel,
  restartHref,
  notDiagnosisText,
}: ResultCardProps) {
  const lc = LEVEL_CONFIG[content.level]

  return (
    <div className="flex flex-col gap-5 py-4">

      {/* ── Header band ─────────────────────────────────────────── */}
      <div className={`${lc.band} rounded-3xl px-6 py-6 flex flex-col gap-4`}>
        <ResultBadge badge={content.badge} level={content.level} />
        <h1 className={`text-xl font-semibold leading-snug ${lc.bandText}`}>
          {content.title}
        </h1>
        <p className={`text-sm leading-relaxed ${lc.bandText} opacity-90`}>
          {content.body}
        </p>
      </div>

      {/* ── Ordered lists (observe / contact / attention) ────────── */}
      {content.lists.map((list, i) => (
        <div key={i}><ResultListSection list={list} /></div>
      ))}

      {/* ── Next step ───────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
        <p className="text-sm text-slate-600 leading-relaxed font-medium">
          {content.nextStep}
        </p>
      </div>

      {/* ── CTAs ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        {content.ctas.map((cta, i) => (
          <div key={i}><CTAButton cta={cta} primaryClass={lc.primaryBtn} /></div>
        ))}
      </div>

      {/* ── Disclaimer ──────────────────────────────────────────── */}
      <div className={`rounded-2xl px-5 py-4 ${
        content.level === 'red'
          ? 'bg-red-50 border border-red-200'
          : content.level === 'yellow'
            ? 'bg-amber-50 border border-amber-200'
            : 'bg-slate-50 border border-slate-100'
      }`}>
        <p className={`text-xs leading-relaxed ${
          content.level === 'red' ? 'text-red-700'
          : content.level === 'yellow' ? 'text-amber-700'
          : 'text-slate-500'
        }`}>
          {content.disclaimer}
        </p>
      </div>

      {/* ── Footer: based on answers + not a diagnosis ───────────── */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="font-medium text-slate-500">{basedOnLabel}. </span>
          {notDiagnosisText}
        </p>
      </div>

      {/* ── Restart ─────────────────────────────────────────────── */}
      <Link
        href={restartHref}
        className="flex items-center justify-center text-sm text-teal-600 font-medium hover:text-teal-800 py-2"
      >
        ↺ {restartLabel}
      </Link>

    </div>
  )
}
