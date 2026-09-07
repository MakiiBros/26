'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-xl bg-[#141414] p-8 shadow-xl max-w-md w-full border border-[#2a2a2a]">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Error en el Panel Admin</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Hubo un problema al cargar esta sección. Esto puede ser temporal.
        </p>
        {error?.message && (
          <div className="mb-4 rounded-lg bg-red-950/40 border border-red-500/30 p-3 text-left text-xs font-mono text-red-300 overflow-auto max-h-32">
            {error.message}
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors bg-[#e53e3e] text-white hover:bg-[#c53030] shadow-lg shadow-red-950/30 h-10 px-5 cursor-pointer"
          >
            Intentar de nuevo
          </button>
          <Link 
            href="/admin"
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 hover:bg-[#252525] hover:text-white h-10 px-5"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
