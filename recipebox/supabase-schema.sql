-- ============================================================
-- My Recipe Box - Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Recipes table (JSONB for ingredients, steps, nutrition)
create table recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  hero_image_url text,
  category text not null default 'dinner',
  prep_minutes integer,
  cook_minutes integer,
  servings integer,
  rating integer check (rating >= 1 and rating <= 5),
  rating_notes text,
  tags text[] default '{}',
  ingredients jsonb default '[]',
  steps jsonb default '[]',
  nutrition jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for searching
create index recipes_user_id_idx on recipes(user_id);
create index recipes_category_idx on recipes(category);
create index recipes_tags_idx on recipes using gin(tags);

-- RLS
alter table recipes enable row level security;

create policy "Users can view own recipes"
  on recipes for select using (auth.uid() = user_id);

create policy "Users can insert own recipes"
  on recipes for insert with check (auth.uid() = user_id);

create policy "Users can update own recipes"
  on recipes for update using (auth.uid() = user_id);

create policy "Users can delete own recipes"
  on recipes for delete using (auth.uid() = user_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger recipes_updated_at
  before update on recipes
  for each row execute function update_updated_at();

-- ============================================================
-- Storage: Create a public bucket called 'recipe-photos'
-- in the Supabase dashboard under Storage.
--
-- Storage policies (run in SQL editor):
-- ============================================================

-- Allow authenticated users to upload to their own folder
create policy "Users can upload recipe photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'recipe-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to update their own photos
create policy "Users can update own recipe photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'recipe-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow authenticated users to delete their own photos
create policy "Users can delete own recipe photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'recipe-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Allow anyone to view recipe photos (public bucket)
create policy "Anyone can view recipe photos"
  on storage.objects for select
  to public
  using (bucket_id = 'recipe-photos');
