'use client'

import { useActionState, Suspense } from 'react'
import { register } from '@/actions/auth-actions'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'

function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, { success: false })

  return (
    <div className="flex flex-col justify-center w-full max-w-md mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-white">Crear cuenta</h1>
        <p className="text-[#a0a0a0]">Únete a MakiBros para disfrutar de beneficios exclusivos</p>
      </div>

      {state.error && (
        <div className="rounded-md bg-red-900/50 border border-red-500/50 p-4 text-sm text-red-200">
          {state.error}
        </div>
      )}

      <div className="space-y-6">
        <GoogleAuthButton text="Registrarse con Google" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2a2a2a]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0a0a0a] px-2 text-[#a0a0a0]">O regístrate con email</span>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium text-white">Nombre Completo</label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Juan Pérez"
              error={state.fieldErrors?.full_name?.[0]}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12 placeholder:text-[#666]"
            />
          </div>
          
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
            <label htmlFor="phone" className="text-sm font-medium text-white">Teléfono (Opcional)</label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="987654321"
              error={state.fieldErrors?.phone?.[0]}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12 placeholder:text-[#666]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">Contraseña</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                error={state.fieldErrors?.password?.[0]}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12 placeholder:text-[#666]"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white">Confirmar</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                error={state.fieldErrors?.confirmPassword?.[0]}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-12 placeholder:text-[#666]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#e53e3e] hover:bg-[#c53030] text-white h-12 mt-4" isLoading={isPending}>
            Crear cuenta
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-[#a0a0a0] text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-[#f6ad55] hover:text-white transition-colors font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Left side: Image and Branding */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1925&auto=format&fit=crop" 
            alt="Sushi Preparation" 
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
          <div className="inline-flex items-center rounded-full bg-[#e53e3e]/20 border border-[#e53e3e]/50 px-4 py-1.5 text-sm font-semibold text-[#f6ad55] mb-6">
            ✨ -15% en tu primer pedido
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            El sabor que <br />
            te mereces, <br />
            <span className="text-[#e53e3e]">más rápido.</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-md">
            Regístrate ahora, guarda tus favoritos y acumula puntos en cada compra.
          </p>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
        {/* Mobile branding */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            MAKII<span className="text-[#e53e3e]">BROS</span>
          </Link>
        </div>
        
        <Suspense fallback={<div className="text-[#a0a0a0]">Cargando formulario...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  )
}
