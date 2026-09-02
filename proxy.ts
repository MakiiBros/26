import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// ============================================================================
// Middleware principal de la aplicación makisbros.
//
// Responsabilidades:
// 1. Generar un nonce CSP único por cada solicitud
// 2. Construir y aplicar la cabecera Content-Security-Policy
// 3. Refrescar la sesión de autenticación de Supabase
// 4. Proteger las rutas /admin verificando rol de administrador
// ============================================================================

export async function proxy(request: NextRequest) {
  // 1. Refrescar la sesión de autenticación de Supabase
  const { user, supabaseResponse, supabase } = await updateSession(request)

  // 2. Auth Guard — Protección de rutas /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Sin sesión → redirigir a login
    if (!user) {
      const loginUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar rol de administrador consultando la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Si hubo error al consultar el perfil o el rol no es admin → redirigir al inicio
    if (profileError || profile?.role !== 'admin') {
      const homeUrl = new URL('/', request.url)
      return NextResponse.redirect(homeUrl)
    }
  }

  return supabaseResponse
}

// ============================================================================
// Configuración del matcher
// Se excluyen archivos estáticos, imágenes y el favicon para que el middleware
// solo se ejecute en rutas de página/API.
// ============================================================================
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
