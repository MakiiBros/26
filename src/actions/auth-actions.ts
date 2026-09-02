'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/schemas/dish'
import { ROUTES } from '@/lib/constants'
import type { FormState } from '@/types'

/**
 * Inicia sesión utilizando Google OAuth.
 * Obtiene la URL de autorización de Supabase y redirige al usuario.
 */
export async function loginWithGoogle() {
  const supabase = await createClient()
  
  // Obtenemos la URL base del sitio desde la variable de entorno,
  // útil para Vercel o desarrollo local.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=/admin`,
    },
  })

  if (error) {
    console.error('[Auth Actions] Error en Google OAuth:', error.message)
    // Redirigir de vuelta al login con un error en query params
    redirect('/auth/login?error=GoogleOAuthFailed')
  }

  if (data.url) {
    redirect(data.url)
  }
}

// ============================================================================
// Server Actions de Autenticación
//
// Estas acciones manejan el inicio y cierre de sesión de administradores.
// Utilizan Supabase Auth y validación Zod para garantizar datos correctos.
// ============================================================================

/**
 * Inicia sesión con email y contraseña.
 *
 * Valida los campos del formulario con loginSchema (Zod) y luego
 * intenta autenticar al usuario con Supabase Auth.
 *
 * @param prevState - Estado anterior del formulario (usado por useActionState)
 * @param formData - Datos del formulario con 'email' y 'password'
 * @returns Estado del formulario con errores de campo o error general
 */
export async function login(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    // Extraer datos del formulario
    const rawData = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    // Validar con el esquema de login
    const validationResult = loginSchema.safeParse(rawData)

    if (!validationResult.success) {
      // Retornar errores de validación por campo
      return {
        success: false,
        error: 'Por favor, corrige los errores del formulario.',
        fieldErrors: validationResult.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      }
    }

    const { email, password } = validationResult.data

    // Crear cliente de Supabase para el contexto del servidor
    const supabase = await createClient()

    // Intentar iniciar sesión con email y contraseña
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Supabase retorna mensajes en inglés; proveemos uno en español
      return {
        success: false,
        error: 'Credenciales inválidas. Verifica tu email y contraseña.',
      }
    }
  } catch (error) {
    // Error inesperado del servidor
    console.error('[auth-actions] Error en login:', error)
    return {
      success: false,
      error: 'Ocurrió un error inesperado. Intenta de nuevo más tarde.',
    }
  }

  // Redirigir al panel de administración tras login exitoso.
  // redirect() lanza una excepción interna de Next.js, por eso va fuera del try/catch.
  redirect(ROUTES.ADMIN)
}

/**
 * Cierra la sesión del usuario actual.
 *
 * Invalida la sesión en Supabase Auth y redirige al inicio.
 */
export async function logout(): Promise<void> {
  try {
    const supabase = await createClient()

    // Cerrar sesión — elimina las cookies de autenticación
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('[auth-actions] Error en logout:', error.message)
    }
  } catch (error) {
    console.error('[auth-actions] Error inesperado en logout:', error)
  }

  // Redirigir al inicio tras cerrar sesión.
  // redirect() va fuera del try/catch porque lanza una excepción interna de Next.js.
  redirect(ROUTES.HOME)
}
