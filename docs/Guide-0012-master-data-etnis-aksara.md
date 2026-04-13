# Dokumentasi: Master Data Etnis & Aksara Regional ðŸŒðŸ”¡
## Sistem Jejak Marga â€” Referensi Teknis

---

## 1. Ringkasan Fitur

Sistem ini memungkinkan setiap anggota keluarga di pohon silsilah memiliki **identitas etnis** dan **nama dalam aksara daerah** yang ditampilkan dengan font khusus.

### Alur Kerja:
1. Buka form **Tambah/Edit Anggota**.
2. Pilih **Etnis / Suku** dari dropdown.
3. Kolom input baru muncul secara otomatis dengan **label dinamis** sesuai etnis yang dipilih.
4. Ketik nama dalam aksara daerah â€” sistem otomatis menerapkan **font khusus** dan **arah teks (RTL)** jika diperlukan.

---

## 2. Tabel Master Data Etnis

| No | Etnis | Aksara | Label di Sistem | Font | Contoh | RTL | Catatan |
|:--:|:------|:-------|:----------------|:-----|:-------|:---:|:--------|
| 1 | Jawa | Hanacaraka | Nama Aksara Jawa (Hanacaraka) | Noto Sans Javanese | ê¦„ê¦¥ê¦ | âŒ | Prioritas tertinggi |
| 2 | Sunda | Aksara Sunda Baku | Nama Aksara Sunda | Noto Sans Sundanese | á®ƒá®•á®€ | âŒ | |
| 3 | Batak (gabungan) | Surat Batak | Nama Surat Batak | Noto Sans Batak | á¯€á¯‡á¯° | âŒ | Mencakup Toba, Karo, Mandailing |
| 4 | Tionghoa (Cina) | Hanzi | Nama Mandarin (Hanzi) | Noto Sans SC / TC | é˜¿æ–¹ | âŒ | WNI keturunan |
| 5 | Bugis | Lontara' | Nama Aksara Lontara' | Noto Sans Lontara | á¨•á¨„ | âŒ | |
| 6 | Madura | Carakan MadhurÃ¢ | Nama Carakan MadhurÃ¢ | Noto Sans Javanese | ê¦„ê¦¥ê¦ | âŒ | Tidak punya blok Unicode sendiri |
| 7 | Bali | Aksara Bali | Nama Aksara Bali | Noto Sans Balinese | á¬…á¬§á¬‚ | âŒ | |
| 8 | Makassar | Lontara' | Nama Aksara Lontara' | Noto Sans Lontara | á¨•á¨„ | âŒ | Sama dengan Bugis |
| 9 | Melayu | Jawi (Arab-Melayu) | Nama Jawi (Arab-Melayu) | Noto Sans Arabic | Ø§Ú¤Ú  | âœ… | **RTL aktif otomatis** |
| 10 | Rejang | Aksara Rejang | Nama Aksara Rejang | Noto Sans Rejang | ê¥†ê¥‰ê¥‡ | âŒ | Populasi kecil, didukung Unicode |
| 11 | Lampung | Aksara Lampung | Nama Aksara Lampung | Noto Sans Lampung | ðž„€ðž„ƒðž„ | âŒ | |
| 12 | Kerinci | Aksara Incung | Nama Aksara Incung | *(belum tersedia)* | - | âŒ | Belum dukung penuh |

---

## 3. Arsitektur Teknis

### 3.1 Master Data (Konstanta Frontend)
File: `src/lib/constants/ethnicities.ts`

Data etnis disimpan sebagai **konstanta TypeScript** yang digunakan di seluruh aplikasi. Setiap entri memiliki:
- `id` â€” Kunci unik (misal: `"jawa"`, `"tionghoa"`)
- `name` â€” Nama tampilan
- `scriptName` â€” Nama aksara
- `labelName` â€” Label yang muncul di form input
- `fontFamily` â€” CSS font-family
- `fontClass` â€” CSS utility class
- `isRtl` â€” Boolean, `true` hanya untuk Melayu (Jawi)
- `example` â€” Contoh karakter aksara

### 3.2 Database Schema
Tabel `ethnicities` di PostgreSQL (Neon):
```sql
CREATE TABLE ethnicities (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  script_name VARCHAR(255),
  label_name VARCHAR(255),
  font_family VARCHAR(255),
  is_rtl BOOLEAN DEFAULT false,
  example VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Kolom baru pada `family_members`:
```sql
ALTER TABLE family_members
  ADD COLUMN ethnicity_id UUID REFERENCES ethnicities(id),
  ADD COLUMN regional_name VARCHAR(255);
```

### 3.3 Komponen UI

#### MemberForm.tsx
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Etnis / Suku                  â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚ â–¼ Tionghoa (Cina)      â”‚    â”‚  â† Dropdown
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚                                â”‚
â”‚  Nama Mandarin (Hanzi)         â”‚  â† Label dinamis
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚ é˜¿æ–¹                    â”‚    â”‚  â† Font: Noto Sans SC
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚  Aksara: Hanzi â€” Contoh: é˜¿æ–¹  â”‚  â† Hint
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Jika etnis **Melayu** dipilih:
```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Etnis / Suku                  â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚ â–¼ Melayu               â”‚    â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚                                â”‚
â”‚  Nama Jawi (Arab-Melayu)       â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”    â”‚
â”‚  â”‚               Ø§Ú¤Ú       â”‚    â”‚  â† dir="rtl" â¬…ï¸
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜    â”‚
â”‚  Aksara: Jawi â€” Contoh: Ø§Ú¤Ú    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

#### MemberDetail.tsx
- Menampilkan baris **Etnis** (misal: "Tionghoa (Cina)")
- Menampilkan baris **Nama Regional** dengan font dan arah teks yang tepat
- Backward-compatible: Jika hanya ada `mandarinName` tanpa `regionalName`, tetap ditampilkan.

---

## 4. Font yang Terpasang

| Paket NPM | Status |
|:-----------|:------:|
| `@fontsource/noto-sans-javanese` | âœ… Terpasang |
| `@fontsource/noto-sans-sundanese` | âœ… Terpasang |
| `@fontsource/noto-sans-batak` | âœ… Terpasang |
| `@fontsource/noto-sans-sc` | âœ… Terpasang |
| `@fontsource/noto-sans-tc` | âœ… Terpasang |
| `@fontsource/noto-sans-balinese` | âœ… Terpasang |
| `@fontsource/noto-sans-arabic` | âœ… Terpasang |
| `@fontsource/noto-sans-lontara` | âš ï¸ Belum tersedia di registry |
| `@fontsource/noto-sans-rejang` | âš ï¸ Belum tersedia di registry |
| `@fontsource/noto-sans-lampung` | âš ï¸ Belum tersedia di registry |

---

## 5. Fitur Deteksi Aksara Otomatis

Lokasi: **Profil > Pengaturan > Deteksi Aksara Otomatis**

| Setting | Fungsi |
|:--------|:-------|
| **Aktif** (Default) | Browser otomatis menerapkan font regional untuk karakter non-Latin |
| **Non-aktif** | Kembali ke font sistem standar |

Preferensi disimpan di `localStorage` dan bertahan setelah refresh halaman.

---

## 6. File yang Dibuat/Dimodifikasi

| File | Aksi | Deskripsi |
|:-----|:----:|:----------|
| `src/lib/constants/ethnicities.ts` | **BARU** | Master data 12 etnis |
| `src/components/providers/FontProvider.tsx` | **BARU** | Toggle deteksi aksara |
| `src/lib/db/schema.ts` | MODIF | Tabel `ethnicities` + kolom baru |
| `src/lib/actions/member.ts` | MODIF | Simpan ethnicityId & regionalName |
| `src/components/family/MemberForm.tsx` | MODIF | Dropdown etnis + input dinamis |
| `src/components/family/MemberDetail.tsx` | MODIF | Tampilkan nama regional |
| `src/app/layout.tsx` | MODIF | Import font + FontProvider |
| `src/app/globals.css` | MODIF | Font fallback + utility classes |
| `src/app/(main)/profile/page.tsx` | MODIF | Toggle pengaturan aksara |
