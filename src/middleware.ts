import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const dbUrl = process.env.DATABASE_URL || "";
const IS_DEMO = !dbUrl || dbUrl.includes("user:password@host") || dbUrl.includes("your_neon") || dbUrl.length < 30;

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Demo mode: allow all routes
  if (IS_DEMO) {
    // In demo mode, redirect auth pages to dashboard
    const isAuthPage =
      nextUrl.pathname.startsWith("/login") ||
      nextUrl.pathname.startsWith("/register");

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Production mode: use NextAuth middleware
  // Note: This requires a dynamic import which isn't supported in Edge middleware.
  // For production, replace this file with the auth-based middleware.
  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");
  const isApiRoute = nextUrl.pathname.startsWith("/api");
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname.startsWith("/invite");

  if (isApiRoute) return NextResponse.next();
  if (isAuthPage) return NextResponse.next();
  if (isPublicRoute) return NextResponse.next();

  // In production without proper auth middleware, redirect to login
  return NextResponse.redirect(new URL("/login", nextUrl));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)" ],
};
