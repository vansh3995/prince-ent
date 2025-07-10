import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files, API routes, and auth pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin/login" ||
    pathname === "/"
  ) {
    return NextResponse.next()
  }

  // Check for auth token for protected routes
  const token = request.cookies.get("authToken")?.value || 
                request.headers.get("authorization")?.replace("Bearer ", "")

  // Protected user routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/booking")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Protected admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const adminToken = request.cookies.get("adminToken")?.value || 
                      request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}