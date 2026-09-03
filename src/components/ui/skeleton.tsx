import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

// ─────────────────────────────────────────────────────────────
// Componente
// ─────────────────────────────────────────────────────────────

/**
 * Placeholder animado para indicar contenido en carga.
 * Usa `className` para definir las dimensiones según el contenido
 * que reemplazará (ej: `h-4 w-[200px]` para simular texto).
 *
 * @example
 * ```tsx
 * {/* Skeleton de una tarjeta de plato *\/}
 * <div className="space-y-3">
 *   <Skeleton className="h-48 w-full" />
 *   <Skeleton className="h-4 w-3/4" />
 *   <Skeleton className="h-4 w-1/2" />
 * </div>
 * ```
 */
function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      aria-hidden="true"
      {...props}
    />
  )
}

Skeleton.displayName = 'Skeleton'

export { Skeleton }
