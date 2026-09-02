'use client'

import { useActionState } from 'react'
import { login } from '@/actions/auth-actions'
import { loginWithGoogle } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'

import { Suspense } from 'react'

function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, { success: false })
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Acceso Administrativo</CardTitle>
        <CardDescription>
          Ingresa a tu cuenta para gestionar el menú de makisbros.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorParam && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {errorParam === 'GoogleOAuthFailed' 
              ? 'No se pudo conectar con Google. Por favor intenta de nuevo.' 
              : 'Ocurrió un error de autenticación.'}
          </div>
        )}
        {state.error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <div className="space-y-4">
          <form action={loginWithGoogle}>
            <Button type="submit" variant="outline" className="w-full flex gap-2 items-center justify-center bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continuar con Google
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">O ingresa con email</span>
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Input
                label="Correo Electrónico"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@makisbros.com"
                error={state.fieldErrors?.email?.[0]}
              />
            </div>
            <div className="space-y-2">
              <Input
                label="Contraseña"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                error={state.fieldErrors?.password?.[0]}
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isPending}>
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-gray-500">Cargando formulario...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
