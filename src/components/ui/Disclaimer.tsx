interface DisclaimerProps {
  text: string
  variant?: 'inline' | 'banner'
}

export function Disclaimer({ text, variant = 'inline' }: DisclaimerProps) {
  if (variant === 'banner') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4" role="note">
        <p className="text-sm text-amber-800 leading-relaxed">{text}</p>
      </div>
    )
  }

  return (
    // text-slate-500 instead of text-slate-400 — better contrast on slate-50 bg
    <p className="text-xs text-slate-500 text-center leading-relaxed" role="note">
      {text}
    </p>
  )
}
