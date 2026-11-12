# Status Pengembangan TokoUcan

**Fase Berjalan:** Phase 0 — Project & Backend Foundation  
**Tanggal Verifikasi:** 12 November 2026

## 1. Item Selesai (Completed)

- [x] Inisialisasi SvelteKit + TypeScript pada folder `/tokoucan/app`.
- [x] Konfigurasi Tailwind CSS v4 dan shadcn-svelte komponen (`button`).
- [x] Konfigurasi ESLint, Prettier, dan TypeScript strict mode.
- [x] Inisialisasi Git repository dengan remote `https://github.com/nanoonauu/TokoUcan.git` dan user `nanoonauu` (`nanoona.uu@gmail.com`).
- [x] Konfigurasi `.gitignore` root yang memastikan hanya folder `/app` yang ditrack ke GitHub.
- [x] Konfigurasi Supabase SSR (`@supabase/ssr` 0.12.x) pada `hooks.server.ts` dan `+layout.ts`.
- [x] Penanganan cookie SSR yang aman dan tersinkronisasi.
- [x] Rute autentikasi: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/reset-password`.
- [x] Rute terproteksi: `/dashboard` dengan redirect otomatis bagi tamu (anonymous).
- [x] Skema migrasi awal PostgreSQL: `profiles` dan `user_roles` dengan trigger auto-create dan RLS ketat.
- [x] Pemisahan modul backend: `env.ts`, `supabase-admin.ts`, dan interface batasan modul (`encryption`, `payment`, `delivery`, `retention`).
- [x] Dokumentasi sistem lengkap (`README.md`, `ARCHITECTURE.md`, `DATABASE.md`, `SECURITY.md`).

## 2. Item Menunggu Tindakan Pengguna (Pending User Action)

- [ ] **Kredensial Supabase**: Buat project Supabase di [database.new](https://database.new) dan isi kredensial riil pada file `app/.env`:
  - `PUBLIC_SUPABASE_URL`
  - `PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **Eksekusi Migrasi SQL**: Salin dan jalankan file `app/supabase/migrations/20261112000000_initial_schema.sql` di SQL Editor Dashboard Supabase.

## 3. Item yang Diblokir (Blocked)

- Remote Auth Live Test: Tertunda hingga kredensial project Supabase asli dimasukkan ke `app/.env`.

## 4. Hasil Validasi Kode Lokal (Automated Tests & Checks)

| Perintah     | Hasil                            | Keterangan                                   |
| ------------ | -------------------------------- | -------------------------------------------- |
| `pnpm check` | **LULUS** (0 errors, 0 warnings) | Pemeriksaan tipe TypeScript SvelteKit sukses |
| `pnpm lint`  | **LULUS**                        | ESLint dan Prettier formatting rapi          |
| `pnpm build` | **LULUS**                        | Berhasil menghasilkan output build produksi  |
