-- ============================================================
-- OSRS Activity Helper - Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. User profiles table (used for 5-user cap enforcement)
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  rsn text,
  created_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

-- Anyone can count profiles (needed for signup cap check)
create policy "Anyone can count profiles"
  on public.user_profiles for select
  using (true);

-- Users can only insert their own profile
create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile (RSN etc)
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Enforce 5 user maximum
  if (select count(*) from public.user_profiles) >= 5 then
    raise exception 'Maximum number of users (5) reached. Signups are currently closed.';
  end if;

  insert into public.user_profiles (id, email, rsn)
  values (new.id, new.email, new.raw_user_meta_data->>'rsn');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger fires on every new auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. User screenshots table
create table if not exists public.user_screenshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  activity_slug text not null,
  activity_name text not null,
  gear_url text,
  inventory_url text,
  notes text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, activity_slug)
);

alter table public.user_screenshots enable row level security;

-- Users can view their own screenshots
create policy "Users can view own screenshots"
  on public.user_screenshots for select
  using (auth.uid() = user_id);

-- Authenticated users can view public screenshots
create policy "Authenticated users can view public screenshots"
  on public.user_screenshots for select
  using (is_public = true and auth.role() = 'authenticated');

create policy "Users can insert own screenshots"
  on public.user_screenshots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own screenshots"
  on public.user_screenshots for update
  using (auth.uid() = user_id);

create policy "Users can delete own screenshots"
  on public.user_screenshots for delete
  using (auth.uid() = user_id);


-- 3. Custom activities table (user-added bosses/activities)
create table if not exists public.custom_activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.custom_activities enable row level security;

-- All authenticated users can view custom activities
create policy "Authenticated users can view custom activities"
  on public.custom_activities for select
  using (auth.role() = 'authenticated');

-- Authenticated users can add custom activities
create policy "Authenticated users can insert custom activities"
  on public.custom_activities for insert
  with check (auth.role() = 'authenticated');


-- ============================================================
-- MIGRATION: Run these if you already have the tables from
-- a previous version of the schema:
--
-- -- Add is_public column
-- alter table public.user_screenshots
--   add column if not exists is_public boolean default false;
--
-- create policy "Authenticated users can view public screenshots"
--   on public.user_screenshots for select
--   using (is_public = true and auth.role() = 'authenticated');
--
-- -- Add rsn column and update policy/trigger
-- alter table public.user_profiles
--   add column if not exists rsn text;
--
-- create policy "Users can update own profile"
--   on public.user_profiles for update
--   using (auth.uid() = id);
--
-- -- Update the trigger function to save RSN on signup
-- create or replace function public.handle_new_user()
-- returns trigger as $$
-- begin
--   if (select count(*) from public.user_profiles) >= 5 then
--     raise exception 'Maximum number of users (5) reached. Signups are currently closed.';
--   end if;
--   insert into public.user_profiles (id, email, rsn)
--   values (new.id, new.email, new.raw_user_meta_data->>'rsn');
--   return new;
-- end;
-- $$ language plpgsql security definer;
-- ============================================================

-- ============================================================
-- STORAGE BUCKET SETUP (configure via Supabase Dashboard)
-- See setup instructions in the project README.
-- ============================================================
