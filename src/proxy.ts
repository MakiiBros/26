import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

async function fetchUserRole(supabase: any, userId: string): Promise<string> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  return profile?.role ?? 'user'
}

function redirectTo(request: NextRequest, path: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = path
  return NextResponse.redirect(url)
}

async function handleAdminRoute(
  request: NextRequest,
  user: { id: string } | null,
  supabase: any,
  supabaseResponse: NextResponse,
): Promise<NextResponse> {
  if (!user) {
    return redirectTo(request, '/auth/login')
  }

  const role = await fetchUserRole(supabase, user.id)
  return role === 'admin' ? supabaseResponse : redirectTo(request, '/')
}

async function handleAuthRoute(
  request: NextRequest,
  user: { id: string } | null,
  supabase: any,
  supabaseResponse: NextResponse,
): Promise<NextResponse> {
  if (!user) {
    return supabaseResponse
  }

  const role = await fetchUserRole(supabase, user.id)
  return redirectTo(request, role === 'admin' ? '/admin/orders' : '/')
}

export async function proxy(request: NextRequest) {
  const { user, supabaseResponse, supabase } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin')) {
    return handleAdminRoute(request, user, supabase, supabaseResponse)
  }

  if (pathname.startsWith('/auth')) {
    return handleAuthRoute(request, user, supabase, supabaseResponse)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
