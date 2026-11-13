# Status Pengembangan TokoUcan

**Status Saat Ini:** Phase 1 Selesai (Siap Masuk Phase 2)  
**Tanggal Verifikasi Terakhir:** 13 November 2026

---

## 1. Item Selesai (Completed)

### Phase 0: Project & Backend Foundation

- [x] Inisialisasi SvelteKit 3 + Svelte 5 + TypeScript pada folder `/tokoucan/app`.
- [x] Konfigurasi Tailwind CSS v4, shadcn-svelte komponen (`button`), dan penanganan `@theme` / `@custom-variant`.
- [x] Konfigurasi ESLint, Prettier, dan TypeScript strict mode (0 error, 0 warning).
- [x] Inisialisasi Git repository pada remote `https://github.com/nanoonauu/TokoUcan.git` (branch `main`).
- [x] Konfigurasi `.gitignore` root yang memastikan hanya folder `/app` yang ditrack ke GitHub.
- [x] Konfigurasi Supabase SSR (`@supabase/ssr` 0.12.x) pada `hooks.server.ts` dan `+layout.ts`.
- [x] Rute autentikasi: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/reset-password`.
- [x] Rute terproteksi: `/dashboard` dengan redirect otomatis bagi pengunjung anonim.
- [x] Skema migrasi database awal: `profiles` dan `user_roles` dengan proteksi Row Level Security (RLS).

### Phase 1: Marketplace Catalog & UI/UX Foundation

- [x] Skema migrasi database: tabel `categories` dan `products` (`supabase/migrations/20261112000001_catalog_schema.sql`).
- [x] Kebijakan RLS katalog: akses baca publik untuk produk published & aktif, akses tulis khusus role admin.
- [x] Validasi Zod: skema kategori, produk, dan query parameter pencarian/filter (`src/lib/schemas/catalog.ts`).
- [x] Server helper katalog: filter kategori, pencarian teks, pengurutan harga/waktu, dan pagination (`src/lib/server/catalog.ts`).
- [x] Komponen kartu produk: `ProductCard` dengan format rupiah, badge ketersediaan/legalitas, dan notice vault retensi 30 hari.
- [x] Halaman katalog `/products`: grid produk responsif, pencarian, filter kategori, pengurutan, dan navigasi pagination.
- [x] Halaman detail produk `/products/[slug]`: breadcrumb, deskripsi, ketentuan transferability, alert retensi 30 hari, dan CTA transaksi.
- [x] Redesain Beranda (`/`): hero pencarian cepat, 4 value pillars, showcase kategori, produk pilihan siap kirim, dan alur cara kerja sistem (How It Works).
- [x] Palet Warna Kustom: integrasi token warna `#F7AA00` (Gold), `#235784` (Deep Slate Navy/Primary), `#40A8C4` (Accent/Cyan), dan `#EEF6F7` (Pale Ice) pada tema terang dan gelap.
- [x] Redesain Header/Navbar: arsitektur 3 zona seimbang, tab navigasi mengambang (floating pills), eliminasi tombol cari redundant, serta perbaikan _high-contrast active state_ (`bg-primary text-primary-foreground`).
- [x] Penyeragaman Lebar Kontainer: header, body, dan footer presisi pada lebar seragam `max-w-6xl mx-auto px-4 sm:px-6`.
- [x] Standar Semantic HTML & Aksesibilitas (WCAG 2.1 AA):
  - Atribut bahasa dokumen `<html lang="id">`.
  - Tautan bypass aksesibilitas (_Skip to main content_).
  - Landmark semantik lengkap (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<ol>`, `<ul>`).
  - Label ARIA unik untuk seluruh grup navigasi, icon button, input form, serta state interaktif (`aria-expanded`, `aria-current="page"`).
- [x] Dokumentasi Standar Frontend: penambahan `app/docs/FRONTEND_STANDARDS.md` dan pedoman agen di `app/AGENTS.md`.

---

## 2. Rencana Phase 2: Checkout, Vault Kredensial & Pengiriman Otomatis

Berikut ruang lingkup yang akan dikerjakan pada Phase 2:

1. **Model Data Pesanan & Vault**:
   - Migrasi SQL untuk tabel `orders`, `order_items`, `vault_credentials`, dan `audit_logs`.
2. **Integrasi Gateway Pembayaran**:
   - Implementasi modul pembayaran (`src/lib/server/modules/payment.ts`) dengan verifikasi webhook idempotency (Midtrans/Xendit/QRIS).
3. **Enkripsi Kredensial Vault (AES-256-GCM)**:
   - Implementasi modul enkripsi (`src/lib/server/modules/encryption.ts`) untuk penyimpanan kredensial akun/lisensi secara aman per record.
4. **Alur Serah Terima Otomatis (Instant Delivery)**:
   - Modul alokasi stok transaksional (`src/lib/server/modules/delivery.ts`) saat pembayaran terkonfirmasi.
5. **Worker Pembersihan Retensi 30 Hari**:
   - Modul penghapusan ciphertext otomatis (`src/lib/server/modules/retention.ts`) tepat setelah masa retensi 30 hari berakhir.
6. **Halaman Buyer Dashboard**:
   - Riwayat pesanan, status alokasi vault, decrypt on-demand oleh pemilik akun, dan hitung mundur sisa hari retensi.

---

## 3. Catatan Tindakan Mandiri di Supabase (Opsional/Sebelum Go-Live)

1. **Jalankan File Migrasi SQL di Supabase SQL Editor**:
   - `app/supabase/migrations/20261112000000_initial_schema.sql` (Phase 0)
   - `app/supabase/migrations/20261112000001_catalog_schema.sql` (Phase 1)
2. **Kredensial `.env`**:
   - Pastikan `PUBLIC_SUPABASE_URL` dan `PUBLIC_SUPABASE_ANON_KEY` telah disetel pada `app/.env`.

---

## 4. Hasil Validasi Kode Lokal (Automated Tests & Checks)

| Perintah     | Hasil                          | Keterangan                                     |
| ------------ | ------------------------------ | ---------------------------------------------- |
| `pnpm check` | **LULUS** (0 error, 0 warning) | Tipe data TypeScript SvelteKit 3 sinkron       |
| `pnpm lint`  | **LULUS**                      | Prettier & ESLint bebas peringatan             |
| `pnpm build` | **LULUS**                      | Bundle produksi client & SSR berhasil dibangun |
