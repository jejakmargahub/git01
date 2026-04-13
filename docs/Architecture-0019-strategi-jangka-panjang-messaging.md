# Architecture-0019 - Strategi Jangka Panjang & Optimasi Neon Free ðŸ“ˆðŸ˜

Dokumen ini menjelaskan bagaimana mengelola sistem messaging/queue pada database PostgreSQL tanpa menghabiskan kuota penyimpanan **Neon Free Tier (500MB)** dan bagaimana merencanakan migrasi ke sistem lain di masa depan.

## 1. Optimasi Penyimpanan (Neon Free Tier Friendly)

Operasi antrean (queue) yang sibuk menghasilkan banyak data "sampah" (*dead tuples*) karena proses `INSERT` dan `DELETE` yang cepat. Di Neon Free Tier, ruang 500MB bisa cepat habis jika tidak dikelola.

### Strategi "Zero-Growth":
- **Immediate Pruning**: Konfigurasikan sistem (misal: `pg-boss` atau custom worker) untuk langsung menghapus baris data segera setelah tugas statusnya menjadi `completed`. 
- **Agresif Cleanup**: Gunakan perintah `TRUNCATE` alih-alih `DELETE` untuk membersihkan log lama jika diperlukan, karena `TRUNCATE` langsung mengembalikan ruang ke sistem file.
- **Partial Indexing**: Hanya buat index pada job yang statusnya `pending`. Ini menjaga ukuran index tetap sangat kecil (beberapa KB saja).
  ```sql
  CREATE INDEX idx_active_jobs ON jobs (priority, created_at) 
  WHERE status = 'pending';
  ```

---

## 2. Toggle Audit & Histori Tugas

Sesuai permintaan Anda, fungsi audit dirancang agar bisa dinonaktifkan sementara untuk menghemat ruang.

### Skema Desain:
1. **Tabel Antrean (`jobs`)**: Hanya berisi tugas yang sedang berjalan.
2. **Tabel Arsip/Audit (`jobs_archive`)**: Opsional. Tempat memindahkan data dari tabel `jobs` setelah selesai.

### Cara Menonaktifkan Audit:
Di aplikasi Next.js, tambahkan variabel lingkungan (env):
```env
ENABLE_JOB_AUDIT=false
```
**Logika Worker**:
```typescript
if (process.env.ENABLE_JOB_AUDIT === 'true') {
  // Pindahkan ke tabel archive sebelum dihapus
  await db.insert(jobsArchive).values(completedJob);
}
// Selalu hapus dari tabel utama untuk hemat space
await db.delete(jobs).where(eq(jobs.id, jobId));
```
> [!TIP]
> Saat ingin menyalakan audit lagi, Anda cukup mengubah env ke `true`. Histori baru akan mulai tercatat tanpa perlu migrasi database ulang.

---

## 3. Strategi Migrasi (The Exit Strategy)

Agar di masa depan Anda bisa pindah ke **NATS**, **Redis Streams**, atau **Kafka** dengan mudah, gunakan pola **Interface Abstraction**.

### Jangan Lakukan Ini (Hard-Coupled):
```typescript
// Salah: Kode bisnis memanggil DB queue langsung
await db.insert(jobs).values({ type: 'SEND_EMAIL', data: '...' });
```

### Lakukan Ini (Abstracted):
Buatlah sebuah *Messaging Service*:
```typescript
interface QueueService {
  publish(topic: string, data: any): Promise<void>;
}

// Implementasi saat ini menggunakan Postgres
class PostgresQueue implements QueueService { ... }

// Implementasi masa depan menggunakan NATS
class NatsQueue implements QueueService { ... }
```
**Keuntungan**: Saat Anda pindah ke NATS, Anda hanya mengganti satu file implementasi saja. Kode silsilah keluarga Anda tidak akan berubah.

---

## 4. Ambang Batas Skalabilitas (Kapan Harus Pindah?)

Anda harus mulai mempertimbangkan untuk pindah dari PostgreSQL ke sistem khusus (Dedicated Broker) jika:
1. **Throughput Tinggi**: Menampung lebih dari 100-500 tugas per detik secara konsisten.
2. **Database Load**: CPU database Anda sering mencapai 80-90% hanya untuk mengurus tabel antrean.
3. **Storage Limit**: Meskipun sudah diprune, tabel antrean tumbuh terlalu cepat dan mengancam data utama silsilah keluarga.

---
*Dibuat oleh Antigravity (Assistant) untuk Jejak Marga pada 13 April 2026.*
