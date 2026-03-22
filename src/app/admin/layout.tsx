import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Proteksi ketat tingkat Layout (Server-side)
  if (!session?.user || (session.user as any).role !== "superadmin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex flex-col">
      {/* Admin Sidebar/Topnav */}
      <header className="px-6 py-4 bg-white dark:bg-[#111] border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted hover:text-foreground transition-colors">
            ← Kembali
          </Link>
          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <span className="text-xl">🛠️</span>
            <span>Panel Super Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/admin/users" 
              className="text-sm font-semibold text-primary"
            >
              Manajemen User
            </Link>
            <Link 
              href="/admin/families" 
              className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
            >
               Bagan Keluarga
            </Link>
          </nav>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Status</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
      
      <footer className="py-6 text-center text-[11px] text-slate-400 uppercase tracking-widest bg-white dark:bg-[#0e0e0e] border-t border-slate-200 dark:border-slate-800">
        Jejak Marga &copy; {new Date().getFullYear()} &bull; Internal Administrator Console
      </footer>
    </div>
  );
}
