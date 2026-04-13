# Walkthrough: Integrasi Font Regional & Kendali Deteksi Otomatis ðŸ”¡ðŸŽšï¸

Saya telah berhasil mengintegrasikan dukungan untuk 7 aksara regional dan internasional ke dalam sistem **Jejak Marga**, lengkap dengan tombol kendali (Switch) di halaman profil.

## Fitur Utama yang Diimplementasikan

### 1. Deteksi Aksara Otomatis (Default: AKTIF) ðŸš€
Sistem sekarang secara otomatis mendeteksi karakter non-latin dan menerapkan font Noto Sans yang sesuai:
- **Aksara Daerah**: Jawa, Sunda, Batak, Bali.
- **Internasional**: Arab, Mandarin (Simplified & Traditional).
- **Efisiensi Performa**: Font hanya akan diunduh oleh browser jika karakter tersebut benar-benar muncul di layar.

### 2. Tombol Kendali di Halaman Profil ðŸ“
Pengguna memiliki kontrol penuh untuk mengaktifkan atau menonaktifkan fitur ini melalui Halaman Profil.
- **Lokasi**: Profil > Pengaturan > Deteksi Aksara Otomatis.
- **Persistensi**: Pengaturan tersimpan secara permanen di browser pengguna (tidak hilang saat refresh).

## Perubahan Teknis yang Dilakukan
- **`FontProvider.tsx`**: Mengelola status global dan penyimpanan lokal.
- **`layout.tsx`**: Mengimpor 7 paket `@fontsource/noto-sans` dan membungkus aplikasi.
- **`globals.css`**: Menambahkan *font-stack fallback* yang cerdas dan utility classes.
- **`MemberDetail.tsx`**: Mengoptimalkan tampilan `Nama Mandarin` dengan font khusus.

> [!NOTE]
> Fitur ini bersifat aman dan tidak akan mengganggu stabilitas sistem atau performa bagi pengguna yang hanya menggunakan karakter Latin standar.
