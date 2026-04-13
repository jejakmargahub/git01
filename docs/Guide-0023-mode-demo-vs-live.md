# Panduan Mode Data: Demo vs Live ðŸŒ

Dokumen ini menjelaskan dua mode operasional yang digunakan dalam aplikasi Jejak Marga untuk manajemen data dan pengembangan.

## Perbandingan Cepat

| Fitur | Mode Demo (`IS_DEMO_MODE=true`) | Mode Live (`IS_DEMO_MODE=false`) |
|---|---|---|
| **Sumber Data** | File lokal `src/lib/db/mock-data.ts` | Database PostgreSQL (Neon) |
| **Autentikasi** | Auto-login sebagai `DEMO_USER` | Login asli via Email/OTP |
| **Penyimpanan** | Sementara (Reset saat refresh/rebuild) | Permanen di Cloud Database |
| **Tujuan** | Presentasi, testing UI, pengembangan lokal | Penggunaan asli oleh pengguna akhir |

---

## Logika Operasional

### 1. Bagaimana Cara Beralih?
Mode ditentukan melalui variabel lingkungan (*environment variable*) di file `.env.local` atau di dashboard Vercel:

```env
IS_DEMO_MODE=true  # Aktifkan data contoh
# atau
IS_DEMO_MODE=false # Gunakan database nyata
```

### 2. Efek pada Pengguna (UX)
*   **Dalam Mode Demo**: Pengguna akan melihat pohon keluarga "Siauw Sak Po" dengan 4 generasi. Fitur tambah/edit anggota terlihat berfungsi di layar, tetapi data tidak akan tersimpan ke database.
*   **Dalam Mode Live**: Pengguna harus login. Jika mereka baru pertama kali masuk, mereka akan memulai dari nol (Pohon Kosong) kecuali jika mereka diundang ke keluarga yang sudah ada.

## Rekomendasi Penggunaan
*   **Gunakan Mode Demo saat**: Presentasi ke keluarga besar atau investor untuk menunjukkan potensi aplikasi tanpa harus mengisi data asli terlebih dahulu.
*   **Gunakan Mode Live saat**: Tahap produksi di mana pengguna mulai menginput silsilah keluarga mereka yang sebenarnya.

---
> [!IMPORTANT]
> Pastikan variabel `DATABASE_URL` sudah terkonfigurasi dengan benar di Vercel sebelum mengaktifkan Mode Live, jika tidak, aplikasi akan mengalami error saat mencoba menghubungi database.

*Terakhir diperbarui: 13-04-2026 oleh Antigravity*
