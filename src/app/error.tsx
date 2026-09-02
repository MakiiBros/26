'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

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
          <Button onClick={() => reset()}>
            Intentar nuevamente
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Ir al Inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

