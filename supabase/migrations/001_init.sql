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

-- Admin can update all applications
drop policy if exists "aff_app_admin_update_all" on public.affiliate_applications;
create policy "aff_app_admin_update_all" on public.affiliate_applications
for update using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- Inventory (capacity per product per date)
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_key text not null,
  date date not null,
  capacity integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_key, date)
);

create index if not exists inventory_product_key_date_idx on public.inventory(product_key, date);

drop trigger if exists inventory_set_updated_at on public.inventory;
create trigger inventory_set_updated_at
before update on public.inventory
for each row execute function public.set_updated_at();

-- Pricing (base price + promo per product/ticket-option/pax-type/tier)
create table if not exists public.pricing (
  id uuid primary key default gen_random_uuid(),
  product_key text not null,
  ticket_option text,
  pax_type text not null,
  tier text not null,
  base_price numeric not null default 0,
  promo_price numeric,
  central_eligible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pricing_product_key_idx on public.pricing(product_key);

drop trigger if exists pricing_set_updated_at on public.pricing;
create trigger pricing_set_updated_at
before update on public.pricing
for each row execute function public.set_updated_at();

-- RLS for Inventory and Pricing
alter table public.inventory enable row level security;
alter table public.pricing enable row level security;

-- Inventory policies
-- Everyone can read inventory (to check availability)
drop policy if exists "inventory_read_all" on public.inventory;
create policy "inventory_read_all" on public.inventory
for select using (true);

-- Admin can manage inventory
drop policy if exists "inventory_admin_manage" on public.inventory;
create policy "inventory_admin_manage" on public.inventory
for all using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- Pricing policies
-- Everyone can read pricing
drop policy if exists "pricing_read_all" on public.pricing;
create policy "pricing_read_all" on public.pricing
for select using (true);

-- Admin can manage pricing
drop policy if exists "pricing_admin_manage" on public.pricing;
create policy "pricing_admin_manage" on public.pricing
for all using (
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
