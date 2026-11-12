-- Migration: 20261112000000_initial_schema.sql
-- Description: Initial schema for profiles and trusted user_roles with strict RLS

-- 1. Create updated_at trigger helper
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) >= 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists tr_profiles_updated_at on public.profiles;
create trigger tr_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 3. User Roles Table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('buyer', 'admin')) default 'buyer',
  created_at timestamptz not null default now(),
  constraint uq_user_roles_user_role unique (user_id, role)
);

create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role on public.user_roles(role);

-- 4. Helper function to check admin role securely (SECURITY DEFINER)
create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean as $$
begin
  if check_user_id is null then
    return false;
  end if;

  return exists (
    select 1
    from public.user_roles
    where user_id = check_user_id
      and role = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- 5. Automatic Profile and Default Role Creation Trigger
create or replace function public.handle_new_user()
returns trigger as $$
declare
  raw_name text;
begin
  raw_name := coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'User');

  -- Create public profile
  insert into public.profiles (id, display_name)
  values (new.id, raw_name)
  on conflict (id) do nothing;

  -- Assign default 'buyer' role. Admin role can NEVER be assigned here.
  insert into public.user_roles (user_id, role)
  values (new.id, 'buyer')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;

-- 7. RLS Policies for Profiles
drop policy if exists "Users can view own profile or admin can view all" on public.profiles;
create policy "Users can view own profile or admin can view all"
  on public.profiles
  for select
  using (
    auth.uid() = id
    or public.is_admin()
  );

drop policy if exists "Users can update own display_name" on public.profiles;
create policy "Users can update own display_name"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- 8. RLS Policies for User Roles
drop policy if exists "Users can view own roles or admin can view all" on public.user_roles;
create policy "Users can view own roles or admin can view all"
  on public.user_roles
  for select
  using (
    auth.uid() = user_id
    or public.is_admin()
  );

-- No public insert/update/delete policies are granted on user_roles.
-- Only Service Role or trusted server-side operations can modify user_roles.

