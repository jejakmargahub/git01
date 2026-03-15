
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");
  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname.startsWith("/invite") || nextUrl.pathname.startsWith("/api/auth");
  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/family") || nextUrl.pathname.startsWith("/profile");

  // Alur 1: Izinkan akses ke Landing Page, Login, Register, dan Invite tanpa syarat
  if (isPublicRoute || isAuthPage) {
    return NextResponse.next();
  }

  // Alur 2: Lindungi Dashboard dan halaman utama lainnya
  // (Pada produksi, NextAuth akan menangani ini. Untuk saat ini kita izinkan agar tidak stuck, 
  // namun bypass cookie sudah tidak lagi memberikan akses spesial.)
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
