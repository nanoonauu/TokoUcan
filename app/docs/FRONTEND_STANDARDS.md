# Standar Semantic HTML & Aksesibilitas (UI/UX) TokoUcan

Dokumen ini adalah pedoman wajib bagi setiap developer dan coding agent dalam merancang, membuat, maupun memperbarui halaman, layout, dan komponen UI di TokoUcan.

---

## 1. Prinsip Utama Semantic HTML

Setiap elemen harus menggunakan tag HTML sesuai makna fungsional aslinya:

1. **Struktur Tata Letak Utama**:
   - `<header>`: Untuk area navigasi atas atau tajuk section.
   - `<nav>`: Untuk setiap blok kumpulan tautan navigasi.
   - `<main>`: Untuk area konten utama halaman. Wajib memiliki `id="main-content"` dan `tabindex="-1"`.
   - `<section>`: Untuk membagi blok konten tematik (wajib memiliki heading terkait).
   - `<article>`: Untuk entitas mandiri yang bisa didistribusikan secara terpisah (misalnya kartu produk, ulasan, atau artikel).
   - `<aside>`: Untuk konten pelengkap di luar alur utama (misalnya sidebar filter, notifikasi banner).
   - `<footer>`: Untuk kaki halaman atau penutup section.

2. **Hierarki Judul (Heading Hierarchy)**:
   - Tepat satu `<h1>` per halaman yang mencerminkan inti halaman tersebut.
   - Gunakan `<h2>` untuk sub-bagian langsung di bawah `<h1>`.
   - Gunakan `<h3>` untuk sub-item di dalam `<h2>` (seperti judul kartu produk di dalam grid section).
   - **Dilarang melompati level heading** (misalnya dari `<h1>` langsung ke `<h4>`). Jangan menggunakan tag heading hanya untuk styling ukuran teks.

3. **Elemen Interaktif & Larangan Div Clickable**:
   - Gunakan `<button type="button|submit">` untuk pemicu aksi (membuka modal, toggle menu, submit data).
   - Gunakan `<a href="...">` untuk navigasi antar halaman atau URL.
   - **Dilarang keras** membuat elemen `<div onclick="...">` atau `<span onclick="...">` sebagai pengganti tombol/link tanpa alasan teknis yang sah.

4. **Daftar & Alur Langkah**:
   - Gunakan `<ol>` dan `<li>` untuk alur langkah berurutan (misal proses checkout, tutorial cara kerja 1-2-3).
   - Gunakan `<ul>` dan `<li>` untuk kumpulan daftar item/kategori/keunggulan.

---

## 2. Pedoman Aksesibilitas (WCAG 2.1 AA) & ARIA

### A. Accessible Name (`aria-label` & Label Form)

1. **Icon Button & Tautan Visual**:
   Setiap tombol atau tautan yang hanya berisi ikon SVG tanpa teks visual **WAJIB** menyertakan `aria-label` atau teks tersembunyi (`sr-only`).
   _Contoh:_

   ```svelte
   <button type="button" aria-label="Buka menu navigasi" onclick={toggleMenu}>
   	<svg ...></svg>
   </button>
   ```

2. **Form & Input Controls**:
   Semua input (`<input>`, `<select>`, `<textarea>`) wajib memiliki pasangan `<label>` eksplisit dengan atribut `for="id-input"`. Jika label tidak diinginkan secara visual pada desain, gunakan class utilitas `sr-only`.
   _Contoh:_

   ```svelte
   <label for="search-input" class="sr-only">Cari produk</label>
   <input id="search-input" type="search" name="q" placeholder="Cari..." />
   ```

3. **Pembeda Navigasi Ganda (`aria-label` pada `<nav>`)**:
   Jika dalam satu halaman terdapat lebih dari satu tag `<nav>`, setiap tag `<nav>` wajib memiliki `aria-label` yang spesifik:
   - `<nav aria-label="Navigasi utama">`
   - `<nav aria-label="Navigasi menu seluler">`
   - `<nav aria-label="Navigasi halaman katalog">`
   - `<nav aria-label="Breadcrumb">`
   - `<nav aria-label="Tautan footer marketplace">`

### B. Status Interaktif & Dynamic State

1. **Dropdown, Drawer & Accordion**:
   - Pemicu wajib memiliki atribut `aria-expanded={isOpen}`.
   - Pemicu wajib memiliki atribut `aria-controls="id-target-drawer"`.
   - Kontainer drawer/target wajib memiliki atribut `id="id-target-drawer"`.

2. **Indikator Halaman Aktif**:
   Tautan navigasi yang sedang aktif pada rute halaman saat ini wajib memiliki `aria-current="page"`.

3. **Skip to Main Content**:
   Setiap layout root wajib menyediakan mekanisme bypass navigasi:

   ```svelte
   <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed ...">
   	Lewati ke konten utama
   </a>
   ```

4. **Ikon Dekoratif**:
   Ikon SVG yang sifatnya murni ilustrasi atau berdampingan dengan teks label harus diberi `aria-hidden="true"`.

---

## 3. UI/UX, Keyboard & Focus State

1. **Visible Focus Indicator**:
   Semua elemen interaktif yang dapat difokuskan wajib memiliki indikator fokus yang jelas saat navigasi keyboard (`Tab`):
   ```html
   class="focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
   ```
2. **Kontras Warna**:
   Rasio kontras teks terhadap latar belakang minimal **4.5:1** untuk teks standar dan **3:1** untuk teks besar/badge bold.
3. **Motion**:
   Hormati preferensi pengguna dengan `motion-reduce:transition-none` atau transisi halus yang tidak memicu motion sickness.

---

## 4. Checklist Verifikasi Sebelum Selesai

Sebelum sebuah halaman atau komponen dianggap selesai:

- [ ] Tag HTML menggunakan elemen semantik (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- [ ] Heading terstruktur rapi: hanya satu `<h1>`, disusul `<h2>` dan `<h3>`.
- [ ] Semua tombol/ikon tanpa teks visual memiliki `aria-label`.
- [ ] Semua input form memiliki `<label for="...">` (atau `class="sr-only"`).
- [ ] Semua grup `<nav>` memiliki `aria-label` pembeda.
- [ ] State dinamis (`aria-expanded`, `aria-current="page"`) telah diatur.
- [ ] Navigasi keyboard (`Tab`, `Shift+Tab`, `Enter`, `Space`) berfungsi tanpa jebakan fokus (_focus trap_ tak disengaja).
- [ ] Lolos validasi `pnpm check` dan `pnpm lint`.
