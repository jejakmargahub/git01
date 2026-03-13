import Link from "next/link";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Jejak Marga | Silsilah Keluarga Modern & Aman",
  description: "Platform untuk mencatat, menyimpan, dan membagikan jejak leluhur keluarga Anda dengan mudah.",
};

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-card-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-xl font-bold text-primary flex items-center gap-2">
          <span>🌳</span> Jejak Marga
        </div>
        <div>
          {session ? (
            <Link href="/dashboard" className="btn btn-primary text-sm px-4 py-2 rounded-full">
              Ke Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn btn-secondary text-sm px-4 py-2 rounded-full">
              Masuk
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24 pb-16">
        <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-2">
            <span className="text-5xl">👨‍👩‍👧‍👦</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Lestarikan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Silsilah Keluarga</span> Anda
          </h1>
          
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Platform modern, aman, dan mudah digunakan untuk mencatat, menyusun, dan mewariskan jejak leluhur hingga ke anak cucu.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link 
              href={session ? "/dashboard" : "/login"} 
              className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 w-full sm:w-auto rounded-xl"
            >
              {session ? "Buka Dasbor Saya" : "🚀 Masuk ke Sistem"}
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mx-auto mt-32 text-left mb-12">
          <div className="card hover:-translate-y-1 transition-transform border-t-4 border-t-primary">
            <div className="text-3xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Privasi Terjaga</h3>
            <p className="text-muted text-sm leading-relaxed">Bagan silsilah Anda berada dalam ruang tertutup. Hanya anggota keluarga yang diundang yang bisa melihat dan mengelola datanya.</p>
          </div>
          <div className="card hover:-translate-y-1 transition-transform border-t-4 border-t-accent">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Akses Instan</h3>
            <p className="text-muted text-sm leading-relaxed">Didesain khusus untuk optimal di semua perangkat. Masuk dengan mudah menggunakan Nomor Handphone dan kode PIN saja.</p>
          </div>
          <div className="card hover:-translate-y-1 transition-transform border-t-4 border-t-success">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2">Kolaborasi Tautan</h3>
            <p className="text-muted text-sm leading-relaxed">Cukup bagikan tautan kode unik untuk mengajak kerabat jauh bergabung, memastikan setiap cabang keluarga terlengkapi.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border py-8 text-center text-muted mt-auto bg-card">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🌳</span> 
          <span className="font-bold text-foreground">Jejak Marga</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Hak Cipta Dilindungi.</p>
        <p className="text-xs mt-1 text-primary">jejakmarga.my.id</p>
      </footer>
    </div>
  );
}
