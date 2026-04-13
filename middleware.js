import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value

  // If no token and trying to access dashboard, redirect to sign-in
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // If token and trying to access auth pages, redirect to dashboard
  if (token && (request.nextUrl.pathname.startsWith("/sign-in") || request.nextUrl.pathname.startsWith("/sign-up"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
}

