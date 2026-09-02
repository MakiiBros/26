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
        <p className="text-gray-600 mb-6 text-sm">
          No pudimos cargar esta sección correctamente.
        </p>
        <Button onClick={() => reset()}>
          Intentar nuevamente
        </Button>
      </div>
    </div>
  )
}

