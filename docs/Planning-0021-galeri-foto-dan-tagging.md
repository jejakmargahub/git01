# Planning-0021 - Fondasi Galeri Foto & Smart Tagging ðŸ–¼ï¸ðŸ·ï¸

Rencana ini bertujuan untuk membangun fondasi teknis bagi fitur Galeri Foto dan penandaan anggota keluarga (*member tagging*) serta mengakomodasi keinginan Anda untuk menyimpan foto resolusi tinggi.

## User Review Required

> [!IMPORTANT]
> **Biaya Penyimpanan**: Menyimpan foto resolusi 100% secara massal di galeri akan mempercepat konsumsi kuota ImageKit/Cloud Storage. Saya menyarankan sistem "Dual Storage" (Thumbnail untuk tampilan cepat, Original untuk arsip).
> **Koordinat Tagging**: Penandaan akan menggunakan sistem persentase (0-100%) agar posisi tag wajah tetap konsisten di semua ukuran layar (responsif).

## Proposed Changes

### [MODIFY] [schema.ts](file:///d:/Data_chris/family_tree/src/lib/db/schema.ts)
1. **Tabel `families`**: Menambahkan kolom `settings (jsonb)` untuk menyimpan status `highResEnabled`.
2. **[NEW] Tabel `family_photos`**: Menyimpan metadata foto galeri (URL, judul, deskripsi, tanggal diambil).
3. **[NEW] Tabel `photo_tags`**: Menyimpan relasi antara foto dan anggota keluarga (`member_id`) beserta koordinat tagging (`x`, `y`).

### [MODIFY] [MemberForm.tsx](file:///d:/Data_chris/family_tree/src/components/family/MemberForm.tsx)
1. Memperbarui logika `compressImage` agar mengambil preferensi dari database.
2. Jika High-Res aktif, kompresi akan melewati batas 800px dan menggunakan kualitas 1.0.

### [NEW] Gallery & Tagging Logic
Mempersiapkan *Service Layer* baru untuk:
1. Menandai anggota pada foto galeri.
2. Menampilkan "Foto Terkait" di profil anggota (otomatis menarik dari tag di galeri).

## Open Questions

1. **Tagging Manual vs AI**: Apakah penandaan wajah akan dilakukan manual oleh user secara penuh di tahap awal ini?
2. **Album Access**: Apakah Anda ingin ada pembatasan akses untuk foto-foto tertentu (misal: album privat)?

## Verification Plan

- Uji coba skema database baru dengan data dummy.
- Simulasi upload foto dengan toggle High-Res On/Off.
- Verifikasi akurasi koordinat tag wajah pada berbagai aspek rasio gambar.
