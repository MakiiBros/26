'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

/** Tipos visuales de notificación disponibles */
export type ToastType = 'success' | 'error' | 'info'

/** Estructura interna de un toast individual */
interface ToastItem {
  /** Identificador único para la key de React y la lógica de eliminación */
  id: string
  /** Mensaje que se muestra al usuario */
  message: string
  /** Tipo visual que determina colores e ícono */
  type: ToastType
  /** Controla la animación de salida antes de eliminar del DOM */
  isExiting: boolean
}

/** Interfaz pública del hook useToast */
interface ToastContextValue {
  /**
   * Muestra una notificación toast.
   * @param message - Texto a mostrar
   * @param type    - Tipo visual (success | error | info)
   */
  toast: (message: string, type?: ToastType) => void
}

// ─────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────

/** Duración en ms antes de iniciar la animación de salida */
const TOAST_DURATION_MS = 4000

/** Duración de la animación de salida en ms (debe coincidir con CSS) */
const EXIT_ANIMATION_MS = 300

/** Clases de color por tipo de toast */
const toastStyles: Record<ToastType, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
}

/** Íconos SVG por tipo de toast */
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg
      className="h-5 w-5 flex-shrink-0 text-green-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg
      className="h-5 w-5 flex-shrink-0 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg
      className="h-5 w-5 flex-shrink-0 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
}

// ─────────────────────────────────────────────────────────────
// Contexto
// ─────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

/**
 * Proveedor del sistema de notificaciones toast.
 * Debe envolver la parte de la app que necesite mostrar toasts
 * (típicamente en el layout raíz).
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * <ToastProvider>
 *   {children}
 * </ToastProvider>
 * ```
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  /**
   * Elimina un toast del estado.
   * Primero marca el toast como "saliendo" para ejecutar la animación,
   * luego lo remueve del DOM tras completar la transición.
   */
  const removeToast = useCallback((id: string) => {
    // Paso 1: iniciar animación de salida
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    )

    // Paso 2: eliminar del DOM después de que termine la animación
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, EXIT_ANIMATION_MS)
  }, [])

  /**
   * Crea y muestra un nuevo toast.
   * Cada toast se auto-elimina después de TOAST_DURATION_MS.
   */
  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

      const newToast: ToastItem = { id, message, type, isExiting: false }
      setToasts((prev) => [...prev, newToast])

      // Programar auto-eliminación
      setTimeout(() => {
        removeToast(id)
      }, TOAST_DURATION_MS)
    },
    [removeToast]
  )

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo<ToastContextValue>(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Contenedor de toasts — posición fija en esquina inferior derecha */}
      {toasts.length > 0 && (
        <div
          className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
          aria-live="polite"
          aria-label="Notificaciones"
        >
          {toasts.map((item) => (
            <div
              key={item.id}
              className={cn(
                // Estilos base
                'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg',
                'min-w-[280px] max-w-[420px]',
                // Animación de entrada / salida
                'transition-all duration-300 ease-in-out',
                item.isExiting
                  ? 'translate-x-full opacity-0'
                  : 'translate-x-0 opacity-100',
                // Color según tipo
                toastStyles[item.type]
              )}
              role="status"
            >
              {/* Ícono */}
              {toastIcons[item.type]}

              {/* Mensaje */}
              <p className="flex-1 text-sm font-medium">{item.message}</p>

              {/* Botón para cerrar manualmente */}
              <button
                type="button"
                onClick={() => removeToast(item.id)}
                className="flex-shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-1"
                aria-label="Cerrar notificación"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

/**
 * Hook para mostrar notificaciones toast desde cualquier componente
 * cliente envuelto en `<ToastProvider>`.
 *
 * @example
 * ```tsx
 * const { toast } = useToast()
 *
 * const handleSave = async () => {
 *   try {
 *     await saveDish(data)
 *     toast('Plato guardado correctamente', 'success')
 *   } catch {
 *     toast('Error al guardar el plato', 'error')
 *   }
 * }
 * ```
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(
      'useToast debe usarse dentro de un <ToastProvider>. ' +
        'Asegúrate de envolver tu layout con <ToastProvider>.'
    )
  }

  return context
}
