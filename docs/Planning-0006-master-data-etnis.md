# Rencana Implementasi: Master Data Etnis & Aksara Regional (Versi RTL) ðŸŒðŸ”¡

Rencana ini mewujudkan tabel prioritas etnis Anda menjadi **Master Data** resmi. Fitur ini akan mendukung penulisan aksara daerah secara otomatis dengan dukungan khusus **RTL (Right-to-Left)** untuk aksara Jawi (Arab-Melayu).

## User Review Required

> [!IMPORTANT]
> **Dukungan RTL Jawi**: Sesuai diskusi, input teks untuk etnis **Melayu (Jawi)** akan otomatis menggunakan arah **Kanan-ke-Kiri (RTL)**. Hal ini akan memastikan teks Arab-Melayu terlihat natural saat diketik dan dibaca.

> [!CAUTION]
> **Migrasi Nama Mandarin**: Saya akan memindahkan data dari kolom `mandarinName` lama ke kolom `regionalName` baru bagi anggota yang sudah ada, lalu menghapus kolom lama agar database tetap bersih. Apakah Anda setuju?

## Proposed Changes

### [Backend] Database & Data Architecture

#### [MODIFY] [schema.ts](file:///d:/Data_chris/family_tree/src/lib/db/schema.ts)
- Membuat tabel `ethnicities`:
  - `id`, `name`, `scriptName`, `labelName`, `fontFamily`, `isRtl` (Boolean).
- Memperbarui `family_members`:
  - `ethnicityId` (FK ke `ethnicities`).
  - `regionalName` (Menampung teks aksara daerah/Mandarin).

#### [NEW] [seed-ethnicities.ts](file:///d:/Data_chris/family_tree/src/lib/db/seed-ethnicities.ts)
- Script untuk memasukkan 12 data etnis termasuk pengaturan RTL untuk Melayu.

### [Frontend] UI & UX Enhancements

#### [MODIFY] [MemberForm.tsx](file:///d:/Data_chris/family_tree/src/components/family/MemberForm.tsx)
- Menambahkan dropdown **"Etnis"**.
- Mengubah label input secara dinamis berdasarkan etnis yang dipilih.
- **Logika RTL**: Menambahkan atribut `dir="rtl"` pada kolom input jika etnis Melayu dipilih.

#### [MODIFY] [MemberDetail.tsx](file:///d:/Data_chris/family_tree/src/components/family/MemberDetail.tsx)
- Menampilkan nama regional dengan font yang sesuai dan arah teks (RTL/LTR) yang benar.

## Open Questions

- Apakah Anda ingin kolom "Nama Mandarin" tetap ada secara terpisah, atau cukup digabung ke dalam kolom "Nama Regional" sesuai etnis yang dipilih? (Saya merekomendasikan digabung agar sistem lebih fleksibel).

## Verification Plan

### Manual Verification
1. **Pilih Etnis Jawa**: Pastikan label input berubah menjadi "Nama Aksara Jawa".
2. **Pilih Etnis Melayu**: Ketik teks Jawi dan pastikan kursor mulai dari kanan (**RTL**).
3. **Pilih Etnis Tionghoa**: Masukkan Hanzi dan pastikan tampil dengan font Mandarin yang tajam.
