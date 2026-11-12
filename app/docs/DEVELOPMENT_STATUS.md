# Status Pengembangan TokoUcan

**Fase Berjalan:** Phase 1 — Marketplace Catalog & Product Management  
**Tanggal Verifikasi:** 12 November 2026

## 1. Item Selesai (Completed)

### Phase 0: Project & Backend Foundation
- [x] Inisialisasi SvelteKit 3 + TypeScript pada folder `/tokoucan/app`.
- [x] Konfigurasi Tailwind CSS v4 dan shadcn-svelte komponen (`button`).
- [x] Konfigurasi ESLint, Prettier, dan TypeScript strict mode.
- [x] Inisialisasi Git repository pada remote `https://github.com/nanoonauu/TokoUcan.git` (branch `main`).
- [x] Konfigurasi `.gitignore` root yang memastikan hanya folder `/app` yang ditrack ke GitHub.
- [x] Konfigurasi Supabase SSR (`@supabase/ssr` 0.12.x) pada `hooks.server.ts` dan `+layout.ts`.
- [x] Rute autentikasi: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/reset-password`.
- [x] Rute terproteksi: `/dashboard` dengan redirect otomatis bagi tamu (anonymous).
- [x] Skema migrasi database awal: `profiles` dan `user_roles` dengan RLS ketat.

### Phase 1: Marketplace Catalog
- [x] Skema migrasi database: `categories` dan `products` (`supabase/migrations/20261112000001_catalog_schema.sql`).
- [x] RLS policies catalog: publik hanya dapat membaca `published` & `is_active`, write terbatas untuk admin.
- [x] Skema validasi Zod untuk kategori, produk, dan parameter pencarian katalog (`src/lib/schemas/catalog.ts`).
- [x] Server helper untuk fetching katalog publik dengan search, category filter, sorting, dan pagination (`src/lib/server/catalog.ts`).
- [x] Komponen UI `ProductCard` dengan format rupiah, badge kelayakan transfer, dan notice retensi 30 hari.
- [x] Halaman katalog publik `/products` dengan bilah pencarian, filter kategori, dan pagination.
- [x] Halaman detail produk `/products/[slug]` dengan deskripsi, syarat transfer, alert retensi 30 hari, dan CTA order.

## 2. Item Menunggu Tindakan Pengguna (Pending User Action)

- [ ] **Kredensial Supabase**: Masukkan kredensial project Supabase asli ke dalam file `app/.env`.
- [ ] **Eksekusi Migrasi SQL**: Jalankan file migrasi di SQL Editor Supabase:
  1. `app/supabase/migrations/20261112000000_initial_schema.sql` (Phase 0)
  2. `app/supabase/migrations/20261112000001_catalog_schema.sql` (Phase 1)

## 3. Hasil Validasi Kode Lokal (Automated Tests & Checks)

| Perintah | Hasil | Keterangan |
|---|---|---|
| `pnpm check` | **LULUS** (0 error, 0 warning) | Tipe data TypeScript SvelteKit 3 sinkron |
| `pnpm lint` | **LULUS** | Prettier & ESLint bebas peringatan |
| `pnpm build` | **LULUS** | Bundle produksi client & SSR berhasil dibangun |
