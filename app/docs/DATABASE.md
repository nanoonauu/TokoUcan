# Dokumentasi Database & RLS TokoUcan

## 1. Schema Basis Data

### Tabel `public.profiles`
Menyimpan informasi profil publik pengguna.
- `id` (`uuid`, Primary Key): Terhubung secara relasional ke `auth.users(id)` dengan opsi `ON DELETE CASCADE`.
- `display_name` (`text`): Nama tampilan akun pengguna (panjang minimal 2 karakter).
- `created_at` (`timestamptz`): Waktu pendaftaran akun (default `now()`).
- `updated_at` (`timestamptz`): Waktu pembaruan profil terakhir (diperbarui otomatis oleh trigger).

### Tabel `public.user_roles`
Menyimpan penetapan peran (role) pengguna secara tepercaya.
- `id` (`uuid`, Primary Key): Pengenal unik catatan role (default `gen_random_uuid()`).
- `user_id` (`uuid`, Foreign Key): Terhubung ke `auth.users(id)` dengan opsi `ON DELETE CASCADE`.
- `role` (`text`): Hak akses pengguna (`buyer` atau `admin`).
- `created_at` (`timestamptz`): Waktu pemberian role.
- Constraint unik: `(user_id, role)`.

### Tabel `public.categories` (Phase 1)
Menyimpan kategori barang digital yang sah.
- `id` (`uuid`, Primary Key): Pengenal unik kategori.
- `name` (`text`): Nama kategori (min 2 karakter).
- `slug` (`text`, Unique): Slug URL kebab-case.
- `description` (`text`, Nullable): Deskripsi kategori.
- `icon` (`text`, Nullable): Nama ikon atau identifier.
- `sort_order` (`integer`): Urutan tampilan kategori (default `0`).
- `is_active` (`boolean`): Status aktif kategori.
- `created_at` (`timestamptz`), `updated_at` (`timestamptz`).

### Tabel `public.products` (Phase 1)
Menyimpan item produk digital resmi.
- `id` (`uuid`, Primary Key): Pengenal unik produk.
- `category_id` (`uuid`, Foreign Key): Terhubung ke `public.categories(id)` (`ON DELETE RESTRICT`).
- `title` (`text`): Judul produk (min 3 karakter).
- `slug` (`text`, Unique): Slug URL kebab-case.
- `description` (`text`): Deskripsi lengkap produk.
- `price` (`integer`): Harga dalam IDR rupiah bulat (min `1000`).
- `status` (`text`): Status produk (`draft`, `published`, `archived`).
- `transfer_terms` (`text`): Pernyataan legalitas pemindahtanganan akun/lisensi resmi.
- `retention_notice` (`text`): Pernyataan retensi pemusnahan kredensial 30 hari.
- `created_at` (`timestamptz`), `updated_at` (`timestamptz`).

## 2. Row Level Security (RLS) Policies

### Kebijakan `public.profiles`
| Operasi | Policy Name | Aturan Akses |
|---|---|---|
| SELECT | Users can view own profile or admin can view all | `auth.uid() = id OR public.is_admin()` |
| UPDATE | Users can update own display_name | `auth.uid() = id` (Hanya profil miliknya) |
| INSERT | Users can insert own profile | `auth.uid() = id` |

### Kebijakan `public.user_roles`
| Operasi | Policy Name | Aturan Akses |
|---|---|---|
| SELECT | Users can view own roles or admin can view all | `auth.uid() = user_id OR public.is_admin()` |
| INSERT | *Tidak ada policy publik* | Hanya Service Role / Database Admin |
| UPDATE | *Tidak ada policy publik* | Hanya Service Role / Database Admin |
| DELETE | *Tidak ada policy publik* | Hanya Service Role / Database Admin |

### Kebijakan `public.categories` & `public.products` (Phase 1)
| Tabel | Operasi | Policy Name | Aturan Akses |
|---|---|---|---|
| `categories` | SELECT | Anyone can view active categories | `is_active = true OR public.is_admin()` |
| `categories` | ALL | Admins can manage categories | `public.is_admin()` |
| `products` | SELECT | Anyone can view published products | `status = 'published' OR public.is_admin()` |
| `products` | ALL | Admins can manage products | `public.is_admin()` |

> **Catatan Keamanan:** Pengguna non-admin hanya dapat membaca produk yang berstatus `published` dan kategori yang `is_active`. Operasi penambahan dan pengubahan produk dibatasi secara mutlak pada level RLS untuk admin saja.
