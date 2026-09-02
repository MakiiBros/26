import * as React from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Variantes visuales del botón
// ─────────────────────────────────────────────────────────────

/** Mapa de clases para cada variante de estilo del botón */
const buttonVariants = {
  default: 'bg-orange-600 text-white hover:bg-orange-700 focus-visible:ring-orange-500',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  outline:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-400',
  ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',
} as const

/** Mapa de clases para cada tamaño de botón */
const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-11 px-8 text-base',
  icon: 'h-10 w-10',
} as const

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

/** Variantes de estilo disponibles */
export type ButtonVariant = keyof typeof buttonVariants

/** Tamaños disponibles */
export type ButtonSize = keyof typeof buttonSizes

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón */
  variant?: ButtonVariant
  /** Tamaño del botón */
  size?: ButtonSize
  /**
   * Si es `true`, muestra un spinner de carga y deshabilita el botón.
   * Útil para indicar operaciones asíncronas en curso.
   */
  isLoading?: boolean
}

// ─────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────

/**
 * Componente Button reutilizable con soporte para variantes, tamaños
 * y estado de carga. Usa `React.forwardRef` para permitir acceso
 * directo al elemento DOM subyacente.
 *
 * @example
 * ```tsx
 * <Button variant="default" size="lg" isLoading={isSaving}>
 *   Guardar cambios
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Estilos base compartidos por todas las variantes
          'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variante y tamaño seleccionados
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants, buttonSizes }
