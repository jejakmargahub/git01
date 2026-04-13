# Rencana Reorganisasi Dokumentasi Artifact ðŸ“‚ðŸ“

Rencana ini bertujuan untuk merapikan seluruh dokumentasi teknis yang ada di dalam sistem Jejak Marga dengan pola penamaan yang terstandarisasi dan membuat satu titik masuk (Index) utama.

## User Review Required

> [!IMPORTANT]
> **Pola Penamaan**: Sesuai permintaan Anda, saya akan menggunakan format `KATEGORI-NOMOR-NAMA`. Nomor `001` akan digunakan sebagai nomor urut pertama di setiap kategori.
> Contoh: `CORE-001-arsitektur.md`, `FEAT-001-etnis.md`.

## Proposed Changes

### [Dokumentasi] Restrukturisasi File

Saya akan mengganti nama file artifact yang sudah ada (membuat salinan baru dengan nama yang benar dan menghapus yang lama) sesuai kategori berikut:

#### Kategori: CORE (Sistem Inti)
1. `architecture_overview.md` âž” `CORE-001-arsitektur-sistem.md`
2. `api_config.md` âž” `CORE-002-konfigurasi-api.md`
3. `user_roles.md` âž” `CORE-003-peran-pengguna.md`

#### Kategori: PLAN (Perencanaan)
1. `implementation_plan_font_integration.md` âž” `PLAN-001-integrasi-font.md`
2. `implementation_plan_ethnicity_master.md` âž” `PLAN-002-master-data-etnis.md`
3. `implementation_plan_admin_analytics.md` âž” `PLAN-003-admin-analytics.md`
4. `implementation_plan_otp_email.md` âž” `PLAN-004-otp-email-auth.md`

#### Kategori: FEAT (Walkthrough Fitur)
1. `FEAT-001-master-data-etnis-aksara.md` (Update dari walkthrough.md)
2. `FEAT-002-integrasi-font-regional.md`
3. `FEAT-003-login-otp-google-auth.md`

#### Kategori: FRWK (Framework & Tech Stack)
1. `FRWK-001-tech-stack-overview.md` (Dokumen baru yang merangkum Next.js, Drizzle, etc.)

#### Kategori: LOG (Catatan Proyek)
1. `project_log.md` âž” `LOG-001-log-proyek.md`

### [NEW] [001-INDEX.md](./001-INDEX.md)
Artifak utama yang berisi daftar seluruh dokumentasi dengan link yang mengarah ke file masing-masing.

## Open Questions

1. Apakah ada kategori lain yang Anda inginkan (misal: `TEST` untuk checklist pengujian)?
2. Apakah Anda ingin file lama (dengan nama lama) dihapus sepenuhnya atau dibiarkan sebagai cadangan? (Saya merekomendasikan dihapus agar tidak membingungkan).

## Verification Plan

### Manual Verification
- Menampilkan daftar artifact terbaru dan memastikan pola penamaan sudah sesuai.
- Membuka `001-INDEX.md` dan memastikan seluruh link berfungsi dengan benar.
