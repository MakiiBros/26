import * as React from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Texto de error a mostrar debajo del input.
   * Cuando está presente, el borde del input se vuelve rojo
   * para indicar visualmente el error al usuario.
   */
  error?: string
  /**
   * Etiqueta descriptiva que se muestra encima del input.
   * Asociada automáticamente al input mediante `htmlFor`.
   */
  label?: string
}

// ─────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────

/**
 * Componente Input reutilizable con soporte para etiqueta y
 * mensaje de error. Compatible con formularios controlados
 * y no controlados gracias a `React.forwardRef`.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Nombre del plato"
 *   placeholder="Ej: Maki Especial"
 *   error={errors.name?.message}
 * />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, label, id, ...props }, ref) => {
    // Generar un ID estable si no se proporciona uno,
    // para vincular correctamente el <label> con el <input>
    const inputId = id ?? React.useId()

    return (
      <div className="w-full">
        {/* Etiqueta opcional */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        {/* Campo de entrada */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
            'ring-offset-white',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-gray-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Si hay error, reemplazar el borde por rojo
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />

        {/* Mensaje de error */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-red-500"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
