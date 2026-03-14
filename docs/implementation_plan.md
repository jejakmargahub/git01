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

- Konfigurasi Neon production database

### Phase 8 – Landing Page & Access
#### [MODIFY] `src/app/page.tsx` [NEW UI]
- Ganti redirect otomatis dengan halaman Landing Page premium.
- Hero Section: Judul "Jejak Marga", Slogan, dan Visual (Pohon/Keluarga).
- Deskripsi singkat fitur: Silsilah Aman, Akses HP/Email, Kode Undangan.
- Call to Action (CTA): Tombol "Masuk ke Sistem" (Login).
- Footer sederhana dengan informasi domain `jejakmarga.my.id`.

#### [MODIFY] `src/app/(auth)/login/page.tsx`
- Pastikan alur user-friendly sesuai permintaan "skip registrasi" (lebih menonjolkan login).

### Phase 9 – Interactive Edit Mode (Visual Tree Builder)
Fitur untuk membangun silsilah secara visual dengan mengklik panah (Atas/Bawah/Kiri/Kanan) di sekitar node anggota keluarga.

#### [MODIFY] `src/app/(main)/family/[id]/FamilyPageClient.tsx`
- Tambahkan state `isEditMode` (boolean) dan `selectedNodeId` (string | null).
- Tambahkan tombol toggle "Mode Edit ✏️" di header halaman (hanya muncul jika user adalah admin/editor).
- Berikan state pembantu `quickAddContext` untuk mendikte formulir `MemberForm` saat terbuka (menyimpan `{ sourceMemberId, relationType }`).

#### [MODIFY] `src/components/family/FamilyTree.tsx`
- Terima prop baru: `isEditMode`, `selectedNodeId`, `onSelectNode`, dan `onQuickAdd(sourceId, type)`.
- `EditArrows` berisi 4 panah SVG (Atas: Ibu/Ayah, Bawah: Anak, Kiri: Saudara, Kanan: Pasangan) yang melingkari koordinat `x, y` dari node aktif.
- **Label & UX**: Menambahkan label teks di samping setiap panah dan memperbaiki sistem koordinat SVG menggunakan `viewBox` untuk mencegah elemen terpotong.
- **[NEW] UI Refinement**:
    - Perbarui format nama menjadi: `"${fullName}, ${mandarinName}"`.
    - Gunakan `<foreignObject>` untuk area teks nama guna mendukung *wrapping* otomatis yang rapi.
    - Pindahkan teks umur ke pojok kanan atas node dengan gaya visual yang lebih bersih.
- Klik pada salah satu panah akan memicu callback `onQuickAdd`.

#### [MODIFY] `src/components/family/MemberForm.tsx` & Data Flow
- Sesuaikan agar form bisa menerima prop `quickAddContext`.
- Jika `quickAddContext` berjenis `child`, setelah fungsi aksi tabel `family_members` berhasil dibuat, jalankan aksi tabel `relationships` secara otomatis untuk membuat relasi parent-child. Lakukan hal yang sama untuk `spouse` dan `parent`. (Untuk `sibling`, hubungkan secara otomatis ke ayah/ibu dari `sourceMember`).

### Phase 10 – External Media Storage (ImageKit.io) ✅
**Status: Selesai**  
Mengalihkan penyimpanan foto dari lokal ke cloud menggunakan SDK `@imagekit/next` untuk persistensi dan optimasi otomatis.

#### [NEW] `src/app/api/imagekit/auth/route.ts`
- Implementasi endpoint autentikasi server-side untuk mengizinkan unggahan dari client.

#### [MODIFY] `src/components/family/MemberForm.tsx` & `src/lib/imagekit.ts`
- Implementasi unggah langsung ke cloud dengan loading status.
- Centralized utility untuk optimasi URL.

#### [MODIFY] `src/components/family/FamilyTree.tsx` & `MemberDetail.tsx`
- Rendering avatar di SVG dan foto detail dengan transform ImageKit.

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

---

# Mengaktifkan Opsi Login dengan Nomor HP & PIN 4 Angka

Sistem otentikasi saat ini hanya mendukung pendaftaran menggunakan Email dan Password panjang. Pengguna meminta penambahan opsi login menggunakan Nomor HP dan Sandi/PIN sederhana 4 digit untuk memudahkan akses bagi generasi senior, berdampingan dengan opsi Email.

## Proposed Changes

### Database Schema
Akan ada penyesuaian pada tabel `users` untuk mendukung Nomor HP:

#### [MODIFY] `src/lib/db/schema.ts`
- Tambahkan kolom `phoneNumber: varchar("phone_number", { length: 20 }).unique()` pada tabel `users`.
- Ubah tipe kolom `email` agar tidak lagi `notNull()` secara mutlak, melainkan *nullable* (karena jika user mendaftar strictly dengan no HP, mereka tidak punya email).

#### [MODIFY] `src/lib/db/mock-data.ts`
- Tambahkan properti `phoneNumber: null` atau nilai dummy pada profil `DEMO_USER` di bagian atas file.

---

### Backend Authentication API

#### [MODIFY] `src/app/api/auth/register/route.ts`
- Ubah struktur penerimaan data untuk mendeteksi mode: `email` atau `phoneNumber`.
- Jika memakai mode `phoneNumber`, lakukan validasi agar `password` (PIN) panjangnya tepat 4 karakter angka.
- Hilangkan validasi "Password minimal 6 karakter" jika route mendeteksi bahwa user sedang mengirimkan `phoneNumber` sebagai *identifier*.
- Lakukan DB Check untuk memastikan `phoneNumber` atau `email` belum terpakai sebelumnya.

#### [MODIFY] `src/lib/auth.ts`
- Modifikasi blok konfigurasi `Credentials` di dalam NextAuth.
- Terima field payload gabungan `identifier` (bisa Email/Phone) dan `password` (bisa Teks/PIN).
- Gunakan logika OR pada Drizzle saat mencari data user (`eq(users.email, identifier)` / `eq(users.phoneNumber, identifier)`).
- Biarkan *bcrypt* bekerja seperti biasa untuk mencocokkan hash password/PIN.

---

### Frontend UI (Tampilan Aplikasi)

#### [MODIFY] `src/app/(auth)/register/page.tsx`
- Rancang dua opsi tab di atas form: "Dengan Email" & "Dengan Nomor HP".
- Mode HP:
  - Input field ke-1: Nomor Handphone (`type="tel"`).
  - Input field ke-2: PIN 4 Angka (`type="password"`, `maxLength={4}`, `pattern="\d*"`).
  - Teks petunjuk dan placeholder disederhanakan.
- Arahkan fungsi `handleSubmit` untuk mengirim payload JSON yang dinamis ke backend sesuai *tab* aktif.

#### [MODIFY] `src/app/(auth)/login/page.tsx`
- Gabungkan label form menjadi "Email atau Nomor HP".
- Ubah `type="email"` pada `<input>` menjadi `type="text"` agar bisa menerima ketikan nomor.
- Ubah pesan placeholder dari `"nama@email.com"` menjadi `"Email Anda / No. Handphone"`.
- Sesuaikan validasi blokir HTML5 agar tidak memaksa input format email saat user mengetikkan nomor HP.
- Kirim data ke NextAuth `signIn("credentials", ...)` dengan parsing yang benar.

## Verification Plan

### Automated / Browser Verifications
- Buka terminal Next.js dan pastikan kompilasi Typescript tidak *error* usai perubahan Schema.

### Skenario Test Subagent / Manual
1. **Daftar HP**: Buka `/register`, pindah ke tab "Sandi 4 Angka", buat akun dengan no HP `0811223344` dan PIN `1234`. Berhasil?
2. **Login HP**: Buka `/login`, masukkan identitas `0811223344` dan sandi `1234`. Pastikan bisa menembus halaman Dashboard.
3. **Login Email**: Uji login kembali akun `.gemini@email.com` lama untuk garansi bahwa skema email lawas tidak rusak.
4. **Validasi Error**: Coba salahkan PIN (misal `1233`), pastikan tertolak dengan error "Identitas / Sandi Salah".

---

# Mengizinkan Foto Anggota (Opsional & Dibatasi)

Pengguna meminta perbaikan rencana: foto anggota *diperbolehkan* tapi bersifat spesifik opsional dengan batasan ukuran file yang ketat untuk menghemat kapasitas penyimpanan.

## Proposed Changes

### Database Schema
Kita perlu menyimpan referensi path/URL dari foto ke dalam database.

#### [MODIFY] `src/lib/db/schema.ts`
- Tambahkan kolom `photoUrl: varchar("photo_url", { length: 500 })` ke tabel `familyMembers`.

#### [MODIFY] `src/lib/db/mock-data.ts`
- Sesuaikan skema `family_members` dummy dengan menambahkan properti `photoUrl: null`.

---

### Backend API (Image Upload)
Karena kita menghindari setup *cloud storage* (S3/Cloudinary) di fase MVP PWA ini demi kemudahan *self-hosting*, file akan disimpan secara lokal di Next.js `public/uploads` directory.

#### [NEW] `src/app/api/upload/route.ts`
- Buat API endpoint `POST` untuk menerima data form `multipart/form-data`.
- Lakukan validasi ukuran di sisi server: **Maksimal 2MB**.
- Lakukan validasi tipe file: Hanya `image/jpeg`, `image/png`, `image/webp`.
- Hasilkan nama file unik (UUID + *timestamp*) untuk mencegah *collision*.
- Simpan file ke direktori `/public/uploads/members/` (dan buat foldernya jika belum ada).
- Kembalikan path URL file (`/uploads/members/filename.jpg`) ke *client*.

#### [MODIFY] `src/lib/actions/member.ts`
- Perbarui *server actions* (`createMember`, `updateMember`) untuk menerima field opsional `photoUrl` dan menyimpannya ke database.

---

### Frontend UI (Tampilan Aplikasi)

#### [MODIFY] `src/app/globals.css`
- Tambahkan class CSS untuk menampilkan *Image Preview* bundar.

#### [MODIFY] `src/components/family/MemberForm.tsx`
- Tambahkan input `type="file" accept="image/jpeg, image/png, image/webp"`.
- Implementasi kompresi gambar standar via kanvas (Client-side) *sebelum* dikirim ke server jika ukuran file asli > 1MB, memastikan pengunggahan menjadi super ringan.
- Tampilkan UI *preview* foto berbentuk bulat jika foto sudah dipilih.
- Saat Form dikirim, jika ada file baru terpilih, unggah dulu via `fetch('/api/upload')`, dapatkan *URL*-nya, lalu teruskan URL tersebut ke *server action*.

#### [MODIFY] `src/components/family/FamilyTree.tsx`
- Jika `mandarinName` dan `photoUrl` tersedia, tampilkan foto potret bulat kecil (ukuran ~40x40px) di sisi kiri teks Node `RenderNode`.
- Tahan tinggi Node di 100px.

#### [MODIFY] `src/components/family/MemberDetail.tsx`
- Tambahkan elemen `<img />` bulat tebal (misal 120x120px) di bagian Header *bottom sheet* (di atas grid teks) jika `photoUrl` terisi.

## Verification Plan

### Manual Verification
1. Tambah anggota klik `<input type="file">`.
2. Masukkan foto JPEG selebriti atau dummy berukuran 3MB.
3. Pastikan fungsi kompresi client-side mereduksi foto ke bawah 500KB sebelum *upload*.
4. Periksa folder `public/uploads/members/` untuk menjamin file fisik terekam.
5. Verifikasi bahwa gambar muncul dengan rapi di Node Pohon dan Header Detail Panel tanpa memecah margin.

---

# Berbagi Akses via Kode Undangan (Domain: jejakmarga.my.id)

Untuk memudahkan kolaborasi keluarga, kita akan menambahkan fitur Kode Undangan (Invite Code) atau tautan berbagi (*share link*) spesifik menggunakan domain resmi `jejakmarga.my.id`. Pengguna yang memiliki tautan/kode ini bisa langsung bergabung sebagai kolaborator (*editor*) ke dalam pohon keluarga yang dituju.

## Proposed Changes

### Database Schema
Kita perlu menyimpan kode rujukan sandi unik per bagan keluarga.

#### [MODIFY] `src/lib/db/schema.ts`
- Tambahkan kolom `inviteCode: varchar("invite_code", { length: 50 }).unique()` pada tabel `families`. Ini akan menyimpan kode rujukan yang bisa diatur ulang (reset) jika kode tersebut bocor.

#### [MODIFY] `src/lib/db/mock-data.ts`
- Tambahkan `inviteCode: "DEMO-1234"` ke dalam skema mock data untuk `families`.

---

### Backend Logic

#### [MODIFY] `src/lib/actions/family.ts`
- **`generateInviteCode(familyId)`**: Fungsi server khusus *Admin* untuk membuat/me-reset kode undangan (menggunakan algoritma string acak atau `nanoid`).
- **`joinFamily(inviteCode)`**: Fungsi server untuk mencari *family* berdasarkan kode tsb, lalu menambahkan ID pengguna yang sedang login ke tabel `familyAccess` dengan hak akses `editor` (atau role lain yang ditentukan).

---

### Frontend UI (Tampilan Aplikasi)

#### [NEW] `src/app/(main)/invite/[code]/page.tsx`
- Buat halaman *landing page* penerimaan undangan (contoh URL: `https://jejakmarga.my.id/invite/ABC-123`).
- Jika user belum *login*, halaman ini hanya menampilkan nama Bagan Keluarga dan tombol "Masuk / Daftar untuk Bergabung".
- Jika user sudah *login*, tampilkan tombol "Gabung Sekarang".
- Aksi "Gabung" akan memicu fungsi `joinFamily(code)` dan melempar (*redirect*) pengguna langsung ke `/family/[id]`.

#### [MODIFY] `src/components/family/FamilyCard.tsx` atau `DashboardClient.tsx`
- Tambahkan tombol/ikon 🔗 **"Bagikan"** atau **"Undang"** pada kontrol bagan keluarga (hanya terlihat bagi `admin`).
- Saat diklik, munculkan *dialog modal* yang memamerkan kode undangan & tautan lengkap (`jejakmarga.my.id/invite/...`) lengkap dengan tombol **"Salin Tautan"**.
- Tersedia opsi "Generate Ulang Kode" untuk mematikan tautan lama.

#### [MODIFY] `src/app/(main)/dashboard/DashboardClient.tsx`
- Tambahkan aksi sekunder di halaman *Dashboard* berbunyi: **"Gabung Bagan via Kode"**.
- Menampilkan *prompt* input sederhana agar *user* bisa menekan "Gabung" tanpa harus mengklik tautan URL asalkan memiliki kodenya.

## Verification Plan

### Manual Verification
1. Login sebagai Admin bagan, klik tombol "Bagikan".
2. Di dalam *dialog*, periksa URL *invite link* menyertakan `jejakmarga.my.id/invite/CODE`.
3. Salin tautan dan buka di *browser* samaran (*Incognito*).
4. Buat/Daftar akun percobaan.
5. Tempel tautan *invite* tadi, lalu tekan "Gabung".
6. Periksa di Dashboard akun baru apakah bagan keluarga tersebut sudah muncul, dan pastikan akun tersebut bisa mengedit silisilah keluarga.
### Phase 11 – Family Chat (New) 💬
Fitur chat real-time yang dibatasi (*scoped*) per bagan keluarga untuk koordinasi dan berbagi kenangan.

#### [MODIFY] `src/lib/db/schema.ts`
- Tambahkan tabel `messages`:
  - `id`: uuid (PK)
  - `familyId`: uuid (FK -> families)
  - `senderId`: uuid (FK -> users)
  - `content`: text
  - `isRead`: boolean
  - `createdAt`: timestamp

#### [NEW] Real-time Engine (Pusher)
- Setup akun Pusher (Free Tier).
- `src/lib/pusher.ts`: Konfigurasi Pusher client & server.
- `src/app/api/chat/pusher-auth/route.ts`: Endpoint untuk autentikasi private channel `family-${id}`.

#### [NEW] Server Actions (`src/lib/actions/chat.ts`)
- **`sendMessage(familyId, content)`**: Validasi akses user -> Simpan ke DB -> Trigger Pusher event.
- **`getMessages(familyId)`**: Fetch riwayat chat (limit 50).

#### [MODIFY] Frontend UI
- **`src/components/family/FamilyCard.tsx`**: Tambahkan ikon 💬 dengan badge notifikasi merah jika ada pesan baru.
- **`src/app/(main)/family/[id]/chat/page.tsx`**: Halaman chat utama.
- **`src/components/chat/ChatWindow.tsx`**: Container chat dengan auto-scroll.
- **`src/components/chat/ChatInput.tsx`**: Input field dengan pengiriman via Enter/Tombol.
- **`src/components/chat/MessageBubble.tsx`**: Menampilkan nama pengirim, konten, dan waktu.

#### [NEW] User Identity
- Di dalam chat, tampilkan **Nama Lengkap** dan **Foto Profil** (via ImageKit). 
- *Catatan*: No HP tidak ditampilkan langsung demi privasi, namun bisa diakses via Member Profile.

---

## Verification Plan

### Build Test
```bash
npm run build
```

### Manual Verification
1. Login dengan Akun A & B yang memiliki akses ke keluarga yang sama.
2. Akun A kirim pesan di chat.
3. Akun B harus melihat pesan muncul secara instan tanpa refresh.
4. Cek akses: Akun C (yang tidak punya akses keluarga) tidak boleh bisa masuk ke URL chat tersebut.
5. Verifikasi riwayat chat tetap ada setelah logout/login kembali.
