# Architecture-0004: Arsitektur Teknologi Jejak Marga ðŸ›ï¸

Dokumen ini merinci tumpukan teknologi (tech stack) yang digunakan dalam pengembangan aplikasi Silsilah Keluarga Jejak Marga.

## 1. Core Stack (Frontend & Backend)
- **Framework**: Next.js 16 (App Router & Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Premium Design System)
- **Authentication**: NextAuth.js v5 (Auth.js) - Google & OTP Email

## 2. Database & Storage
- **ORM**: Drizzle ORM
- **Database**: Neon PostgreSQL (Serverless)
- **Image Hosting**: ImageKit.io
- **Real-time**: Pusher (untuk fitur Chat)

## 3. Infrastruktur & Deployment
- **Hosting**: Vercel
- **Versioning**: Git (GitHub)
- **PWA**: Next-PWA dengan kapabilitas offline.

## 4. Standar Kode
- Server Actions (Next.js 16).
- Lazy Loading Database & Pusher (Build Security).
- Responsive Design & Glassmorphism UI.

*Terakhir diperbarui: 13-04-2026*
