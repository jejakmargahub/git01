# Architecture-0018 - Evaluasi Teknologi Messaging & Queue ðŸ›°ï¸ðŸ“¦

Dokumen ini berisi ulasan teknis terhadap berbagai teknologi *messaging* untuk menentukan solusi terbaik bagi masa depan ekosistem **Jejak Marga**.

## 1. Ringkasan Lisensi & Fleksibilitas

Berikut adalah klasifikasi teknologi berdasarkan fleksibilitas lisensi yang Anda sebutkan:

| Teknologi | Lisensi | Fleksibilitas Komersial |
| :--- | :--- | :--- |
| **Go-Kafka, Jocko, Redis Streams** | **MIT** | Sangat Tinggi (Bebas modifikasi/distribusi) |
| **pgdb-queue** (Postgres) | **MIT** | Sangat Tinggi (Sesuai stack saat ini) |
| **NATS JetStream** | **MIT/Apache** | Tinggi (Gratis untuk penggunaan inti) |
| **Apache Pulsar** | **Apache 2.0** | Tinggi (Standar industri open-source) |

---

## 2. Analisis Perbandingan Teknologi

### A. Solusi Berbasis PostgreSQL (pgdb-queue) ðŸ˜
Karena Jejak Marga sudah menggunakan **Neon (Postgres)**, ini adalah jalur tercepat.
- **Kelebihan**: Tidak butuh server baru, transaksi ACID (data pohon silsilah & antrean tugas terjamin sinkron).
- **Kelemahan**: Performa terbatas untuk jutaan pesan per detik (namun sangat cukup untuk aplikasi silsilah).
- **Cocok Untuk**: Background task seperti ekspor PDF, resize foto anggota, dan pengiriman email massal.

### B. Solusi Ringan & Performa Tinggi (Redis Streams & NATS) âš¡
- **Redis Streams**: Sangat cepat untuk *real-time events*. Cocok jika kita ingin menggantikan Pusher dengan solusi yang lebih terkontrol.
- **NATS JetStream**: Pilihan modern yang sangat ringan. NATS dikenal sangat gampang dideploy (hanya satu binary).
- **Cocok Untuk**: Chat antar keluarga, notifikasi real-time, dan log aktivitas pengguna secara instan.

### C. Solusi Skala Besar (Go-Kafka, Jocko, Pulsar) ðŸ—ï¸
- **Go-Kafka/Jocko**: Implementasi protokol Kafka di bahasa Go. Jocko mencoba membuat Kafka jadi lebih ringan tanpa ZooKeeper.
- **Apache Pulsar**: Lebih modern dari Kafka (multi-tenancy, tiered storage).
- **Kelemahan Utama**: Membutuhkan operasional (Ops) yang berat dan memori besar.
- **Cocok Untuk**: Jika Jejak Marga berkembang menjadi platform global dengan jutaan event per detik.

---

## 3. Rekomendasi untuk Jejak Marga

Mengingat fase proyek saat ini, saya menyarankan **Pendekatan Bertahap (Phased Approach)**:

### Fase 1: Optimasi Database (Rekomendasi Utama)
Gunakan **PostgreSQL-based queue** (seperti `pg-boss` atau library berbasis MIT lainnya). 
> **Alasan**: Anda tidak perlu membayar hosting tambahan untuk Redis/Kafka. Data antrean tugas aman di dalam DB yang sama dengan silsilah.

### Fase 2: Real-time Scale-up
Jika fitur chat atau interaksi antar user meledak, beralih ke **NATS JetStream** atau **Redis Streams**. 
> **Alasan**: Lisensi MIT memberikan keamanan hukum total, dan latensinya jauh lebih rendah daripada database.

### Fase 3: Enterprise Streaming
Gunakan **Apache Pulsar** hanya jika kita mulai memproses data silsilah raksasa yang membutuhkan sistem *pub-sub* antar benua.

---

## 4. Rencana Implementasi (Tahapan Eksperimen)

1. **Eksperimen Background Jobs**: Mencoba memindahkan proses pembuatan PDF atau pengolahan gambar ke antrean background menggunakan tabel Postgres.
2. **Evaluasi Redis**: Menyiapkan layer Redis untuk caching dan antrean ringan jika performa DB mulai terbebani.

---
*Dibuat oleh Antigravity (Assistant) untuk Jejak Marga pada 13 April 2026.*
