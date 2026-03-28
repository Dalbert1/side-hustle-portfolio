-- PartyPlug Supabase Schema
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories table
create table categories (
  id text primary key,
  name text not null,
  icon text,
  description text,
  created_at timestamptz default now()
);

-- Vendors table
create table vendors (
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

-- Booking requests table
create table booking_requests (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references vendors(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  event_date date not null,
  event_time text,
  event_type text,
  guest_count int,
  message text,
  status text default 'pending' check (status in ('pending', 'confirmed', 'declined', 'completed')),
  created_at timestamptz default now()
);

-- Reviews table
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  vendor_id uuid references vendors(id) on delete cascade,
  author_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  text text,
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Indexes
create index idx_vendors_category on vendors(category_id);
create index idx_vendors_featured on vendors(featured) where featured = true;
create index idx_vendors_rating on vendors(rating desc);
create index idx_reviews_vendor on reviews(vendor_id);
create index idx_booking_requests_vendor on booking_requests(vendor_id);

-- Row Level Security
alter table vendors enable row level security;
alter table booking_requests enable row level security;
alter table reviews enable row level security;
alter table categories enable row level security;

-- Public read access for vendors and categories
create policy "Public can view categories" on categories for select using (true);
create policy "Public can view vendors" on vendors for select using (true);
create policy "Public can view reviews" on reviews for select using (true);

-- Anyone can submit a booking request
create policy "Anyone can create booking requests" on booking_requests for insert with check (true);

-- Anyone can submit a review
create policy "Anyone can create reviews" on reviews for insert with check (true);

-- Vendors can manage their own listings
create policy "Vendors can update own listing" on vendors for update using (auth.uid() = user_id);

-- Seed categories
insert into categories (id, name, icon, description) values
  ('bounce-houses', 'Bounce Houses', '🏰', 'Inflatables, water slides, and obstacle courses'),
  ('djs', 'DJs & Music', '🎵', 'DJs, live bands, and sound equipment'),
  ('face-painting', 'Face Painting', '🎨', 'Face painters and body art artists'),
  ('balloon-artists', 'Balloon Artists', '🎈', 'Balloon twisting, arches, and decor'),
  ('photo-booths', 'Photo Booths', '📸', 'Photo booths, 360 cameras, and selfie stations'),
  ('tent-rentals', 'Tent & Table Rentals', '⛺', 'Tents, tables, chairs, and linens'),
  ('catering', 'Catering & Food', '🍕', 'Caterers, food trucks, and dessert bars'),
  ('party-characters', 'Party Characters', '🦸', 'Costumed characters and entertainers');
