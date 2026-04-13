import React from 'react'

interface TextProps {
  children: React.ReactNode
  className?: string
}

export function H1({ children, className = '' }: TextProps) {
  return (
    <h1 className={`text-3xl font-semibold text-slate-800 leading-snug tracking-tight ${className}`}>
      {children}
    </h1>
  )
}

export function H2({ children, className = '' }: TextProps) {
  return (
    <h2 className={`text-2xl font-semibold text-slate-800 leading-snug ${className}`}>
      {children}
    </h2>
  )
}

export function H3({ children, className = '' }: TextProps) {
  return (
    <h3 className={`text-lg font-medium text-slate-700 leading-snug ${className}`}>
      {children}
    </h3>
  )
}

export function Body({ children, className = '' }: TextProps) {
  return (
    <p className={`text-base text-slate-600 leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

export function BodySmall({ children, className = '' }: TextProps) {
  return (
    <p className={`text-sm text-slate-500 leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

export function Label({ children, className = '' }: TextProps) {
  return (
    <span className={`text-xs font-medium text-slate-400 uppercase tracking-wide ${className}`}>
      {children}
    </span>
  )
}

export function PageTitle({ children, className = '' }: TextProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-semibold text-slate-800 leading-snug tracking-tight">
        {children}
      </h1>
    </div>
  )
}
