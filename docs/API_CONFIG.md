# Dokumentasi API & Konfigurasi Sistem – Jejak Marga

Dokumen ini merangkum semua layanan pihak ketiga (API) dan variabel lingkungan (Environment Variables) yang digunakan dalam aplikasi Jejak Marga.

---

## 1. Layanan Database (Neon PostgreSQL)
Layanan utama untuk menyimpan data silsilah, akun pengguna, dan riwayat chat.
- **Provider**: [Neon.tech](https://neon.tech/)
- **Variabel**:
  - `DATABASE_URL`: URL koneksi PostgreSQL (termasuk user, password, dan host).
- **ORM**: Drizzle ORM (digunakan untuk skema dan query).

---

## 2. Autentikasi (NextAuth.js v5)
Mengelola login, registrasi, dan sesi pengguna.
- **Provider**: Internal (Credentials) & Google OAuth (Optional).
- **Variabel**:
  - `AUTH_SECRET`: Kunci acak untuk enkripsi cookie sesi.
  - `AUTH_URL`: URL dasar aplikasi (contoh: `https://www.jejakmarga.my.id`).

---

## 3. Chat Real-time (Pusher)
Layanan untuk komunikasi instan di fitur chat keluarga.
- **Provider**: [Pusher Channels](https://pusher.com/channels)
- **Variabel**:
  - `PUSHER_APP_ID`: ID Aplikasi Pusher.
  - `PUSHER_SECRET`: Kunci rahasia server.
  - `NEXT_PUBLIC_PUSHER_KEY`: Kunci publik untuk client (prefix `NEXT_PUBLIC`).
  - `NEXT_PUBLIC_PUSHER_CLUSTER`: Region server (contoh: `ap1`).

---

## 4. Media Storage (ImageKit.io)
Layanan untuk menyimpan dan mengoptimalkan foto profil anggota keluarga.
- **Provider**: [ImageKit.io](https://imagekit.io/)
- **Variabel**:
  - `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`: Kunci publik untuk client.
  - `IMAGEKIT_PRIVATE_KEY`: Kunci rahasia server (untuk autentikasi upload).
  - `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`: URL dasar gambar (contoh: `https://ik.imagekit.io/jejakmarga`).

---

## 5. Hosting & Deployment (Vercel)
Platform tempat aplikasi dijalankan secara live.
- **Domain**: `jejakmarga.my.id`
- **Variabel di Vercel**: Semua variabel di atas harus dimasukkan ke menu **Settings > Environment Variables** di Dashboard Vercel agar fitur berfungsi di situs live.

---

## Ringkasan Variabel Lingkungan (.env.local)

Pindahkan data berikut ke setiap lingkungan baru (lokal atau cloud):

```env
# Database
DATABASE_URL="..."

# Auth
AUTH_SECRET="..."
AUTH_URL="https://www.jejakmarga.my.id"

# Pusher
PUSHER_APP_ID="2127816"
NEXT_PUBLIC_PUSHER_KEY="01df9e559104c096e454"
PUSHER_SECRET="fa504d4536f3f38368da"
NEXT_PUBLIC_PUSHER_CLUSTER="ap1"

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_+O+4f1C3qWg7oLoAl9seuaUpbqM="
IMAGEKIT_PRIVATE_KEY="private_shV5Qdjt16Y8nJia/neDGbrUIWY="
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/jejakmarga"
```

---
*Dokumen ini diperbarui secara otomatis sesuai koordinasi pengembangan.*
