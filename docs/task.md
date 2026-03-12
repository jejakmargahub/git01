# Silsilah Keluarga PWA – Task Checklist

## Phase 1 – Foundation ✅
- [x] Initialize Next.js project (App Router + Tailwind CSS + TypeScript)
- [x] Configure Drizzle ORM + Neon PostgreSQL connection
- [x] Define database schema (5 tabel: users, families, family_members, relationships, family_access)
- [ ] Run database migration (`npx drizzle-kit push` – requires `DATABASE_URL`)
- [x] NextAuth.js authentication (Credentials + Google)
- [x] Login page (`/login`)
- [x] Register page (`/register`) + API endpoint
- [x] Middleware untuk proteksi rute
- [x] Root layout (metadata, viewport, theme-color PWA)
- [x] Providers wrapper (SessionProvider)

## Phase 2 – Dashboard & Member Management ✅
- [x] Bottom navigation (Beranda, Cari, Profil) – ikon + label
- [x] Dashboard page – kartu bagan keluarga
- [x] Create family dialog (bottom sheet)
- [x] Family detail page (`/family/[id]`) – server + client component
- [x] Tree/List toggle view
- [x] CRUD anggota keluarga (server actions)
- [x] MemberForm (bottom sheet: nama, panggilan, gender, title, tanggal, HP, bio)
- [x] MemberDetail (bottom sheet: info lengkap + hubungan + edit/hapus)
- [x] FamilyCard (nama, anggota, role badge, 🔒 privat, ⚙️ admin)

## Phase 3 – Relationships & Tree Visualization ✅
- [x] Relationship server actions (add/remove bidirectional)
- [x] AddRelationshipDialog (parent/child/spouse radio)
- [x] Custom SVG tree visualization (zoom/pan/auto-layout)
- [x] Node rendering (♂/♀, nickname, title, deceased Alm./Almh. 🌼, 📱)
- [x] Zoom buttons (+/−) manual

## UI/UX Visual Design ✅
- [x] Palet warna pastel (biru muda/pink, emas admin)
- [x] Teks kontras tinggi (#111827 light, #ffffff dark) – WCAG AA
- [x] Dark mode (#121212 background, #1e1e1e card)
- [x] Glassmorphism bottom sheet (backdrop-blur)
- [x] Ripple effect + press feedback pada tombol & kartu
- [x] Card radius 16px, shadow lembut
- [x] Font: body 16px, label 16px, heading 18-24px
- [x] Touch target ≥48dp (tombol, input, node 180×90)
- [x] Bottom nav 68px, label 12px
- [x] Badge admin emas, editor hijau, viewer abu
- [x] Skeleton loading CSS (shimmer animation)
- [x] Context menu CSS ready
- [x] Skeleton component (`Skeleton.tsx`)

## Fitur Pendukung ✅
- [x] Search page + API (`/search`, `/api/search`)
- [x] Profile page (`/profile`) – info user, settings placeholder, logout

## Phase 4 – Access Control & Invitations
- [ ] Access management page (admin only)
- [ ] Invite users via email
- [ ] Role-based access validation di semua actions

## Phase 5 – Mobile Polish & PWA
- [ ] Swipe-to-close bottom sheet (gesture JS)
- [ ] Long-press context menu pada node (touch events)
- [ ] Mode "Mudah" toggle (font besar untuk senior)
- [ ] PWA setup (service worker, manifest, offline)
- [ ] Cross-device testing

## Phase 6 – Deployment
- [ ] Deploy ke Vercel + Neon
- [ ] User testing dan feedback
