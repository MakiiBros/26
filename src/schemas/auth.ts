import { z } from 'zod'

export const registerSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100).trim(),
  email: z.string().min(1, 'El email es obligatorio').email('Email inválido'),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos').max(15).trim().optional().or(z.literal('')),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export type RegisterFormData = z.infer<typeof registerSchema>
