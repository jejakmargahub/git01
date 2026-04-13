# Architecture-0020 - Cetak Biru Skalabilitas & Fitur Masa Depan ðŸ—ºï¸ðŸš€

Dokumen ini merangkum strategi arsitektur untuk pengembangan fitur lanjutan di Jejak Marga, melampaui fungsi silsilah dasar.

## 1. Manajemen Media & Kualitas Tinggi (High-Res Toggle)

Untuk mengakomodasi kebutuhan cetak (high-res) sambil tetap menjaga efisiensi penyimpanan, sistem akan mengadopsi pendekatan **Tiered Quality**:

### Implementasi Teknis:
- **Family Setting**: Menambahkan kolom `settings (JSONB)` pada tabel `families` untuk menyimpan konfigurasi `isHighResActive`.
- **Client-Side Switch**: Komponen `MemberForm` akan membaca pengaturan ini. Jika aktif, fungsi `compressImage` akan meningkatkan `MAX_WIDTH` ke resolusi asli dan `quality` ke 1.0.
- **Storage Strategy**: Menggunakan fitur *Folders* di ImageKit untuk memisahkan aset yang dikompresi (Thumbnail) dan aset asli (Original).

---

## 2. Galeri Foto Keluarga & Member Tagging ðŸ–¼ï¸ðŸ·ï¸

Fitur ini memungkinkan foto keluarga besar menjadi bagian integral dari silsilah.

### Database Design (Rancangan Tabel):
- **`family_photos`**: Menampung aset media galeri.
  - `id`, `family_id`, `url`, `caption`, `taken_at`.
- **`photo_tags`**: Tabel penghubung antara foto dan anggota.
  - `id`, `photo_id`, `member_id`, `coordinates_json` (posisi wajah).

### Fitur Unggulan:
- **Cross-Referencing**: Klik wajah di foto -> Buka profil anggota di pohon.
- **Automatic Album**: Sistem otomatis membuat album berdasarkan nama anggota keluarga (mengumpulkan semua foto yang ditag ke orang tersebut).

---

## 3. Optimasi Hierarki & Skalabilitas Data ðŸŒ³ðŸ“ˆ

Saat pohon mencapai ribuan node, query relasi tradisional akan melambat.

### Strategi Lanjutan:
- **Postgres `ltree`**: Menggunakan ekstensi `ltree` jika Jejak Marga beralih ke struktur pohon global. Ini memungkinkan query leluhur/keturunan secepat kilat tanpa operasi rekursif yang mahal.
- **GEDCOM Interoperability**: Mempersiapkan modul `parser` dan `generator` GEDCOM 7.0 agar pengguna bisa membawa data mereka masuk/keluar dari ekosistem Jejak Marga dengan aman.

---

## 4. Keamanan & Privasi Data Anggota Hidup (PII) ðŸ”’

- **Privacy Flag**: Setiap node anggota akan memiliki status `is_private`.
- **Relationship Discovery**: Algoritma yang membatasi tampilan data detail (telepon/email) hanya kepada anggota yang memiliki hubungan darah terdekat atau diberikan izin akses manual oleh admin keluarga.

---
*Dibuat oleh Antigravity (Assistant) untuk Jejak Marga pada 13 April 2026.*
