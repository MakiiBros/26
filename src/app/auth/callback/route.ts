import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ============================================================================
// Auth Callback Route
//
// Ruta esencial para flujos de OAuth (Google) y Magic Links.
// Intercambia el parámetro 'code' de la URL por una sesión válida de Supabase,
// guardándola de manera segura en las cookies mediante el cliente SSR.
// ============================================================================

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 'next' param se usa para redirigir tras un login exitoso
  const next = searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createClient()
    
    // Intercambiamos el código por una sesión
    // La función createClient ya configura las cookies automáticamente
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Login exitoso, redirigimos a la ruta deseada o dashboard
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error('[Auth Callback] Error intercambiando código:', error.message)
  }

  // Redirigimos al inicio si no hay código o hubo error
  return NextResponse.redirect(`${origin}/auth/login?error=AuthCodeError`)
}

