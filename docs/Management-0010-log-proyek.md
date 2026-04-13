# Silsilah Keluarga PWA â€“ Project Log

> **Conversation ID**: `a7f5de84-003f-4c68-93a8-ba1f4b92355e`
> **Terakhir diperbarui**: 13 April 2026, 12:30 WIB (v1.1.0-stable)

---

## Ringkasan Proyek

Aplikasi web Progressive Web App (PWA) untuk melacak silsilah keluarga dengan **tiga ruang terpisah**:
1. **Siauw Sak Po** â€“ Khusus keluarga inti (garis keturunan langsung)
2. **Keluarga Lain (Umum)** â€“ Untuk keluarga lain yang ingin membuat silsilah sendiri
3. **Perkumpulan Marga Siauw** â€“ Khusus anggota marga Siauw terverifikasi

**Stack**: Next.js 16 Â· Tailwind CSS v4 Â· Drizzle ORM Â· Neon PostgreSQL Â· NextAuth.js v5

---

## Kronologi Pengembangan

### Sesi 1 â€“ Fondasi + Dashboard + Pohon (Fase 1-3)

**Apa yang dibangun:**
1. Project initialization (Next.js + Tailwind + TypeScript)
2. Database schema: 5 tabel (users, families, family_members, relationships, family_access)
3. Authentication: NextAuth.js (Credentials + Google), register API, middleware
4. Dashboard: kartu bagan keluarga, FAB, create dialog
5. Family page: toggle pohon/daftar, CRUD anggota, hubungan keluarga
6. Pohon keluarga: custom SVG, zoom/pan, auto-layout, node kustom
7. Search page + API (cari anggota di semua bagan)
8. Profile page (info user, settings, logout)

### Sesi 3 â€“ Demo Mode & Responsiveness
**Apa yang dibangun:**
1. **Demo Mode**: Bypass database & Auth menggunakan mock data (`mock-data.ts`) jika `DATABASE_URL` belum diset.
2. **Data Dummy**: 16 anggota keluarga (4 generasi) lengkap dengan gelar dan hubungan.
3. **Optimasi Pohon**: 
   - Tampilan Nickname diletakkan di atas Full Name (menampilkan keduanya).
   - Menambahkan fitur Umur di pojok kanan node (Dihitung otomatis).
   - **Privasi Umur**: Input dan tampilan tanggal lahir diubah hanya meminta **Bulan dan Tahun** (hari tidak disimpan untuk menjaga privasi tiap anggota yang hidup). Untuk **Tanggal Meninggal**, detail lengkap (Hari, Bulan, Tahun) tetap disimpan dan ditampilkan.
   - **Perbaikan Terpotong (Cutoff)**: Algoritma *auto-fit* dioptimalkan untuk menghitung batas (bounds) pohon secara presisi. Ditambahkan *Right Padding* khusus untuk layar Monitor Desktop / Ultra-wide dan **perbaikan lebar viewport SVG (max 100% vs contentWidth)** agar cabang paling kanan (misal keluarga Om Hwa) tidak lagi terpotong. 
   - **Pinch-to-Zoom**: Menambahkan dukungan *touch gesture* dua jari (pinch-to-zoom) khusus untuk perangkat mobile/HP.
   - **Nama Mandarin**: Menambahkan field khusus untuk penulisan huruf Mandarin (Hanzi), yang akan ditampilkan berdampingan dengan nama panggilan pada diagram pohon dan halaman detail profil.
   - Node height disesuaikan dari 90px ke 100px.

### Sesi 4 â€“ Chat Real-time & Pemolesan Produksi (Fase 11)
**Apa yang dibangun:**
1. **Family Chat**: Fitur chat real-time per bagan keluarga menggunakan **Pusher**.
2. **Build Stability**: Implementasi **Lazy Loading** pada koneksi Database dan Pusher Client/Server untuk memperbaiki error build Vercel (karena missing env vars saat static analysis).
3. **Testing Feature**: Menambahkan **Guest Name Modal** (Pop-up Identitas) untuk memudahkan pengujian identitas user saat menggunakan akses bypass.
4. **Modern UI Format**: Pesan chat ditampilkan dengan format `Nama: Pesan` di dalam bubble. Pengguna juga dapat berganti identitas via tombol "Ganti Profil".
5. **Segoe UI Font**: Mengubah font utama aplikasi menjadi 'Segoe UI' (atau Inter/System fallback) untuk tampilan yang lebih premium.
6. **Clean Build**: Memperbaiki semua error TypeScript (implicit any) dan merapikan struktur direktori.

### Sesi 5 â€“ Media, About, & Kolaborasi (Fase 17-20)
**Apa yang dibangun:**
1. **Media Organization**: Upload foto anggota kini tertata di folder `/members/${familyId}/` di ImageKit.
2. **About Us Page**: Halaman storytelling premium dengan animasi `framer-motion` dan edukasi ragam bahasa Nusantara.
3. **Invite Codes**: 
   - Otomasi pembuatan kode unik `JM-XXXXX`.
   - UI Compact di kartu keluarga (sejajar tombol chat).
   - Fitur "Salin & Bagikan khusus untuk Keluarga" dengan feedback state-based yang stabil.
   - Database self-healing logic untuk data lama.
4. **Blog Schema**: Persiapan tabel `blog_posts` untuk artikel multi-bahasa.

### Sesi 6 â€“ UX Premium & Kedaulatan Data (Fase 21-23)
**Apa yang dibangun:**
1. **Premium Desktop Nav**: Transformasi bottom bar menjadi floating dock dengan glassmorphism.
2. **Family Settings**: Dialog admin baru untuk manajemen bagan (`FamilySettingsDialog.tsx`).
3. **Invite Code Lifecycle**: Fitur reset kode unik guna menjaga privasi akses.
4. **Data Export System**: Implementasi ekspor data dalam format JSON, CSV, dan PDF (via `jsPDF`) untuk portabilitas data.

### Sesi 7 â€“ Berbagi Publik & Akses UI (Fase 24-25)
**Apa yang dibangun:**
1.  **Centered Modal Sharing**: Mengubah dialog "Bagikan" di halaman keluarga menjadi pop-up tengah (Desktop) agar lebih nyaman digunakan.
2.  **Public-Only Sharing**: Menyederhanakan menu Bagikan agar hanya fokus pada "Tampilan Publik" (Link Tanpa Login).
3.  **Privacy Masking**: Implementasi otomatis penyembunyian data nomor HP dan Bio pada tampilan publik.
4.  **Invite Code Restoration**: Menampilkan kembali kode unik (Editor) di kartu dashboard sebagai badge biru yang dapat disalin, memberikan Admin akses cepat tanpa mengganggu kesederhanaan menu Bagikan.
5.  **Simplified UI Badge**: Menambahkan keterangan "Privat ðŸ”’" di kartu dashboard jika link publik belum diaktifkan.

### Sesi 8 â€“ Pembersihan & Pengorganisasian (21 Maret 2026)
**Apa yang dilakukan:**
1.  **Media Cleanup**: Menghapus seluruh file gambar (`.png`, `.webp`) dan media sementara di direktori artifak untuk menjaga kebersihan workspace.
2.  **Artifact Indexing**: Membuat file `INDEX.md` sebagai induk navigasi yang menghubungkan seluruh dokumen perencanaan dan teknis dalam satu tempat.
3.  **Role Documentation**: Menyusun `user_roles.md` untuk merinci perbedaan fungsi Super Admin, Admin Keluarga, Editor, dan Viewer.
4.  **Documentation Audit**: Menyelaraskan seluruh artifak (`architecture_overview.md`, `walkthrough.md`, `api_config.md`) ke dalam Bahasa Indonesia dan membersihkan tautan gambar yang terputus.
5.  **Visual Identity Update**: Mengganti logo pohon (ðŸŒ³) dengan emoji keluarga (ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦) di seluruh antarmuka aplikasi (Landing Page, Login, Register, Dashboard, dan Profil) sesuai preferensi pengguna.
6.  **Navigation Enhancement**: Menambahkan link "Tentang Kami" (ke halaman `/about`) di Header dan Footer pada Landing Page untuk meningkatkan aksesibilitas informasi visi-misi.
- [x] Perbaikan Mobile: Scroll mandiri di bottom sheet untuk MemberForm dan CreateFamilyDialog ðŸ“±ðŸ› ï¸
- [x] Perbaikan Mobile: Scroll mandiri di bottom sheet untuk MemberForm dan CreateFamilyDialog ðŸ“±ðŸ› ï¸
- [x] Keamanan & Identitas: Normalisasi email *lowercase* otomatis ðŸ”
- [x] Autentikasi Modern: Aktivasi Google Login dan Implementasi OTP Email (Tanpa Password) ðŸ“§ðŸš€
- [x] Analitik Super Admin (Tab 2): Tracking durasi penggunaan per user, rata-rata bulanan, dan deteksi lokasi Geo-IP ðŸ›¡ï¸ðŸ“Š
- [x] Keamanan Mandiri: Implementasi Auto-Logout cerdas setelah 60 menit tanpa aktivitas ðŸ”âš¡
- [x] UI Cleanup: Menghapus label "(Lansia)" pada pendaftaran Nomor HP di halaman registrasi ðŸ§¹
- [x] Font: Instalasi 7 paket Noto Sans (Javanese, Sundanese, Arabic, SC, TC, Batak, Balinese) ðŸ”¡
7.  **Super Admin Dashboard (Stage 1)**: Mengimplementasikan fitur monitoring pengguna di rute `/admin/users`, penambahan kolom `status` pada database, pelindungan rute dengan middleware & layout, serta integrasi tombol "Panel Admin" pada Dashboard utama bagi pengelola silsilah.

### Sesi 9 â€“ Stabilitas & Sinkronisasi Etnis (13 April 2026)
**Apa yang dibangun:**
1.  **Database-Driven Ethnicities**: Migrasi data etnis dari konstanta kode ke tabel PostgreSQL (`ethnicities`).
2.  **Self-Healing Member Data**: Implementasi logika di `MemberForm` untuk memetakan ID etnis lama ke UUID database secara otomatis.
3.  **Vercel Build Shield**: 
    - Perbaikan Syntax Error (tag JSX duplikat) di `FamilySettingsDialog.tsx`.
    - Perbaikan TypeScript Props (Missing mandatory fields) di 4 komponen utama.
    - Implementasi **Lazy Initialization for Build-time** pada modul `Resend` (mengatasi error Missing API Key saat kompilasi).
4.  **Versioning & Checkpoint**: Pembuatan Git Tag **`v1.1.0-stable`** sebagai titik restorasi sistem yang stabil.
5.  **Documentation Consolidation**: Pembuatan Indeks Utama (`000-INDEX-UTAMA-SISTEM.md`) dengan link absolut untuk navigasi dokumen yang lebih handal.

---

## 32 File Proyek
... (files list) ...
| `src/lib/demo-mode.ts` | Flag deteksi demo mode |
| `src/lib/db/mock-data.ts` | Data dummy (16 anggota) |

### App Routes
| File | Fungsi |
|------|--------|
| `src/app/layout.tsx` | Root layout (metadata, font, PWA) |
| `src/app/page.tsx` | Redirect â†’ dashboard/login |
| `src/app/globals.css` | Design system lengkap |
| `src/app/(auth)/layout.tsx` | Auth layout (centered) |
| `src/app/(auth)/login/page.tsx` | Login (email + Google) |
| `src/app/(auth)/register/page.tsx` | Registrasi |
| `src/app/(main)/layout.tsx` | Main layout + BottomNav |
| `src/app/(main)/dashboard/page.tsx` | Server: fetch families |
| `src/app/(main)/dashboard/DashboardClient.tsx` | Client: kartu + FAB |
| `src/app/(main)/family/[id]/page.tsx` | Server: fetch family |
| `src/app/(main)/family/[id]/FamilyPageClient.tsx` | Client: tree/list/CRUD |
| `src/app/(main)/family/[id]/chat/page.tsx` | Server: fetch chat messages |
| `src/app/(main)/search/page.tsx` | Pencarian global |
| `src/app/(main)/profile/page.tsx` | Profil user |

### API Routes
| File | Fungsi |
|------|--------|
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth handler |
| `src/app/api/auth/register/route.ts` | Register API |
| `src/app/api/chat/pusher-auth/route.ts` | Pusher Auth API |
| `src/app/api/imagekit/auth/route.ts` | ImageKit Auth API |
| `src/app/api/search/route.ts` | Search API |

### Components
| File | Fungsi |
|------|--------|
| `src/components/Providers.tsx` | SessionProvider wrapper |
| `src/components/family/FamilyTree.tsx` | SVG tree visualization |
| `src/components/family/FamilyCard.tsx` | Kartu bagan (ðŸ”’ + âš™ï¸) |
| `src/components/family/MemberForm.tsx` | Form tambah/edit anggota |
| `src/components/family/MemberDetail.tsx` | Detail anggota (bottom sheet) |
| `src/components/family/AddRelationshipDialog.tsx` | Dialog tambah hubungan |
| `src/components/family/CreateFamilyDialog.tsx` | Dialog buat bagan |
| `src/components/ui/BottomNav.tsx` | Navigasi bawah |
| `src/components/ui/Skeleton.tsx` | Skeleton loading |
| `src/components/chat/ChatWindow.tsx` | Chat Container (Pusher logic) |
| `src/components/chat/ChatInput.tsx` | Input chat (multi-line) |
| `src/components/chat/MessageBubble.tsx` | Bubble pesan (isOwn check) |

### Backend
| File | Fungsi |
|------|--------|
| `src/lib/auth.ts` | NextAuth config |
| `src/lib/actions/family.ts` | CRUD bagan |
| `src/lib/actions/member.ts` | CRUD anggota |
| `src/lib/actions/relationship.ts` | Add/remove hubungan |
| `src/lib/db/index.ts` | Koneksi Neon (Lazy Loaded) |
| `src/lib/db/schema.ts` | 6 tabel + relations |
| `src/lib/pusher.ts` | Config Pusher (Lazy Loaded) |
| `src/lib/actions/chat.ts` | Server Actions: Chat CRUD |
| `src/lib/actions/ethnicity.ts` | Server Actions: Get Ethnicities |
| `src/lib/constants/ethnicities.ts` | Master data konstanta etnis |
| `src/scripts/seed-ethnicities.ts` | Script seeding data etnis |
| `src/proxy.ts` | Route protection & Bypass (Convention Next.js 16) |

---

## Cara Memulai

```bash
# 1. Install dependencies
npm install

# 2. Isi .env.local
# DATABASE_URL=postgresql://...
# AUTH_SECRET=...
# AUTH_URL=http://localhost:3000

# 3. Push schema ke database
npx drizzle-kit push

# 4. Jalankan dev server
npm run dev
```

---

## Status Saat Ini

| Phase | Status |
|-------|--------|
| Fase 1 â€“ Fondasi | âœ… Selesai |
| Fase 2 â€“ Dashboard | âœ… Selesai |
| Fase 3 â€“ Pohon & Hubungan | âœ… Selesai |
| Desain Visual UI/UX | âœ… Selesai |
| Fase 4 â€“ Kontrol Akses | âœ… Selesai (Kode Undangan) |
| Fase 5 â€“ PWA & Pemolesan Mobile | ðŸ”œ Belum dimulai |
| Fase 21 â€“ Refinement Navigasi Desktop | âœ… Selesai |
| Fase 22 â€“ Pengaturan Keluarga | âœ… Selesai |
| Fase 23 â€“ Ekspor Data | âœ… Selesai |
| Fase 17 â€“ Organisasi Media | âœ… Selesai |
| Fase 18 â€“ Halaman About | âœ… Selesai |
| Fase 20 â€“ Kode Undangan | âœ… Selesai |
| Fase 24 â€“ Berbagi Publik | âœ… Selesai |
| Fase 25 â€“ Restorasi UI | âœ… Selesai |
| Fase 26 â€“ Sinkronisasi Database Etnis | âœ… Selesai (v1.1.0-stable) |

**Build**: âœ… 11 routes, 0 errors

---

## Dokumentasi Terkait

- [000-INDEX-UTAMA-SISTEM.md](./000-INDEX-UTAMA-SISTEM.md) ðŸ“‘
- [Management-0011-task-tracker.md](./Management-0011-task-tracker.md) ðŸ“‹
- [walkthrough-0022-perbaikan-etnis.md](./walkthrough-0022-perbaikan-etnis.md) ðŸ“–
- [Architecture-0004-arsitektur-teknologi.md](./Architecture-0004-arsitektur-teknologi.md) ðŸ›ï¸
- [Guide-0023-mode-demo-vs-live.md](./Guide-0023-mode-demo-vs-live.md) ðŸŒ
