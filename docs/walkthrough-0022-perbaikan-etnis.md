# Walkthrough-0022 - Perbaikan Data Etnis Database-Driven ðŸŒðŸ”„

Saya telah memperbaiki masalah data etnis yang tidak muncul di lingkungan Live dengan memigrasikan sistem dari konstanta statis ke data dinamis dari database PostgreSQL.

## Perubahan Teknis

### 1. Database-First Data Flow
- **Server Action**: Membuat `getEthnicities()` untuk mengambil master data etnis dari tabel `ethnicities`.
- **Query Join**: Memperbarui query di halaman keluarga agar melakukan `LEFT JOIN` antara anggota keluarga dan etnis. Ini memastikan data etnis tersedia secara instan tanpa fetch tambahan.

### 2. Update Komponen UI
- **MemberForm**: Dropdown etnis kini diisi oleh data dari database. Nilai (*value*) yang dikirim adalah **UUID**, yang selaras dengan skema database.
- **MemberDetail**: Sekarang menampilkan nama etnis dan aksara regional berdasarkan relasi database yang ditemukan.

### 3. Fitur Self-Healing (Penyembuhan Data)
Saya menambahkan logika cerdas untuk menangani transisi data:
- Jika sistem menemukan ID etnis lama (berupa string seperti `"jawa"`), sistem akan secara otomatis mencoba mencocokkan metadata font-nya (dari konstanta) agar aksara regional tidak hilang pada data lama.

## Hasil Pengujian
1. Dropdown etnis di Form Tambah Anggota kini menampilkan data dari database.
2. Memilih etnis akan memicu input aksara regional dengan font yang sesuai (Noto Sans).
3. Data yang tersimpan di database sekarang menggunakan foreign key UUID yang valid.

---
*Sistem sekarang lebih robust dan sesuai dengan standar arsitektur database modern.*
