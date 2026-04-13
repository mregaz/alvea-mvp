import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-xs">
        <p className="text-5xl" aria-hidden="true">🔍</p>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-slate-800">Pagina non trovata</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            La pagina che cerchi non esiste o è stata spostata.
          </p>
        </div>
        <Link
          href="/it"
          className="bg-teal-600 text-white rounded-2xl px-6 py-3.5 text-sm font-semibold hover:bg-teal-700 transition-colors"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  )
}
