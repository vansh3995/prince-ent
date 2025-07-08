import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const payload = verifyToken(token)
      
      if (!payload || payload.type !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protect user dashboard
  if (pathname.startsWith('/dashboard') && !pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const payload = verifyToken(token)
      
      if (!payload || payload.type !== 'user') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*'
  ]
}
