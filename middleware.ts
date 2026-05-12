import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/admin',
  '/courier',
  '/staff',
  '/super-admin',
  '/dashboard'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is protected
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtected) {
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value
    const userRole = request.cookies.get('user_role')?.value

    if (!token) {
      // Redirect to login if no token
      const response = NextResponse.redirect(new URL('/login', request.url))
      // Clear any invalid cookies
      response.cookies.delete('auth_token')
      response.cookies.delete('user_role')
      return response
    }

    // Optional: Simple role-based access check using cookie
    if (pathname.startsWith('/super-admin') && userRole !== 'super_admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (pathname.startsWith('/admin') && !['admin', 'super_admin'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (pathname.startsWith('/courier') && userRole !== 'courier') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (pathname.startsWith('/staff') && userRole !== 'staff') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/courier/:path*',
    '/staff/:path*',
    '/super-admin/:path*',
    '/dashboard/:path*'
  ]
}
