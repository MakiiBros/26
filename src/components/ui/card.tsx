import * as React from 'react'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────
// Card (contenedor principal)
// ─────────────────────────────────────────────────────────────

/**
 * Contenedor visual tipo tarjeta con borde, sombra y esquinas redondeadas.
 * Sirve como base para agrupar contenido relacionado.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Maki Especial</CardTitle>
 *     <CardDescription>Salmón, palta y queso crema</CardDescription>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 *   <CardFooter>...</CardFooter>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

// ─────────────────────────────────────────────────────────────
// CardHeader
// ─────────────────────────────────────────────────────────────

/** Sección superior de la tarjeta, normalmente contiene título y descripción. */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

// ─────────────────────────────────────────────────────────────
// CardTitle
// ─────────────────────────────────────────────────────────────

/** Título principal de la tarjeta. Usa <h3> para semántica correcta. */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

// ─────────────────────────────────────────────────────────────
// CardDescription
// ─────────────────────────────────────────────────────────────

/** Subtítulo o descripción breve debajo del título de la tarjeta. */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

// ─────────────────────────────────────────────────────────────
// CardContent
// ─────────────────────────────────────────────────────────────

/** Área de contenido principal de la tarjeta. */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

// ─────────────────────────────────────────────────────────────
// CardFooter
// ─────────────────────────────────────────────────────────────

/** Pie de la tarjeta, ideal para acciones o botones. */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

// ─────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
