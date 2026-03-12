# Silsilah Keluarga PWA – Implementation Plan

Aplikasi PWA untuk melacak silsilah keluarga dengan tiga ruang terpisah, kontrol akses ketat, mobile-first, ramah semua generasi.

**Stack**: Next.js 16 + Tailwind CSS v4 + Drizzle ORM + Neon PostgreSQL + NextAuth.js v5

## User Review Required

> [!IMPORTANT]
> **Database**: Isi `DATABASE_URL` di `.env.local` lalu jalankan `npx drizzle-kit push`.

> [!IMPORTANT]
> **Google OAuth** (opsional): Isi `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`. Login email/password tetap berfungsi tanpa ini.

---

## Project Structure (31 files)

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (metadata, font, PWA)
│   ├── page.tsx                      # Redirect → /dashboard atau /login
│   ├── globals.css                   # Design system (warna, tipografi, komponen)
│   ├── (auth)/
│   │   ├── layout.tsx                # Auth layout (centered + gradient)
│   │   ├── login/page.tsx            # Login (email/password + Google)
│   │   └── register/page.tsx         # Registrasi
│   ├── (main)/
│   │   ├── layout.tsx                # Main layout + BottomNav
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Server: fetch user families
│   │   │   └── DashboardClient.tsx   # Client: kartu, FAB, create dialog
│   │   ├── family/[id]/
│   │   │   ├── page.tsx              # Server: fetch family + access check
│   │   │   └── FamilyPageClient.tsx  # Client: tree/list, CRUD, relationships
│   │   ├── search/page.tsx           # Pencarian anggota global
│   │   └── profile/page.tsx          # Profil user + settings
│   └── api/
│       ├── auth/[...nextauth]/route.ts  # NextAuth handler
│       ├── auth/register/route.ts       # Register API
│       └── search/route.ts              # Search API
├── components/
│   ├── Providers.tsx                 # SessionProvider wrapper
│   ├── family/
│   │   ├── FamilyTree.tsx            # SVG tree (zoom/pan/auto-layout)
│   │   ├── FamilyCard.tsx            # Kartu bagan (🔒 + ⚙️ admin)
│   │   ├── MemberForm.tsx            # Form tambah/edit anggota
│   │   ├── MemberDetail.tsx          # Detail anggota (bottom sheet)
│   │   ├── AddRelationshipDialog.tsx # Dialog tambah hubungan
│   │   └── CreateFamilyDialog.tsx    # Dialog buat bagan baru
│   └── ui/
│       ├── BottomNav.tsx             # Navigasi bawah (3 tab)
│       └── Skeleton.tsx              # Skeleton loading
├── lib/
│   ├── auth.ts                       # NextAuth config (Credentials + Google)
│   ├── actions/
│   │   ├── family.ts                 # CRUD bagan keluarga
│   │   ├── member.ts                 # CRUD anggota keluarga
│   │   └── relationship.ts           # Add/remove hubungan
│   └── db/
│       ├── index.ts                  # Koneksi Neon database
│       └── schema.ts                 # 5 tabel + relations + types
└── middleware.ts                     # Route protection
```

---

## Design System (`globals.css`)

| Token | Light | Dark |
|-------|-------|------|
| `--foreground` | `#111827` | `#ffffff` |
| `--background` | `#f8fafc` | `#121212` |
| `--card` | `#ffffff` | `#1e1e1e` |
| `--muted` | `#6b7280` | `#9ca3af` |
| `--male-color` | `#60a5fa` | `#93c5fd` |
| `--female-color` | `#f472b6` | `#f9a8d4` |
| `--radius` | `16px` | `16px` |

**Fitur CSS**: Ripple effect, glassmorphism bottom sheet, skeleton shimmer, context menu, responsive badges, animations.

---

## Phase 4-6 (Planned)

### Phase 4 – Access Control
#### [NEW] `src/app/(main)/family/[id]/access/page.tsx`
- Halaman manajemen akses (admin only)
- Daftar user dengan role dropdown
- Tombol undang via email

### Phase 5 – Mobile Polish & PWA
#### [MODIFY] `src/components/family/FamilyTree.tsx`
- Long-press context menu (edit/hapus)
- Swipe gesture pada bottom sheet

#### [NEW] PWA Configuration
- `next.config.js` – PWA plugin
- `public/manifest.json` – App manifest
- `public/sw.js` – Service worker

#### [NEW] Mode "Mudah" (Senior)
- Toggle di profile → font +4px, border tebal

### Phase 6 – Deployment
- Deploy ke Vercel (otomatis dari repo)
- Konfigurasi Neon production database

---

## Verification Plan

### Build Test
```bash
npm run build    # ✅ 11 routes, 0 errors (terakhir berhasil)
```

### Manual Verification
1. Isi `.env.local` → `npx drizzle-kit push` → `npm run dev`
2. Register akun → Login → Buat bagan → Tambah anggota
3. Test pohon keluarga (zoom/pan) + mode daftar
4. Test pencarian + profil
5. Deploy ke Vercel staging → test di HP
