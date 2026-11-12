# Dokumentasi Database & RLS TokoUcan

## 1. Schema Basis Data (Phase 0)

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

## 2. Row Level Security (RLS) Policies

### Kebijakan `public.profiles`

| Operasi | Policy Name                                      | Aturan Akses                              |
| ------- | ------------------------------------------------ | ----------------------------------------- |
| SELECT  | Users can view own profile or admin can view all | `auth.uid() = id OR public.is_admin()`    |
| UPDATE  | Users can update own display_name                | `auth.uid() = id` (Hanya profil miliknya) |
| INSERT  | Users can insert own profile                     | `auth.uid() = id`                         |

### Kebijakan `public.user_roles`

| Operasi | Policy Name                                    | Aturan Akses                                |
| ------- | ---------------------------------------------- | ------------------------------------------- |
| SELECT  | Users can view own roles or admin can view all | `auth.uid() = user_id OR public.is_admin()` |
| INSERT  | _Tidak ada policy publik_                      | Hanya Service Role / Database Admin         |
| UPDATE  | _Tidak ada policy publik_                      | Hanya Service Role / Database Admin         |
| DELETE  | _Tidak ada policy publik_                      | Hanya Service Role / Database Admin         |

> **Catatan Keamanan:** Pengguna biasa (buyer) tidak memiliki izin INSERT, UPDATE, atau DELETE pada tabel `user_roles`. Ini mencegah eskalasi hak istimewa (privilege escalation) secara mutlak di lapisan basis data.

## 3. Langkah Pengujian RLS (Verification Matrix)

1. **Anonymous User**:
   - Query `select * from public.profiles;` -> Mengembalikan 0 baris.
   - Query `select * from public.user_roles;` -> Mengembalikan 0 baris.
2. **Buyer A**:
   - Query `select * from public.profiles;` -> Hanya melihat profil milik Buyer A.
   - Query `update public.profiles set display_name = 'Test' where id = 'buyer-b-uuid';` -> Mengembalikan 0 baris diperbarui.
   - Query `insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');` -> Ditolak oleh RLS (error: new row violates row-level security policy).
3. **Buyer B**:
   - Tidak dapat melihat maupun mengubah baris milik Buyer A.
4. **Admin**:
   - Fungsi `public.is_admin()` mengembalikan `true`.
   - Mengizinkan pembacaan catatan seluruh pengguna untuk kebutuhan audit.
