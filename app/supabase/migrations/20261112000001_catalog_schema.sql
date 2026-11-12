-- Migration: 20261112000001_catalog_schema.sql
-- Description: Schema for categories and products with public read RLS and admin-only management

-- 1. Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  slug text not null unique check (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  icon text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_slug on public.categories(slug);
create index if not exists idx_categories_is_active on public.categories(is_active);

drop trigger if exists tr_categories_updated_at on public.categories;
create trigger tr_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

-- 2. Products Table
-- Price stored as integer (in IDR rupiah, no decimals)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  title text not null check (char_length(trim(title)) >= 3),
  slug text not null unique check (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null,
  price integer not null check (price >= 1000),
  status text not null check (status in ('draft', 'published', 'archived')) default 'draft',
  transfer_terms text not null default 'Produk ini merupakan barang digital resmi yang dapat dipindahtangankan secara sah sesuai ketentuan penyedia layanan.',
  retention_notice text not null default 'Kredensial produk digital yang Anda terima akan disimpan secara aman dan otomatis dihapus secara permanen 30 hari setelah pesanan berhasil diserahkan.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_status on public.products(status);
create index if not exists idx_products_price on public.products(price);

drop trigger if exists tr_products_updated_at on public.products;
create trigger tr_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();

-- 3. Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- 4. RLS Policies for Categories
-- Public read: Anyone (including anonymous) can view active categories
drop policy if exists "Anyone can view active categories" on public.categories;
create policy "Anyone can view active categories"
  on public.categories
  for select
  using (is_active = true or public.is_admin());

-- Admin write: Only admins can insert, update, or delete categories
drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 5. RLS Policies for Products
-- Public read: Anyone can view published products
drop policy if exists "Anyone can view published products" on public.products;
create policy "Anyone can view published products"
  on public.products
  for select
  using (status = 'published' or public.is_admin());

-- Admin write: Only admins can insert, update, or delete products
drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
  on public.products
  for all
  using (public.is_admin())
  with check (public.is_admin());

