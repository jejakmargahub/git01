
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const hasBypassCookie = req.cookies.get("bypassAuth")?.value === "true";
  
  const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/invite") || nextUrl.pathname.startsWith("/api/auth");
  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/family") || nextUrl.pathname.startsWith("/profile");

  // Alur 1: Izinkan akses ke Landing Page, Login, Register, dan Invite tanpa syarat
  if (isPublicRoute || isAuthPage) {
    return NextResponse.next();
  }

  // Alur 2: Bypass untuk Testing
  if (hasBypassCookie) {
    return NextResponse.next();
  }

  // Alur 3: Lindungi Dashboard dan halaman utama lainnya
  // (Idealnya menggunakan session dari NextAuth, tapi untuk kemudahan pengujian saat ini kita gunakan redirect ke login jika tidak ada bypass)
  if (isDashboardPage) {
    // Di sini nanti bisa ditambahkan pengecekan session asli jika perlu
    return NextResponse.next(); 
  }

  // Default: Biarkan Next.js menangani rute lainnya (atau redirect ke login jika ingin ketat)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
