# Dokumentasi: Master Data Etnis & Aksara Regional 🌏🔡
## Sistem Jejak Marga — Referensi Teknis

---

## 1. Ringkasan Fitur

Sistem ini memungkinkan setiap anggota keluarga di pohon silsilah memiliki **identitas etnis** dan **nama dalam aksara daerah** yang ditampilkan dengan font khusus.

### Alur Kerja:
1. Buka form **Tambah/Edit Anggota**.
2. Pilih **Etnis / Suku** dari dropdown.
3. Kolom input baru muncul secara otomatis dengan **label dinamis** sesuai etnis yang dipilih.
4. Ketik nama dalam aksara daerah — sistem otomatis menerapkan **font khusus** dan **arah teks (RTL)** jika diperlukan.

---

## 2. Tabel Master Data Etnis

| No | Etnis | Aksara | Label di Sistem | Font | Contoh | RTL | Catatan |
|:--:|:------|:-------|:----------------|:-----|:-------|:---:|:--------|
| 1 | Jawa | Hanacaraka | Nama Aksara Jawa (Hanacaraka) | Noto Sans Javanese | ꦄꦥꦁ | ❌ | Prioritas tertinggi |
| 2 | Sunda | Aksara Sunda Baku | Nama Aksara Sunda | Noto Sans Sundanese | ᮃᮕᮀ | ❌ | |
| 3 | Batak (gabungan) | Surat Batak | Nama Surat Batak | Noto Sans Batak | ᯀᯇᯰ | ❌ | Mencakup Toba, Karo, Mandailing |
| 4 | Tionghoa (Cina) | Hanzi | Nama Mandarin (Hanzi) | Noto Sans SC / TC | 阿方 | ❌ | WNI keturunan |
| 5 | Bugis | Lontara' | Nama Aksara Lontara' | Noto Sans Lontara | ᨕᨄ | ❌ | |
| 6 | Madura | Carakan Madhurâ | Nama Carakan Madhurâ | Noto Sans Javanese | ꦄꦥꦁ | ❌ | Tidak punya blok Unicode sendiri |
| 7 | Bali | Aksara Bali | Nama Aksara Bali | Noto Sans Balinese | ᬅᬧᬂ | ❌ | |
| 8 | Makassar | Lontara' | Nama Aksara Lontara' | Noto Sans Lontara | ᨕᨄ | ❌ | Sama dengan Bugis |
| 9 | Melayu | Jawi (Arab-Melayu) | Nama Jawi (Arab-Melayu) | Noto Sans Arabic | اڤڠ | ✅ | **RTL aktif otomatis** |
| 10 | Rejang | Aksara Rejang | Nama Aksara Rejang | Noto Sans Rejang | ꥆꥉꥇ | ❌ | Populasi kecil, didukung Unicode |
| 11 | Lampung | Aksara Lampung | Nama Aksara Lampung | Noto Sans Lampung | 𞄀𞄃𞄁 | ❌ | |
| 12 | Kerinci | Aksara Incung | Nama Aksara Incung | *(belum tersedia)* | - | ❌ | Belum dukung penuh |

---

## 3. Arsitektur Teknis

### 3.1 Master Data (Konstanta Frontend)
File: `src/lib/constants/ethnicities.ts`

Data etnis disimpan sebagai **konstanta TypeScript** yang digunakan di seluruh aplikasi. Setiap entri memiliki:
- `id` — Kunci unik (misal: `"jawa"`, `"tionghoa"`)
- `name` — Nama tampilan
- `scriptName` — Nama aksara
- `labelName` — Label yang muncul di form input
- `fontFamily` — CSS font-family
- `fontClass` — CSS utility class
- `isRtl` — Boolean, `true` hanya untuk Melayu (Jawi)
- `example` — Contoh karakter aksara

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
┌────────────────────────────────┐
│  Etnis / Suku                  │
│  ┌────────────────────────┐    │
│  │ ▼ Tionghoa (Cina)      │    │  ← Dropdown
│  └────────────────────────┘    │
│                                │
│  Nama Mandarin (Hanzi)         │  ← Label dinamis
│  ┌────────────────────────┐    │
│  │ 阿方                    │    │  ← Font: Noto Sans SC
│  └────────────────────────┘    │
│  Aksara: Hanzi — Contoh: 阿方  │  ← Hint
└────────────────────────────────┘
```

Jika etnis **Melayu** dipilih:
```
┌────────────────────────────────┐
│  Etnis / Suku                  │
│  ┌────────────────────────┐    │
│  │ ▼ Melayu               │    │
│  └────────────────────────┘    │
│                                │
│  Nama Jawi (Arab-Melayu)       │
│  ┌────────────────────────┐    │
│  │               اڤڠ      │    │  ← dir="rtl" ⬅️
│  └────────────────────────┘    │
│  Aksara: Jawi — Contoh: اڤڠ   │
└────────────────────────────────┘
```

#### MemberDetail.tsx
- Menampilkan baris **Etnis** (misal: "Tionghoa (Cina)")
- Menampilkan baris **Nama Regional** dengan font dan arah teks yang tepat
- Backward-compatible: Jika hanya ada `mandarinName` tanpa `regionalName`, tetap ditampilkan.

---

## 4. Font yang Terpasang

| Paket NPM | Status |
|:-----------|:------:|
| `@fontsource/noto-sans-javanese` | ✅ Terpasang |
| `@fontsource/noto-sans-sundanese` | ✅ Terpasang |
| `@fontsource/noto-sans-batak` | ✅ Terpasang |
| `@fontsource/noto-sans-sc` | ✅ Terpasang |
| `@fontsource/noto-sans-tc` | ✅ Terpasang |
| `@fontsource/noto-sans-balinese` | ✅ Terpasang |
| `@fontsource/noto-sans-arabic` | ✅ Terpasang |
| `@fontsource/noto-sans-lontara` | ⚠️ Belum tersedia di registry |
| `@fontsource/noto-sans-rejang` | ⚠️ Belum tersedia di registry |
| `@fontsource/noto-sans-lampung` | ⚠️ Belum tersedia di registry |

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
