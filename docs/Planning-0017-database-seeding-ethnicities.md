# Planning-0017 - Database Seeding: Master Data Etnis ðŸŒ±ðŸ—„ï¸

Rencana ini akan mengisi tabel `ethnicities` di database Neon dengan 12 kelompok etnis Indonesia sesuai spesifikasi yang telah disepakati.

## User Review Required

> [!IMPORTANT]
> **Idempotensi**: Script seeding akan menggunakan logika "Upsert" (`onConflictDoUpdate`). Artinya, jika script dijalankan ulang, data yang sudah ada akan diperbarui, bukan diduplikasi.
> **ID Stabilitas**: Saya akan memetakan ID string dari konstanta (misal: "jawa") menjadi UUID yang stabil atau menggunakan ID string tersebut jika skema memungkinkan (saat ini skema menggunakan UUID).

## Proposed Changes

### [NEW] [Planning-0017-seed-ethnicities.ts](file:///d:/Data_chris/family_tree/src/scripts/seed-ethnicities.ts)
Script mandiri yang akan melakukan:
1. Membaca data dari `src/lib/constants/ethnicities.ts`.
2. Menghubungkan ke database menggunakan `DATABASE_URL`.
3. Memasukkan 12 record etnis ke tabel `ethnicities`.
4. Mencetak laporan jumlah record yang berhasil dimasukkan/diperbarui.

## Open Questions

1. Apakah Anda ingin saya menjalankan script ini sekarang juga di database live?
2. Apakah ada etnis tambahan yang ingin dimasukkan sebelum proses seeding dimulai?

## Verification Plan

### Automated Verification
- Menjalankan script menggunakan `npx tsx`.
- Memverifikasi output log untuk memastikan 12 baris data berhasil diproses.

### Manual Verification
- Membuka Drizzle Studio untuk melihat konten tabel `ethnicities`.
