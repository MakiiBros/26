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

export async function middleware(request: NextRequest) {
  // --------------------------------------------------------------------------
  // 1. Generación del nonce CSP
  // Cada solicitud recibe un nonce único para proteger contra XSS.
  // Se codifica en base64 a partir de un UUID aleatorio.
  // --------------------------------------------------------------------------
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // --------------------------------------------------------------------------
  // 2. Construcción de la Content-Security-Policy
  // Se permite 'unsafe-inline' en style-src porque Tailwind CSS lo requiere.
  // Se permite img-src desde Supabase Storage para cargar imágenes de platos.
  // --------------------------------------------------------------------------
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: ${process.env.NEXT_PUBLIC_SUPABASE_URL};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `

  // Limpiar saltos de línea y espacios extra para una cabecera válida
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  // --------------------------------------------------------------------------
  // 3. Configurar el nonce en las cabeceras del request
  // Los layouts pueden leer el nonce desde la cabecera 'x-nonce' para
  // inyectarlo en scripts inline.
  // --------------------------------------------------------------------------
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

  // --------------------------------------------------------------------------
  // 4. Refrescar la sesión de autenticación de Supabase
  // updateSession() renueva las cookies de sesión y retorna el usuario actual,
  // la respuesta con cookies actualizadas, y el cliente Supabase.
  // --------------------------------------------------------------------------
  const { user, supabaseResponse, supabase } = await updateSession(request)

  // --------------------------------------------------------------------------
  // 5. Auth Guard — Protección de rutas /admin
  // Si el usuario no tiene sesión, se redirige a /auth/login.
  // Si tiene sesión pero no es admin, se redirige al inicio.
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // 6. Aplicar cabeceras CSP y nonce a la respuesta
  // Se copian las cabeceras del request al response para que estén disponibles
  // tanto en el servidor (layouts/pages) como en el navegador.
  // --------------------------------------------------------------------------
  supabaseResponse.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
  supabaseResponse.headers.set('x-nonce', nonce)

  // --------------------------------------------------------------------------
  // 7. Retornar la respuesta de Supabase con las cookies actualizadas
  // Es importante retornar supabaseResponse y no crear un NextResponse nuevo,
  // ya que contiene las cookies de sesión renovadas.
  // --------------------------------------------------------------------------
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
