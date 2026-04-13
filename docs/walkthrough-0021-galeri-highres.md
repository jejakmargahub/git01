# Walkthrough-0021 - Fondasi Galeri & High-Res Toggle ðŸ–¼ï¸ðŸš€

Saya telah mengimplementasikan fondasi teknis untuk mendukung penyimpanan foto kualitas tinggi dan sistem galeri keluarga yang Anda rencanakan.

## Perubahan Utama

### 1. Database & Skema
- **Family Settings**: Tabel `families` kini memiliki kolom `settings` (JSONB) untuk menyimpan preferensi keluarga secara dinamis.
- **Tabel Galeri**: Menambahkan tabel `family_photos` dan `photo_tags` untuk mendukung penandaan anggota keluarga pada foto di masa depan.

### 2. Antarmuka Pengaturan Keluarga (Admin Only)
Saya telah menambahkan tombol pengaturan (**âš™ï¸**) pada header halaman keluarga yang hanya muncul untuk Admin. Di dalamnya terdapat toggle baru:
- **"Foto Kualitas Tinggi"**: Jika diaktifkan, sistem akan menghentikan kompresi agresif pada foto anggota baru.

### 3. Logika Upload Cerdas
- **MemberForm**: Sekarang otomatis mendeteksi pengaturan keluarga.
  - **High-Res OFF (Default)**: Foto dikompres ke 800px (80% quality) untuk hemat ruang Neon.
  - **High-Res ON**: Foto dipertahankan hingga 4000px (100% quality) untuk kebutuhan cetak/arsip.

## Langkah Berikutnya
- [ ] **Halaman Galeri**: Membuat UI untuk melihat semua foto keluarga.
- [ ] **UI Penandaan (Tagging)**: Membuat antarmuka klik-pada-foto untuk menandai anggota keluarga.

---
*Perubahan ini memastikan sistem Anda siap untuk skalabilitas jangka panjang tanpa harus merombak ulang struktur dasar.*
