# Silsilah Keluarga PWA – Project Log

> **Conversation ID**: `a7f5de84-003f-4c68-93a8-ba1f4b92355e`
> **Terakhir diperbarui**: 13 Maret 2026, 00:53 WIB

---

## Ringkasan Proyek

Aplikasi web Progressive Web App (PWA) untuk melacak silsilah keluarga dengan **tiga ruang terpisah**:
1. **Siauw Sak Po** – Khusus keluarga inti (garis keturunan langsung)
2. **Keluarga Lain (Umum)** – Untuk keluarga lain yang ingin membuat silsilah sendiri
3. **Perkumpulan Marga Siauw** – Khusus anggota marga Siauw terverifikasi

**Stack**: Next.js 16 · Tailwind CSS v4 · Drizzle ORM · Neon PostgreSQL · NextAuth.js v5

---

## Kronologi Pengembangan

### Sesi 1 – Foundation + Dashboard + Tree (Phase 1-3)

**Apa yang dibangun:**
1. Project initialization (Next.js + Tailwind + TypeScript)
2. Database schema: 5 tabel (users, families, family_members, relationships, family_access)
3. Authentication: NextAuth.js (Credentials + Google), register API, middleware
4. Dashboard: kartu bagan keluarga, FAB, create dialog
5. Family page: toggle pohon/daftar, CRUD anggota, hubungan keluarga
6. Pohon keluarga: custom SVG, zoom/pan, auto-layout, node kustom
7. Search page + API (cari anggota di semua bagan)
8. Profile page (info user, settings, logout)

### Sesi 3 – Demo Mode & Responsiveness
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

---

## 32 File Proyek
... (files list) ...
| `src/lib/demo-mode.ts` | Flag deteksi demo mode |
| `src/lib/db/mock-data.ts` | Data dummy (16 anggota) |

### App Routes
| File | Fungsi |
|------|--------|
| `src/app/layout.tsx` | Root layout (metadata, font, PWA) |
| `src/app/page.tsx` | Redirect → dashboard/login |
| `src/app/globals.css` | Design system lengkap |
| `src/app/(auth)/layout.tsx` | Auth layout (centered) |
| `src/app/(auth)/login/page.tsx` | Login (email + Google) |
| `src/app/(auth)/register/page.tsx` | Registrasi |
| `src/app/(main)/layout.tsx` | Main layout + BottomNav |
| `src/app/(main)/dashboard/page.tsx` | Server: fetch families |
| `src/app/(main)/dashboard/DashboardClient.tsx` | Client: kartu + FAB |
| `src/app/(main)/family/[id]/page.tsx` | Server: fetch family |
| `src/app/(main)/family/[id]/FamilyPageClient.tsx` | Client: tree/list/CRUD |
| `src/app/(main)/search/page.tsx` | Pencarian global |
| `src/app/(main)/profile/page.tsx` | Profil user |

### API Routes
| File | Fungsi |
|------|--------|
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth handler |
| `src/app/api/auth/register/route.ts` | Register API |
| `src/app/api/search/route.ts` | Search API |

### Components
| File | Fungsi |
|------|--------|
| `src/components/Providers.tsx` | SessionProvider wrapper |
| `src/components/family/FamilyTree.tsx` | SVG tree visualization |
| `src/components/family/FamilyCard.tsx` | Kartu bagan (🔒 + ⚙️) |
| `src/components/family/MemberForm.tsx` | Form tambah/edit anggota |
| `src/components/family/MemberDetail.tsx` | Detail anggota (bottom sheet) |
| `src/components/family/AddRelationshipDialog.tsx` | Dialog tambah hubungan |
| `src/components/family/CreateFamilyDialog.tsx` | Dialog buat bagan |
| `src/components/ui/BottomNav.tsx` | Navigasi bawah |
| `src/components/ui/Skeleton.tsx` | Skeleton loading |

### Backend
| File | Fungsi |
|------|--------|
| `src/lib/auth.ts` | NextAuth config |
| `src/lib/actions/family.ts` | CRUD bagan |
| `src/lib/actions/member.ts` | CRUD anggota |
| `src/lib/actions/relationship.ts` | Add/remove hubungan |
| `src/lib/db/index.ts` | Koneksi Neon |
| `src/lib/db/schema.ts` | 5 tabel + relations |
| `src/middleware.ts` | Route protection |

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
| Phase 1 – Foundation | ✅ Selesai |
| Phase 2 – Dashboard | ✅ Selesai |
| Phase 3 – Tree & Relationships | ✅ Selesai |
| UI/UX Visual Design | ✅ Selesai |
| Phase 4 – Access Control | 🔜 Belum dimulai |
| Phase 5 – PWA & Mobile Polish | 🔜 Belum dimulai |
| Phase 6 – Deployment | 🔜 Belum dimulai |

**Build**: ✅ 11 routes, 0 errors

---

## Dokumentasi Terkait

- [task.md](./task.md) – Checklist per phase
- [implementation_plan.md](./implementation_plan.md) – Arsitektur & rencana
- [walkthrough.md](./walkthrough.md) – Ringkasan fitur & design system
