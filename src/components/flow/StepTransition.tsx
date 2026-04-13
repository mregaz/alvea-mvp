'use client'

import { useEffect } from 'react'

interface StepTransitionProps {
  title: string
  body: string
  onAutoAdvance?: () => void  // called after delay if provided
  autoAdvanceMs?: number
}

export function StepTransition({
  title,
  body,
  onAutoAdvance,
  autoAdvanceMs = 1800,
}: StepTransitionProps) {
  // Auto-advance after delay so parent doesn't need manual CTA tap
  useEffect(() => {
    if (!onAutoAdvance) return
    const timer = setTimeout(onAutoAdvance, autoAdvanceMs)
    return () => clearTimeout(timer)
  }, [onAutoAdvance, autoAdvanceMs])

  return (
    <div className="flex flex-col items-center text-center gap-6 py-12" role="status" aria-live="polite">
      {/* Animated dots */}
      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 max-w-xs">
        <h2 className="text-xl font-semibold text-slate-800 leading-snug">{title}</h2>
        <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
