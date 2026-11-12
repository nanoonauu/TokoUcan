# TokoUcan — Web Marketplace Barang Digital

TokoUcan adalah marketplace barang digital berbasis web dengan arsitektur SvelteKit SSR, Supabase PostgreSQL, dan Supabase Auth. Dilengkapi sistem pengiriman otomatis dan penyimpanan data sensitif dengan retensi 30 hari.

## Prasyarat Lingkungan (Prerequisites)

- **Node.js**: v22.x atau yang lebih baru
- **pnpm**: v10.x / v12.x
- **Git**: v2.50.x atau yang lebih baru
- **PowerShell 7** (direkomendasikan di Windows)

## Struktur Direktori

```text
tokoucan/
├── .git/                 # Git repository
├── .gitignore            # Root ignore (hanya /app yang ditrack ke GitHub)
├── accountra/            # Starter pack & requirements (diabaikan dari Git)
└── app/                  # Sumber kode project TokoUcan (SvelteKit)
    ├── docs/             # Dokumentasi arsitektur, database, keamanan, dan status
    ├── src/
    │   ├── lib/
    │   │   ├── components/ui/  # shadcn-svelte UI components
    │   │   ├── schemas/        # Zod validation schemas
    │   │   ├── server/         # Server-only modules (auth, env, module boundaries)
    │   │   └── utils.ts        # Helper utilitas UI (cn, tailwind-merge)
    │   └── routes/             # SvelteKit SSR routes & auth pages
    └── supabase/
        └── migrations/         # Database migrations & RLS policies
```

## Panduan Instalasi & Menjalankan Proyek

1. Masuk ke direktori `app`:

   ```powershell
   Set-Location E:\web-apps\tokoucan\app
   ```

2. Pasang dependensi jika belum:

   ```powershell
   pnpm install
   ```

3. Konfigurasikan Environment Variables:
   Salin `.env.example` menjadi `.env`:

   ```powershell
   Copy-Item .env.example .env
   ```

   Isi nilai kredensial Supabase dari project Supabase Anda:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Jalankan migrasi database di Supabase SQL Editor:
   Jalankan file `supabase/migrations/20261112000000_initial_schema.sql`.

5. Jalankan development server:

   ```powershell
   pnpm dev
   ```

6. Buka peramban di `http://localhost:5173`.

## Verifikasi & Validasi Kode

```powershell
pnpm check    # Validasi tipe TypeScript SvelteKit
pnpm lint     # Pemeriksaan ESLint & Prettier
pnpm build    # Produksi build test
```
