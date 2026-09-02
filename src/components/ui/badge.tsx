import * as React from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Variantes
// ─────────────────────────────────────────────────────────────

/** Mapa de clases para cada variante de color del badge */
const badgeVariants = {
  default: 'bg-orange-100 text-orange-800',
  success: 'bg-green-100 text-green-800',
  destructive: 'bg-red-100 text-red-800',
  secondary: 'bg-gray-100 text-gray-800',
} as const

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

/** Variantes de color disponibles para el badge */
export type BadgeVariant = keyof typeof badgeVariants

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Variante de color del badge */
  variant?: BadgeVariant
}

// ─────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────

/**
 * Badge (etiqueta) pequeña tipo "pill" para mostrar estados,
 * categorías o conteos de forma compacta.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Disponible</Badge>
 * <Badge variant="destructive">Agotado</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        'transition-colors',
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
