import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

  const response = NextResponse.next()

  // Example: Protect admin/profile routes using a simple cookie check (Edge-safe)
  // Replace 'auth_token' with your actual cookie name
  const isLoggedIn = Boolean(request.cookies.get('auth_token'))

  if ((request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/profile")) && !isLoggedIn) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    if (request.nextUrl.pathname.startsWith("/profile")) {
      url.searchParams.set("redirect", request.nextUrl.pathname)
    }
    return NextResponse.redirect(url)
  }
  response.headers.set("x-pathname", request.nextUrl.pathname)
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
