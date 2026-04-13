# Guide-0024: Best Practices & Pencegahan Error ðŸ›¡ï¸

Dokumen ini berisi standar operasional untuk menjaga stabilitas aplikasi Jejak Marga dan mencegah kegagalan build di lingkungan produksi (Vercel).

## 1. Protokol Deployment (Protokol "GOGO")

Sebelum menjalankan `npm run gogo`, pastikan Anda melewati checklist ini:

- [ ] **Build Check**: Jalankan `npm run build` secara lokal. Pastikan tidak ada `Type error` atau `Syntax error`.
- [ ] **Database Check**: Jika ada perubahan skema, jalankan `npx drizzle-kit push`.
- [ ] **Env Check**: Pastikan semua variabel lingkungan baru sudah ditambahkan di dashboard Vercel.

## 2. Penulisan Kode yang Aman (Safety First)

### A. Inisialisasi Library Pihak Ketiga
Gunakan pola *Lazy Initialization* untuk library yang memerlukan API Key (seperti Resend atau Pusher) agar tidak merusak proses build-time.

**Salah (Top-Level):**
```typescript
const resend = new Resend(process.env.KEY); // Error jika KEY kosong saat build
```

**Benar (Inside Function):**
```typescript
export const sendEmail = async () => {
  const resend = new Resend(process.env.KEY); // Aman, hanya dipanggil saat runtime
  // ...
}
```

### B. Mock Data Consistency
Selalu update `src/lib/db/mock-data.ts` setiap kali ada perubahan pada `schema.ts`. Jika tipe data tidak sinkron, TypeScript akan menggagalkan build.

## 3. Strategi Versioning

Gunakan Git Tag untuk menandai versi stabil. Ini mempermudah restorasi sistem jika terjadi bencana data atau kode.

- `git tag -a v1.X.X-stable -m "Deskripsi perubahan"`
- `git push origin v1.X.X-stable`

---
> [!TIP]
> **Pesan Antigravity**: Kecepatan itu penting, tapi stabilitas adalah segalanya. Meluangkan 2 menit untuk build lokal bisa menyelamatkan 2 jam waktu perbaikan di produksi.

*Terakhir diperbarui: 13-04-2026*
