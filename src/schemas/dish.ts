import { z } from 'zod'

/**
 * Esquema de validación Zod para platos.
 * Se usa tanto en Server Actions (servidor) como en formularios (cliente).
 */
export const dishSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .trim()
    .optional()
    .or(z.literal('')),
  price: z.coerce
    .number({ message: 'El precio debe ser un número válido' })
    .positive('El precio debe ser mayor a 0')
    .multipleOf(0.01, 'El precio puede tener máximo 2 decimales'),
  category_id: z
    .string()
    .uuid('Categoría inválida'),
  is_available: z.coerce.boolean().default(true),
  video_360_url: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal(''))
    .nullable(),
  sort_order: z.coerce
    .number()
    .int('El orden debe ser un número entero')
    .min(0, 'El orden no puede ser negativo')
    .default(0),
})

/** Tipo inferido del esquema de platos */
export type DishFormData = z.infer<typeof dishSchema>

/**
 * Esquema de validación para login de administradores.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

