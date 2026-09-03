'use client'

import { useActionState, Suspense } from 'react'
import { login } from '@/actions/auth-actions'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, { success: false })
  const searchParams = useSearchParams()
  const errorParam = searchParams?.get('error')

  return (
    <div className="flex flex-col justify-center w-full max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">¡Bienvenido de vuelta!</h1>
        <p className="text-[#a0a0a0]">Ingresa a tu cuenta para continuar</p>
      </div>

      {errorParam && (
        <div className="rounded-md bg-red-900/50 border border-red-500/50 p-4 text-sm text-red-200">
          {errorParam === 'GoogleOAuthFailed' 
            ? 'No se pudo conectar con Google. Por favor intenta de nuevo.' 
            : 'Ocurrió un error de autenticación.'}
        </div>
      )}
      {state.error && (
        <div className="rounded-md bg-red-900/50 border border-red-500/50 p-4 text-sm text-red-200">
          {state.error}
        </div>
      )}

      <div className="space-y-6">
        <GoogleAuthButton />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2a2a2a]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0a0a0a] px-2 text-[#a0a0a0]">O ingresa con email</span>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-white">Correo Electrónico</label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              error={state.fieldErrors?.email?.[0]}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12 placeholder:text-[#666]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-white">Contraseña</label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={state.fieldErrors?.password?.[0]}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12 placeholder:text-[#666]"
            />
          </div>
          <Button type="submit" className="w-full bg-[#e53e3e] hover:bg-[#c53030] text-white h-12 mt-2" isLoading={isPending}>
            Iniciar Sesión
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[#a0a0a0] text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-[#f6ad55] hover:text-white transition-colors font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left side: Image and Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop" 
            alt="Makis Background" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 p-12">
          <Link href="/" className="text-3xl font-black tracking-tighter text-white inline-block">
            MAKII<span className="text-[#e53e3e]">BROS</span>
          </Link>
        </div>

        <div className="relative z-10 p-12 mt-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            Tus makis <br />
            <span className="text-[#e53e3e]">favoritos</span>, <br />
            en un solo lugar.
          </h2>
          <p className="text-gray-300 text-lg max-w-md">
            Descubre nuestra variedad de sabores y disfruta de la mejor experiencia gastronómica.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
        {/* Mobile branding */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            MAKII<span className="text-[#e53e3e]">BROS</span>
          </Link>
        </div>
        
        <Suspense fallback={<div className="text-[#a0a0a0]">Cargando formulario...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
