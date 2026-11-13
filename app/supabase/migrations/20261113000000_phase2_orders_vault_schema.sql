-- Migration: 20261113000000_phase2_orders_vault_schema.sql
-- Description: Phase 2 schema for orders, order_items, vault_credentials (with soft-delete retention), and audit_logs

-- 1. Orders Table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique check (char_length(trim(order_number)) >= 8),
  buyer_id uuid not null references auth.users(id) on delete restrict,
  status text not null check (status in ('pending', 'processing', 'paid', 'cancelled', 'expired', 'failed')) default 'pending',
  total_amount integer not null check (total_amount >= 1000),
  payment_gateway text not null default 'mock' check (payment_gateway in ('mock', 'midtrans', 'xendit', 'qris')),
  payment_method text,
  payment_ref text,
  paid_at timestamptz,
  cancelled_at timestamptz,
  expires_at timestamptz not null default (now() + interval '1 hour'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_buyer_id on public.orders(buyer_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_order_number on public.orders(order_number);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

drop trigger if exists tr_orders_updated_at on public.orders;
create trigger tr_orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- 2. Order Items Table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1 check (quantity >= 1 and quantity <= 10),
  price_at_purchase integer not null check (price_at_purchase >= 1000),
  product_title text not null check (char_length(trim(product_title)) >= 1),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- 3. Vault Credentials Table (with 30-Day Soft-Delete Retention Support)
create table if not exists public.vault_credentials (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete restrict,
  order_id uuid references public.orders(id) on delete set null,
  order_item_id uuid references public.order_items(id) on delete set null,
  buyer_id uuid references auth.users(id) on delete restrict,
  credential_type text not null default 'account' check (credential_type in ('account', 'license_key', 'token', 'other')),
  label text,
  ciphertext text,
  iv text,
  tag text,
  key_id text not null default 'v1',
  status text not null check (status in ('available', 'reserved', 'delivered', 'purged')) default 'available',
  delivered_at timestamptz,
  purge_at timestamptz,
  purged_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vault_credentials_product_id on public.vault_credentials(product_id);
create index if not exists idx_vault_credentials_order_id on public.vault_credentials(order_id);
create index if not exists idx_vault_credentials_buyer_id on public.vault_credentials(buyer_id);
create index if not exists idx_vault_credentials_status on public.vault_credentials(status);
create index if not exists idx_vault_credentials_deleted_at on public.vault_credentials(deleted_at);

-- Partial index for available inventory allocation
create index if not exists idx_vault_credentials_available
  on public.vault_credentials(product_id, status)
  where status = 'available' and deleted_at is null;

-- Partial index for 30-day retention purge worker
create index if not exists idx_vault_credentials_retention_queue
  on public.vault_credentials(purge_at)
  where status = 'delivered' and deleted_at is null and purge_at is not null;

drop trigger if exists tr_vault_credentials_updated_at on public.vault_credentials;
create trigger tr_vault_credentials_updated_at
  before update on public.vault_credentials
  for each row execute function public.handle_updated_at();

-- 4. Audit Logs Table (Immutable audit trail)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_role text not null default 'buyer',
  action text not null check (char_length(trim(action)) >= 2),
  resource_type text not null check (char_length(trim(resource_type)) >= 2),
  resource_id text not null,
  ip_address text,
  user_agent text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_resource on public.audit_logs(resource_type, resource_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);

-- 5. Helper Function: Soft-delete and purge expired credentials (Retention Worker)
create or replace function public.soft_delete_expired_vault_credentials()
returns table(purged_id uuid, purged_order_id uuid, purged_buyer_id uuid) as $$
begin
  return query
  update public.vault_credentials
  set
    status = 'purged',
    deleted_at = coalesce(deleted_at, now()),
    purged_at = coalesce(purged_at, now()),
    ciphertext = null,
    iv = null,
    tag = null,
    updated_at = now()
  where
    status = 'delivered'
    and deleted_at is null
    and purge_at is not null
    and purge_at <= now()
  returning id, order_id, buyer_id;
end;
$$ language plpgsql security definer set search_path = public;

-- 6. Enable Row Level Security (RLS)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.vault_credentials enable row level security;
alter table public.audit_logs enable row level security;

-- 7. RLS Policies: Orders
drop policy if exists "Buyers can view their own orders" on public.orders;
create policy "Buyers can view their own orders"
  on public.orders
  for select
  using (buyer_id = (select auth.uid()) or public.is_admin());

drop policy if exists "Buyers can insert their own orders" on public.orders;
create policy "Buyers can insert their own orders"
  on public.orders
  for insert
  with check (buyer_id = (select auth.uid()) or public.is_admin());

drop policy if exists "Admins can manage all orders" on public.orders;
create policy "Admins can manage all orders"
  on public.orders
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 8. RLS Policies: Order Items
drop policy if exists "Buyers can view items of their own orders" on public.order_items;
create policy "Buyers can view items of their own orders"
  on public.order_items
  for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.buyer_id = (select auth.uid()) or public.is_admin())
    )
  );

drop policy if exists "Buyers can insert items for their own orders" on public.order_items;
create policy "Buyers can insert items for their own orders"
  on public.order_items
  for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.buyer_id = (select auth.uid()) or public.is_admin())
    )
  );

drop policy if exists "Admins can manage all order items" on public.order_items;
create policy "Admins can manage all order items"
  on public.order_items
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 9. RLS Policies: Vault Credentials
-- Buyers can only view credentials delivered to them (including soft-deleted records for audit history)
-- Plain text/ciphertext is inaccessible for available/reserved stock
drop policy if exists "Buyers can view their delivered vault items" on public.vault_credentials;
create policy "Buyers can view their delivered vault items"
  on public.vault_credentials
  for select
  using (
    (buyer_id = (select auth.uid()) and status in ('delivered', 'purged'))
    or public.is_admin()
  );

drop policy if exists "Admins can manage all vault credentials" on public.vault_credentials;
create policy "Admins can manage all vault credentials"
  on public.vault_credentials
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- 10. RLS Policies: Audit Logs
drop policy if exists "Users can view their own audit logs" on public.audit_logs;
create policy "Users can view their own audit logs"
  on public.audit_logs
  for select
  using (
    actor_id = (select auth.uid())
    or public.is_admin()
  );

drop policy if exists "Authenticated users can insert audit logs" on public.audit_logs;
create policy "Authenticated users can insert audit logs"
  on public.audit_logs
  for insert
  with check (
    (actor_id = (select auth.uid()))
    or public.is_admin()
  );
