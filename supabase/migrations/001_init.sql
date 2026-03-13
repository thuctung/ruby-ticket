-- 001_init.sql
-- Core schema for Da Nang Ticket (profiles + affiliate applications) with RLS

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type public.user_role as enum ('customer','affiliate','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.account_status as enum ('pending','approved','suspended');
exception when duplicate_object then null; end $$;

-- Profiles (1-1 with auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text unique,
  full_name text,
  phone text,
  address text,
  role public.user_role not null default 'customer',
  status public.account_status not null default 'approved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_status_idx on public.profiles(status);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Affiliate applications (explicit approval flow)
create table if not exists public.affiliate_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  status public.account_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists affiliate_applications_user_id_idx on public.affiliate_applications(user_id);
create index if not exists affiliate_applications_status_idx on public.affiliate_applications(status);

drop trigger if exists affiliate_applications_set_updated_at on public.affiliate_applications;
create trigger affiliate_applications_set_updated_at
before update on public.affiliate_applications
for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.affiliate_applications enable row level security;

-- Profiles policies
-- Owner can read/update own profile
drop policy if exists "profiles_read_own" on public.profiles;
create policy "profiles_read_own" on public.profiles
for select using (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = user_id);

-- Owner can insert their own profile row
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = user_id);

-- Admin can read all profiles
drop policy if exists "profiles_admin_read_all" on public.profiles;
create policy "profiles_admin_read_all" on public.profiles
for select using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- Admin can update all profiles
drop policy if exists "profiles_admin_update_all" on public.profiles;
create policy "profiles_admin_update_all" on public.profiles
for update using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- Affiliate applications policies
-- Owner can insert/read their own applications
drop policy if exists "aff_app_insert_own" on public.affiliate_applications;
create policy "aff_app_insert_own" on public.affiliate_applications
for insert with check (auth.uid() = user_id);

drop policy if exists "aff_app_read_own" on public.affiliate_applications;
create policy "aff_app_read_own" on public.affiliate_applications
for select using (auth.uid() = user_id);

-- Admin can read/update all applications
drop policy if exists "aff_app_admin_read_all" on public.affiliate_applications;
create policy "aff_app_admin_read_all" on public.affiliate_applications
for select using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

drop policy if exists "aff_app_admin_update_all" on public.affiliate_applications;
create policy "aff_app_admin_update_all" on public.affiliate_applications
for update using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);
