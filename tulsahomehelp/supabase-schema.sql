-- TulsaHomeHelp Supabase Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Categories
create table categories (
  id text primary key,
  name text not null,
  icon text,
  description text,
  created_at timestamptz default now()
);

-- Providers
create table providers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category_id text references categories(id),
  description text,
  image_url text,
  rating numeric(2,1) default 0,
  review_count int default 0,
  price_range text check (price_range in ('$', '$$', '$$$')),
  location text not null,
  phone text,
  email text,
  website text,
  featured boolean default false,
  services text[] default '{}',
  user_id uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quote requests
create table quote_requests (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references providers(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service_needed text,
  preferred_date date,
  address text,
  message text,
  status text default 'pending' check (status in ('pending', 'quoted', 'accepted', 'declined', 'completed')),
  created_at timestamptz default now()
);

-- Reviews
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references providers(id) on delete cascade,
  author_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  text text,
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Indexes
create index idx_providers_category on providers(category_id);
create index idx_providers_featured on providers(featured) where featured = true;
create index idx_providers_rating on providers(rating desc);
create index idx_reviews_provider on reviews(provider_id);
create index idx_quote_requests_provider on quote_requests(provider_id);

-- RLS
alter table categories enable row level security;
alter table providers enable row level security;
alter table quote_requests enable row level security;
alter table reviews enable row level security;

create policy "Public can view categories" on categories for select using (true);
create policy "Public can view providers" on providers for select using (true);
create policy "Public can view reviews" on reviews for select using (true);
create policy "Anyone can create quote requests" on quote_requests for insert with check (true);
create policy "Anyone can create reviews" on reviews for insert with check (true);
create policy "Providers can update own listing" on providers for update using (auth.uid() = user_id);

-- Seed categories
insert into categories (id, name, icon, description) values
  ('pressure-washing', 'Pressure Washing', '💦', 'Driveways, siding, decks, and fences'),
  ('lawn-care', 'Lawn Care', '🌿', 'Mowing, edging, fertilizing, and landscaping'),
  ('junk-hauling', 'Junk Hauling', '🚛', 'Debris removal, cleanouts, and hauling'),
  ('tree-service', 'Tree Service', '🌳', 'Trimming, removal, and stump grinding'),
  ('fence-repair', 'Fence & Deck', '🔨', 'Fence repair, staining, and deck work'),
  ('gutter-cleaning', 'Gutter Cleaning', '🏠', 'Gutter cleaning, guards, and downspouts'),
  ('painting', 'Painting', '🎨', 'Interior and exterior house painting'),
  ('general', 'General Labor', '💪', 'Moving help, yard cleanup, and odd jobs');
