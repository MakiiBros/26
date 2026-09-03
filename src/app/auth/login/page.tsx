'use client'

import { useActionState, Suspense } from 'react'
import { login, loginWithGoogle } from '@/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, { success: false })
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')

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
        {/* <form action={loginWithGoogle}>
          <Button 
            type="submit" 
            variant="outline" 
            className="w-full flex gap-2 items-center justify-center bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border-[#2a2a2a] h-12"
          >
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
            <span className="w-full border-t border-[#2a2a2a]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0a0a0a] px-2 text-[#a0a0a0]">O ingresa con email</span>
          </div>
        </div> */}

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
