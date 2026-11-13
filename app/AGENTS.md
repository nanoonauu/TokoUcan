# AI Coding Agent Guidelines for TokoUcan

Dokumen ini berisi instruksi dan aturan wajib untuk setiap coding agent (AI) yang bekerja pada repositori TokoUcan.

## 1. Aturan Semantic HTML & Aksesibilitas (NON-NEGOTIABLE)

Setiap pembuatan atau pembaruan halaman, komponen, atau layout UI **WAJIB**:

1. Menggunakan **Semantic HTML**:
   - Landmark: `<header>`, `<nav>`, `<main id="main-content" tabindex="-1">`, `<section>`, `<article>`, `<aside>`, `<footer>`.
   - Heading hierarchy: Tepat satu `<h1>` per halaman, diikuti `<h2>`, `<h3>` berurutan tanpa lompatan tingkatan.
   - Menggunakan `<button>` untuk aksi dan `<a>` untuk navigasi. DILARANG menggunakan `<div onclick="...">`.
   - Menggunakan `<ol>` dan `<li>` untuk alur proses berurutan (misal cara kerja, multi-step checkout).
2. Memenuhi **Aksesibilitas (WCAG 2.1 AA) & ARIA**:
   - Semua tombol/link hanya ikon **wajib** memiliki `aria-label` deskriptif.
   - Semua input form (`<input>`, `<select>`, `<textarea>`) **wajib** memiliki `<label for="...">` atau `<label class="sr-only">`.
   - Semua tag `<nav>` **wajib** memiliki `aria-label` pembeda (contoh: `aria-label="Navigasi utama"`).
   - Tautan halaman aktif **wajib** memiliki `aria-current="page"`.
   - State terbuka/tutup (drawer, menu, modal) **wajib** memiliki `aria-expanded` dan `aria-controls`.
   - Ikon dekoratif diberi `aria-hidden="true"`.
3. Indikator fokus keyboard: Semua elemen interaktif wajib memiliki `focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none`.

Detail lengkap lihat: `docs/FRONTEND_STANDARDS.md`.

## 2. Batasan Workspace & Scope File

- Kode aplikasi hanya berada di dalam direktori `app/`.
- Jangan menyentuh atau memindahkan file di luar `app/` (seperti `accountra/`).
- Jangan pernah meng-commit kredensial sensitif atau file `.env`.
- Seluruh environment variables SvelteKit 3 harus didefinisikan melalui `src/env.ts` (`defineEnvVars`).

## 3. Verifikasi Kode

Sebelum menyatakan tugas selesai:

- `pnpm --dir app check` (0 error, 0 warning)
- `pnpm --dir app lint` (ESLint & Prettier clean)
- `pnpm --dir app build` (Sukses kompilasi bundle produksi)
