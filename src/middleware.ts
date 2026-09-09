import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Update the Supabase session
  const { user, supabaseResponse } = await updateSession(request)

  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // If the user is accessing an admin route and is not logged in, redirect to login
  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // If someone tries to access admin but they are not the admin email
  // (Optional extra security, assuming the admin uses admin@makibros.me)
  if (isAdminRoute && user && user.email !== 'admin@makibros.me') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // If the user is logged in and accesses auth pages, redirect to /admin or /
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = user.email === 'admin@makibros.me' ? '/admin/orders' : '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
