# Silsilah Keluarga PWA – Testing Checklist

> **Tanggal**: 13 Maret 2026
> **URL Lokal**: `http://localhost:3001` (laptop) / `http://192.168.1.100:3001` (HP)
> **Mode**: Demo (tanpa database)

---

## 🖥️ LAPTOP (Browser Desktop)

### Dashboard (`/dashboard`)
- [ ] 3 kartu keluarga tampil (Siauw Sak Po, Keluarga Tan, Perkumpulan Marga Siauw)
- [ ] Jumlah anggota tampil benar (16, 0, 0)
- [ ] Nama user "Chris" muncul di sapaan
- [ ] Tombol + (FAB) tampil
- [ ] Catatan: _________

### Pohon Keluarga (`/family/fam-001`)
- [ ] Pohon tampil lengkap (tidak terpotong)
- [ ] Semua 16 anggota muncul
- [ ] Nickname + Full Name tampil (contoh: "Akong" + "Siauw Tek Hin")
- [ ] Umur tampil di pojok kanan atas node (hijau = hidup, abu = meninggal)
- [ ] Warna border: biru (♂) dan pink (♀)
- [ ] Anggota meninggal: Alm./Almh. + 🌼 + warna abu
- [ ] Zoom in/out berfungsi (tombol + scroll)
- [ ] Drag/pan berfungsi
- [ ] Klik node → detail muncul
- [ ] Anak >3 tampil rapi (Papa: Chris, Jess, Dan, Mel; Om Hwa: Ko Jun, Kev, Mel, Adi)
- [ ] Catatan: _________

### Pencarian (`/search`)
- [ ] Halaman tampil
- [ ] Ketik "Siauw" → hasil muncul
- [ ] Catatan: _________

### Profil (`/profile`)
- [ ] Nama "Chris Siauw (Demo)" tampil
- [ ] Email "demo@silsilah.app" tampil
- [ ] Tombol logout berfungsi
- [ ] Catatan: _________

### Umum (Laptop)
- [ ] Dark mode (jika aktif di sistem)
- [ ] Bottom nav tampil (Beranda, Cari, Profil)
- [ ] Navigasi antar halaman lancar
- [ ] Catatan umum: _________

---

## 📱 HP (Browser Mobile)

### Dashboard (`/dashboard`)
- [ ] 3 kartu keluarga tampil
- [ ] Jumlah anggota tampil benar
- [ ] Layout responsive (tidak overflow)
- [ ] FAB (+) tidak tertutup elemen lain
- [ ] Catatan: _________

### Pohon Keluarga (`/family/fam-001`)
- [ ] Pohon tampil lengkap (auto-fit ke layar)
- [ ] Semua 16 anggota muncul
- [ ] Nickname + Full Name tampil
- [ ] Umur tampil di node
- [ ] Pinch-to-zoom berfungsi (jika didukung)
- [ ] Drag/pan dengan jari berfungsi
- [ ] Klik node → detail muncul (bottom sheet)
- [ ] Anak >3 tampil rapi
- [ ] Teks terbaca jelas (tidak terlalu kecil)
- [ ] Catatan: _________

### Pencarian (`/search`)
- [ ] Halaman tampil
- [ ] Keyboard muncul saat tap search
- [ ] Hasil pencarian tampil
- [ ] Catatan: _________

### Profil (`/profile`)
- [ ] Info demo user tampil
- [ ] Layout responsive
- [ ] Catatan: _________

### Umum (HP)
- [ ] Bottom nav mudah dijangkau jempol
- [ ] Touch target cukup besar (≥48dp)
- [ ] Scroll halaman lancar
- [ ] Tidak ada horizontal overflow
- [ ] Font terbaca jelas (≥16px)
- [ ] Catatan umum: _________

---

## 💬 FITUR CHAT (Laptop & HP)

### Chat Keluarga (`/family/[id]/chat`)
- [ ] Ikon chat (💬) muncul di kartu keluarga di Dashboard
- [ ] Klik ikon chat → Pop-up "Identitas Chat" muncul
- [ ] Input nama tamu berfungsi dan tersimpan
- [ ] Pesan terkirim muncul secara real-time (tanpa refresh)
- [ ] Format pesan benar (`Nama: Isi Pesan`)
- [ ] Tombol "Ganti Profil" (ikon 👤) di pojok kanan atas berfungsi
- [ ] Catatan: _________

---

## 🐛 Bug & Masalah Ditemukan

### Laptop
| # | Halaman | Deskripsi Masalah | Prioritas |
|---|---------|-------------------|-----------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

### HP
| # | Halaman | Deskripsi Masalah | Prioritas |
|---|---------|-------------------|-----------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

---

## 💡 Saran & Masukan

| # | Saran | Dari (Laptop/HP) |
|---|-------|-------------------|
| 1 | | |
| 2 | | |
| 3 | | |
