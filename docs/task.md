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
- [x] Node rendering (♂/♀, nickname + full name, title, deceased Alm./Almh. 🌼, 📱, umur)
- [x] Zoom buttons (+/−) manual & scroll wheel zoom
- [x] Auto-fit bounds calculation (perbaikan tampilan terpotong di laptop & HP)
- [x] Multi-touch pinch-to-zoom support (khusus mobile/tablet)
- [x] Dukungan input dan tampilan karakter Mandarin (Hanzi) pada pohon dan rincian anggota

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
- [x] Privasi Data: Input dan Tampilan Tanggal Lahir/Meninggal hanya "Bulan & Tahun"
- [ ] PWA setup (service worker, manifest, offline)
- [ ] Cross-device testing

## Phase 6 – Deployment
- [ ] Deploy ke Vercel + Neon
- [ ] User testing dan feedback

## Phase 7 – Advanced Enhancements (Next Iteration)
- [x] Opsi registrasi dan login dengan Nomor HP (Sandi PIN 4 Angka)
- [x] Fitur unggah foto muka anggota (opsional, maks 2MB, kompresi client-side)
- [x] Berbagi Akses Bagan via URL Kode Undangan (domain jejakmarga.my.id)

## Phase 8 – Landing Page & Access ✅
- [x] Design and implement Landing Page (`/`)
- [x] Connect Landing Page to System Access (Login)
- [x] Review and refine registration flow (skip prompt)

## Phase 9 – Interactive Edit Mode (Visual Tree Builder) ✅
- [x] Tambahkan toggle "Edit Mode" di halaman pohon keluarga
- [x] Modifikasi `FamilyTree.tsx` para melacak `selectedNodeId` khusus mode edit
- [x] Buat komponen `EditArrows` berlapis SVG (Atas: Ibu/Ayah, Bawah: Anak, Kiri: Saudara, Kanan: Pasangan)
- [x] Hubungkan setiap klik panah memanggil dialog form dengan state (relasi/gender default)
- [x] Uji penyimpanan dan rendering real-time relasi anak, pasangan, saudara, dan orang tua
- [x] Tambahkan label teks deskriptif di samping panah interaktif untuk memperjelas fungsi (Atas: Orang Tua, Bawah: Anak, Kiri: Saudara, Kanan: Pasangan)
- [x] Refactor `RenderNode` di `FamilyTree.tsx`:
    - [x] Format nama: "Nama Lengkap, Nama Mandarin"
    - [x] Implementasi text wrapping agar rapi
    - [x] Pindahkan tampilan umur ke pojok kanan atas node
- [x] Perbaikan Clipping & Overlap:
    - [x] Perbesar ukuran node (280x150) & margin (180x150)
    - [x] Pastikan nama panjang "Alm. Ahim Siauw Him Cong" tidak terpotong (XHTML Wrapping)
    - [x] Hilangkan tumpang tindih antar node pasangan (Gap 60px)
    - [x] Perbaiki perataan vertikal (orang tua tepat di atas anak)

## Phase 10 – External Media Storage (ImageKit.io) ✅
- [x] Buat API Route autentikasi ImageKit di `/api/imagekit/auth`
- [x] Konfigurasi variabel lingkungan (Public Key, Private Key, Endpoint)
- [x] Perbarui `MemberForm.tsx` untuk menggunakan unggah langsung ke cloud
- [x] Optimasi rendering foto dengan ImageKit URL transformations di pohon dan rincian anggota
- [x] Bersihkan API upload lokal lama (`/api/upload`)
- [ ] Perbaikan Bug Build Vercel (ImageKit Initialization)
- [x] Verifikasi Akhir di Live Site (Pohon Marga Siauw Sak Po)

## Phase 11 – Family Chat (New) 💬
- [x] Update database schema (tabel `messages`)
- [x] Setup Pusher untuk real-time communication
- [x] Buat API Route untuk autentikasi Pusher
- [x] Implementasi Server Actions `sendMessage` & `getMessages`
- [x] Modifikasi `FamilyCard.tsx` (tambahkan ikon chat & badge notifikasi)
- [x] Buat halaman Chat (`/family/[id]/chat`)
- [x] UI Komponen: `ChatInput`, `MessageBubble`, `ChatWindow`
- [x] Keamanan: Scoped access check (hanya anggota keluarga)
- [x] Verifikasi real-time readiness (lazy loading hooks)
- [x] **Fitur Tambahan Pengujian**: Prompt Nama Tamu (untuk identifikasi saat testing bypass)
