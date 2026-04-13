type BadgeVariant = 'green' | 'yellow' | 'red' | 'neutral' | 'info'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-emerald-100 text-emerald-800',
  yellow: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  neutral: 'bg-slate-100 text-slate-600',
  info: 'bg-teal-100 text-teal-800',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
