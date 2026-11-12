# Pedoman Keamanan TokoUcan

## 1. Pemisahan Environment Variables

- **Variabel Publik (`$env/dynamic/public`)**:
  - `PUBLIC_SUPABASE_URL`: Alamat endpoint Supabase project. Aman dipublikasikan ke klien.
  - `PUBLIC_SUPABASE_ANON_KEY`: Kunci anonim dengan izin akses publik yang dibatasi oleh RLS.
- **Variabel Rahasia Server (`$env/dynamic/private`)**:
  - `SUPABASE_SERVICE_ROLE_KEY`: Kunci bypass RLS. Hanya boleh diakses di runtime server (`src/lib/server/supabase-admin.ts`) untuk background worker.
  - `PAYMENT_SERVER_KEY`: Kunci server payment gateway.
  - `CREDENTIAL_ENCRYPTION_KEY`: Kunci utama enkripsi payload akun.

> Seluruh file rahasia (`.env`, `.env.*`) dikecualikan dari Git melalui `.gitignore`. Fungsi `validateSupabaseEnv()` memeriksa keberadaan variabel tanpa pernah mencetak atau membocorkan isi nilainya ke log.

## 2. Validasi Sesi & Otorisasi Server-Side

- Sesi browser diverifikasi menggunakan `auth.getUser()` pada setiap request rute terproteksi.
- Metadata pengguna (`raw_user_meta_data`) **tidak pernah** dijadikan sumber kebenaran untuk hak akses role. Otorisasi role selalu merujuk pada tabel `public.user_roles` melalui verifikasi basis data.

## 3. Rencana Desain Enkripsi Kredensial Akun (Phase 2)

- **Algoritma**: AES-256-GCM (Authenticated Encryption with Associated Data).
- **Integritas**: Menggunakan initialization vector (IV) unik 96-bit dan authentication tag 128-bit untuk setiap item yang dienkripsi.
- **Envelope Encryption**: Data Encryption Key (DEK) dihasilkan secara acak per-item pengiriman, dienkripsi dengan Key Encryption Key (KEK) utama, dan dihancurkan secara permanen saat masa retensi 30 hari berakhir.
- **Pemisahan Kunci**: Kunci master enkripsi disimpan pada environment server yang terisolasi, tidak disimpan berdampingan dalam bentuk teks biasa (plaintext) di tabel basis data.

## 4. Kebijakan Retensi 30 Hari

- Kredensial sensitif yang diserahterimakan kepada pembeli ditandai dengan timestamp `delivered_at`.
- Kolom batas waktu pemusnahan dihitung: `purge_at = delivered_at + INTERVAL '30 days'`.
- Worker cron terjadwal memusnahkan payload rahasia dan kunci enkripsi terkait saat batas waktu tercapai. Bukti transaksi dan catatan keuangan non-sensitif tetap disimpan untuk kebutuhan pembukuan resmi dan penanganan sengketa.
