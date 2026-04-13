# Jejak Marga â€“ Arsitektur Sistem & Dokumentasi Teknis

Dokumen ini menjelaskan struktur data, alur kerja, dan konsep teknis di balik sistem manajemen pohon keluarga Jejak Marga.

## ðŸ“Š Struktur Database (Relational Schema)

Sistem menggunakan PostgreSQL dengan Drizzle ORM. Berikut adalah tabel inti:

### 1. `families` (Induk Bagan)
Menyimpan metadata untuk setiap pohon keluarga.
- `inviteCode`: Kode unik otomasi (format: `JM-XXXXX`) untuk berbagi akses editor. Tampil di Dashboard Admin.
- `isPublicViewEnabled`: Boolean untuk mengaktifkan/menonaktifkan link publik.
- `publicViewSlug`: String unik (slug) untuk URL publik tanpa login.
- `isPublic`: Boolean untuk visibilitas di halaman pencarian global.

### 2. `family_members` (Node Anggota)
Menyimpan data individu dalam pohon.
- `id`: UUID (Primary Key)
- `familyId`: Relasi ke tabel `families`.
- `fullName`, `nickname`, `mandarinName`: Data identitas.
- `gender`: 'M' (Laki-laki) atau 'F' (Perempuan).
- `photoUrl`: Link foto profil (ImageKit.io). Disimpan dalam folder `/members/${familyId}/` untuk organisasi yang rapi.

### 3. `relationships` (Tepi/Koneksi)
Menghubungkan dua anggota keluarga.
- `fromMemberId`, `toMemberId`: ID anggota yang terhubung.
- `relationType`: 
    - `parent`: `from` adalah orang tua dari `to`.
    - `spouse`: `from` adalah pasangan dari `to`.
    - `child`: (Representasi internal via `parent` agar arah gravitasi data tetap satu jalur).

### 4. `user_sessions` (Analitik & Keamanan)
Menyimpan data aktivitas pengguna untuk monitoring admin.
- `startTime`, `lastPing`: Digunakan untuk menghitung durasi penggunaan aplikasi.
- `duration`: Akumulasi waktu aktif dalam detik.
- `ipAddress`, `location`: Deteksi lokasi geografis (Kota, Negara) saat login.
- `userAgent`: Informasi browser/perangkat yang digunakan.

---

## ðŸŒ³ Logika Visualisasi & Fragmentasi

Sistem silsilah Jejak Marga dirancang untuk menangani data yang tidak sempurna atau belum lengkap. Berikut adalah logika di balik tampilan visualnya:

### 1. Deteksi Akar (Root Detection)
Sistem memindai seluruh anggota keluarga dan mencari siapa saja yang **tidak memiliki data Orang Tua** di tabel `relationships`. Anggota-anggota ini dianggap sebagai "Akar" (titik awal garis keturunan).

### 2. Klaster Utama vs. Fragmen (Sisi Kiri vs. Kanan)
- **Klaster Utama (Kiri)**: Jika sebuah "Akar" memiliki banyak keturunan dan pasangan yang saling terhubung, sistem akan menggambarkannya sebagai satu pohon besar yang kompleks. 
- **Fragmen (Kanan)**: Jika seorang anggota ditambahkan tanpa relasi orang tua, atau relasinya terputus dari klaster utama, sistem akan menampilkannya sebagai "Fragmen" mandiri di sisi kanan. Hal ini dilakukan agar **tidak ada data yang hilang** secara visual meskipun hubungan kekeluargaannya belum didefinisikan secara lengkap.

### 3. Penyatuan Pohon
Fragmen di sisi kanan dapat disatukan ke Pohon Utama di sisi kiri dengan cara menambahkan relasi `parent` atau `spouse` yang valid melalui antarmuka "Mode Edit".

---

## ðŸ”„ Alur Data (Data Flow)

1.  **Input**: Pengguna mengisi `MemberForm`. Server Action `createMember` menyimpan data ke `family_members`.
2.  **Relasi**: Jika ditambahkan via *Quick Add*, sistem otomatis membuat entri di tabel `relationships`.
3.  **Fetch**: Komponen `FamilyPageClient` mengambil semua anggota dan relasi dalam satu bagan.
4.  **Algoritma Pohon (`buildTree`)**:
    - Mencari "Akar" (anggota tanpa orang tua).
    - Melakukan traversal rekursif ke bawah (anak).
    - Menghubungkan pasangan (spouses) secara menyamping.
5.  **Rendering**: Komponen `FamilyTree.tsx` menggunakan koordinat dari algoritma untuk menggambar SVG secara dinamis.

---

## ðŸ“„ Halaman Konten & SEO

### 1. About Us (`/about`)
Halaman bercerita (storytelling) dengan visual premium menggunakan `framer-motion`. Fokus pada Visi & Misi "Merajut Nusantara" serta kebhinekaan bahasa daerah di Indonesia.

### 2. Blog (Planned)
Sistem artikel multi-bahasa dengan tabel `blog_posts` untuk mendukung SEO dan edukasi silsilah keluarga secara luas di Nusantara.
### 3. Public View (`/public/[slug]`)
Halaman khusus untuk keluarga besar atau publik yang ingin melihat pohon tanpa perlu registrasi/login.
- **Privacy Masking**: Server secara otomatis menghapus (nullify) data `phone` dan `bio` sebelum dikirim ke client.
- **Read-Only**: Semua fungsi edit dan chat dinonaktifkan di rute ini.
- **Custom URL**: Admin dapat mengganti (regenerate) slug URL kapan saja untuk keamanan.
- **QR Code (Planned)**: Generator kode QR untuk akses instan ke halaman publik di acara keluarga.

---

## ðŸ” Sistem Autentikasi & Keamanan

Sistem mendukung tiga jalur masuk utama untuk fleksibilitas keluarga:

### 1. Identitas Berbasis Telepon (Phone-Login)
Menggunakan Nomor HP dan PIN 4-digit. Cocok untuk area dengan sinyal internet terbatas atau pengguna yang tidak terbiasa dengan email.

### 2. Login Tanpa Password (Email OTP)
Menggunakan library **Resend** untuk mengirimkan kode verifikasi 4-digit ke email. 
- Alur: Email Input -> Generate Token (10 menit expire) -> Simpan di `verification_tokens` -> Kirim Email -> Verifikasi & Login.

### 3. Google OAuth
Login instan menggunakan akun Google. Sistem menyelaraskan identitas dengan mengubah email menjadi *lowercase* dan melakukan pengecekan status (aktif/nonaktif) oleh Super Admin sebelum memberikan akses.

### 4. Aktivitas & Auto-Logout (Keamanan Cerdas)
Untuk melindungi data silsilah, sistem memantau aktivitas pengguna (*mouse, keyboard, scroll, touch*).
- **Inactivity Timeout**: Jika tidak ada aktivitas selama **60 menit**, aplikasi akan secara otomatis memicu fungsi `signOut()`.
- **Session Duration Tracking**: Sistem mengirimkan sinyal (*heartbeat*) setiap 5 menit untuk menghitung durasi penggunaan yang akurat di Panel Admin.

---

---

## ðŸ’¡ Konsep Teknis Utama

### UUID (Universally Unique Identifier)
Sistem menggunakan ID panjang (36 karakter) untuk keamanan, skalabilitas, dan mencegah tabrakan data antar sistem yang berbeda.

### Deteksi Akar (Root Detection)
Sistem secara otomatis mendeteksi leluhur tertua dalam sebuah keluarga untuk memulai penggambaran pohon. Jika ada anggota yang terpisah (orphan), mereka akan muncul sebagai akar baru untuk mencegah data hilang dari visualisasi.

---

## ðŸš€ Rekomendasi Pengembangan (Best Practices)

1.  **Indexing**: Selalu pastikan kolom `familyId`, `fromMemberId`, dan `toMemberId` memiliki index di database untuk mempercepat pencarian silsilah besar.
2.  **Data Integrity**: Gunakan *database transactions* saat menghapus anggota agar relasi yang terkait juga terhapus (Cascade Delete) secara bersih.
3.  **Privacy**: Selalu lakukan pengecekan `family_access` tingkat server sebelum mengembalikan data silsilah untuk mencegah kebocoran data antar keluarga.
4.  **Optimization**: Untuk pohon dengan ribuan anggota, pertimbangkan teknik *Virtual Scrolling* atau *Lazy Loading* pada level-level tertentu di SVG.
