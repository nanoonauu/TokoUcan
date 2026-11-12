# Arsitektur Sistem TokoUcan

Dokumen ini mendefinisikan batasan arsitektur frontend dan backend, alur autentikasi, dan batasan modul.

## 1. Batasan Lingkungan (Boundaries)

### Browser (Frontend)

- Menangani rendering halaman UI responsif menggunakan Svelte 5 runes (`$state`, `$props`, `$derived`).
- Hanya memiliki akses ke environment variables publik bertanda `PUBLIC_*` (URL dan Anon Key Supabase).
- Berkomunikasi melalui form action SvelteKit atau Supabase Client terautentikasi sesuai token sesi yang valid.
- Tidak pernah mengakses Service Role Key, rahasia gateway pembayaran, atau kunci enkripsi kredensial.

### SvelteKit Server (SSR)

- Mengelola validasi sesi server melalui `hooks.server.ts` menggunakan `@supabase/ssr`.
- Melakukan verifikasi keamanan dengan memanggil `auth.getUser()` pada setiap request terproteksi.
- Memvalidasi seluruh payload input form menggunakan Zod schemas di `src/lib/schemas/auth.ts`.
- Mencegah akses anonim ke rute terproteksi (`/dashboard`, `/admin`) dengan melempar HTTP 303 Redirect.

### Supabase Backend (PostgreSQL & Auth)

- Menyimpan identitas akun di skema `auth.users`.
- Menyimpan metadata akun publik di `public.profiles`.
- Menyimpan otorisasi hak akses di `public.user_roles` dengan proteksi Row Level Security (RLS).
- Memberikan privilege isolasi data antar pembeli secara ketat di level basis data.

## 2. Alur Autentikasi (Auth Flow)

1. **Pendaftaran (Register)**:
   - Pengguna mengirimkan form pendaftaran ke `/auth/register`.
   - Server memvalidasi kecocokan password dan format email menggunakan Zod.
   - Server memanggil `supabase.auth.signUp()`.
   - Trigger basis data `handle_new_user()` secara otomatis membuat baris pada `public.profiles` dan menetapkan role default `buyer` pada `public.user_roles`.

2. **Masuk (Login)**:
   - Pengguna mengirim kredensial ke `/auth/login`.
   - Server memvalidasi form dan memanggil `supabase.auth.signInWithPassword()`.
   - `@supabase/ssr` menulis cookie sesi terenkripsi dengan atribut `path=/`.
   - Pengguna diarahkan ke URL tujuan (`redirectTo`) atau `/dashboard`.

3. **Validasi Sesi (SSR Lifecycle)**:
   - `hooks.server.ts` membaca cookie sesi pada setiap request.
   - Fungsi `safeGetSession` memverifikasi integritas token sesi dengan Supabase Auth API.
   - Sesi dan entitas user disematkan ke `event.locals` untuk dikonsumsi oleh `+layout.server.ts` dan rute terkait.

4. **Keluar (Logout)**:
   - Request POST dikirimkan ke `/auth/logout`.
   - Server memanggil `supabase.auth.signOut()` yang menghapus cookie sesi.
   - Pengguna diarahkan kembali ke beranda.

## 3. Batasan Modul Sistem Mendatang

- **Enkripsi Kredensial (`src/lib/server/modules/encryption.ts`)**: Batas interface untuk enkripsi AES-256-GCM envelope encryption per record kredensial akun.
- **Integrasi Pembayaran (`src/lib/server/modules/payment.ts`)**: Batas interface untuk webhook idempotency & cryptographic signature validation Midtrans/Xendit.
- **Pengiriman Otomatis (`src/lib/server/modules/delivery.ts`)**: Batas interface untuk alokasi stok transaksional dengan row-level lock.
- **Pembersihan Retensi 30 Hari (`src/lib/server/modules/retention.ts`)**: Batas interface worker scheduled cron yang memusnahkan ciphertext kredensial tepat 30 hari pasca serah terima.
