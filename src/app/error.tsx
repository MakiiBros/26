'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error Boundary caught:', error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center">
      <div className="rounded-lg bg-white p-8 shadow-sm max-w-md w-full border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Algo salió mal!</h2>
        <p className="text-gray-600 mb-4 text-sm">
          No pudimos cargar esta sección correctamente.
        </p>
        {error?.message && (
          <div className="mb-4 rounded bg-red-50 p-2 text-left text-xs font-mono text-red-600 overflow-auto max-h-32">
            {error.message}
          </div>
        )}
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] disabled:pointer-events-none disabled:opacity-50 bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-sm h-10 px-4 py-2"
          >
            Intentar nuevamente
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] disabled:pointer-events-none disabled:opacity-50 bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 h-10 px-4 py-2"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}

