# Planning-0022 - Sinkronisasi Master Data Etnis Database & Frontend ðŸŒðŸ”„

Rencana ini bertujuan untuk memperbaiki masalah "data etnis tidak muncul di live" dengan mengalihkan sumber data dari konstanta statis ke tabel database `ethnicities`.

## User Review Required

> [!IMPORTANT]
> **Migrasi Data**: Setelah perubahan ini, anggota keluarga yang sebelumnya disimpan dengan ID string (seperti "jawa") mungkin perlu diperbarui ke UUID yang benar agar namanya muncul kembali. 
> **Seeding Live**: Anda mungkin perlu menjalankan perintah seeding di dashboard Neon jika tabel `ethnicities` masih kosong di sana.

## Proposed Changes

### [NEW] [src/lib/actions/ethnicity.ts](file:///d:/Data_chris/family_tree/src/lib/actions/ethnicity.ts)
- Membuat server action `getEthnicities()` untuk mengambil semua data dari tabel `ethnicities`.

### [MODIFY] [page.tsx](file:///d:/Data_chris/family_tree/src/app/(main)/family/[id]/page.tsx)
- Menambahkan pemanggilan `getEthnicities()` di Server Component dan meneruskannya ke `FamilyPageClient`.

### [MODIFY] [FamilyPageClient.tsx](file:///d:/Data_chris/family_tree/src/app/(main)/family/[id]/FamilyPageClient.tsx)
- Menerima prop `ethnicities` baru dan menyalurkannya ke komponen `MemberForm`.

### [MODIFY] [MemberForm.tsx](file:///d:/Data_chris/family_tree/src/components/family/MemberForm.tsx)
- Mengganti penggunaan `ETHNICITIES` (konstanta) dengan data dari database.
- Memperbarui logika pemilihan etnis agar menggunakan UUID sebagai `value`.
- Tetap menggunakan file konstanta sebagai **referensi metadata** (font, script name) berdasarkan pencocokan nama etnis.

### [MODIFY] [MemberDetail.tsx](file:///d:/Data_chris/family_tree/src/components/family/MemberDetail.tsx)
- Memperbarui logika tampilan etnis agar bisa mengenali ID UUID dari database.

## Open Questions

1. Apakah Anda memiliki akses untuk menjalankan script seeding (ts-node/tsx) di link hosting "Live" Anda?
2. Apakah Anda setuju jika saya menambahkan skrip deteksi otomatis yang akan mencoba mencocokkan data lama (string) ke data baru (UUID)?

## Verification Plan

### Automated Tests
- Menjalankan `getEthnicities()` dan memastikan data yang dikembalikan sesuai dengan isi tabel.
- Simulasi simpan anggota dengan UUID etnis dan verifikasi keberhasilannya di database.

### Manual Verification
- Membuka dropdown Etnis di form dan memastikan daftar (seperti Jawa, Sunda, dll) muncul.
- Memastikan label nama regional (seperti "Nama Mandarin") muncul secara dinamis saat etnis dipilih.
