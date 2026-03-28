-- 918 Party Co. Supabase Schema
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

-- Vendor listings (registration form submissions)
create table vendor_listings (
  id uuid default uuid_generate_v4() primary key,
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text not null,
  category text not null,
  price_range text not null,
  location text not null,
  description text not null,
  services text[] default '{}',
  areas_served text,
  website text,
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
alter table vendor_listings enable row level security;

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

-- Anyone can submit a vendor listing application
create policy "Anyone can submit vendor listings" on vendor_listings for insert with check (true);

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

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Sample vendors
insert into vendors (name, category_id, description, image_url, rating, review_count, price_range, location, phone, featured, services) values
  (
    'Tulsa Bounce Co.',
    'bounce-houses',
    'Premium bounce houses, water slides, and combo units for every occasion. Serving the Tulsa metro area with free delivery and setup.',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
    4.8, 47, '$$', 'Tulsa, OK', '(918) 555-0101', true,
    array['Bounce Houses', 'Water Slides', 'Obstacle Courses', 'Combo Units']
  ),
  (
    'DJ Thunder Tulsa',
    'djs',
    'High-energy DJ services for weddings, birthdays, corporate events, and school dances. Full sound and lighting packages available.',
    'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=600&h=400&fit=crop',
    4.9, 83, '$$$', 'Tulsa, OK', '(918) 555-0202', true,
    array['Wedding DJ', 'Birthday Parties', 'Corporate Events', 'School Dances', 'Sound & Lighting']
  ),
  (
    'Colorful Faces by Kim',
    'face-painting',
    'Professional face painting and glitter tattoos for birthday parties, festivals, and community events throughout Tulsa.',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
    4.7, 35, '$', 'Broken Arrow, OK', '(918) 555-0303', false,
    array['Face Painting', 'Glitter Tattoos', 'Body Art', 'Festival Packages']
  ),
  (
    'Twisted Creations Balloons',
    'balloon-artists',
    'Custom balloon arches, columns, centerpieces, and twisting entertainment. Making Tulsa parties pop since 2019.',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop',
    4.6, 22, '$$', 'Tulsa, OK', '(918) 555-0404', false,
    array['Balloon Arches', 'Centerpieces', 'Balloon Twisting', 'Event Decor']
  ),
  (
    'SnapZone Photo Booths',
    'photo-booths',
    'Modern photo booths with instant prints, GIF stations, and 360 video booths. Props and custom backdrops included.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
    4.8, 56, '$$', 'Tulsa, OK', '(918) 555-0505', true,
    array['Classic Photo Booth', '360 Video Booth', 'GIF Station', 'Custom Backdrops']
  ),
  (
    'Tulsa Tent & Event Rentals',
    'tent-rentals',
    'Full event rental service including tents, tables, chairs, linens, and dance floors. Delivery and setup across the Tulsa metro.',
    'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&h=400&fit=crop',
    4.5, 41, '$$$', 'Tulsa, OK', '(918) 555-0606', false,
    array['Tent Rentals', 'Tables & Chairs', 'Linens', 'Dance Floors', 'Lighting']
  ),
  (
    'Green Country Catering',
    'catering',
    'From BBQ to elegant plated dinners, we cater events of all sizes across Green Country. Locally sourced ingredients whenever possible.',
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop',
    4.7, 64, '$$$', 'Tulsa, OK', '(918) 555-0707', true,
    array['BBQ Catering', 'Plated Dinners', 'Buffet Style', 'Dessert Bars', 'Food Trucks']
  ),
  (
    'Princess & Pals Tulsa',
    'party-characters',
    'Professional costumed character appearances for birthday parties and events. Princesses, superheroes, mascots, and more.',
    'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?w=600&h=400&fit=crop',
    4.9, 38, '$$', 'Tulsa, OK', '(918) 555-0808', false,
    array['Princess Appearances', 'Superhero Visits', 'Mascot Rentals', 'Themed Parties']
  ),
  (
    'Bixby Bounce & Slide',
    'bounce-houses',
    'Family-owned inflatable rental company serving Bixby, Jenks, and South Tulsa. Water slides, bounce houses, and combo units.',
    'https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=600&h=400&fit=crop',
    4.4, 19, '$', 'Bixby, OK', '(918) 555-0909', false,
    array['Bounce Houses', 'Water Slides', 'Combo Units']
  ),
  (
    'Tulsa Taco Truck Co.',
    'catering',
    'Authentic street tacos, burritos, and elote for your next event. Our truck shows up ready to serve 50 to 500 guests.',
    'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop',
    4.8, 72, '$$', 'Tulsa, OK', '(918) 555-1010', false,
    array['Taco Bar', 'Burrito Station', 'Elote Cart', 'Full Truck Service']
  );

-- Sample reviews
-- Note: vendor_id values reference the auto-generated UUIDs above.
-- After inserting vendors, run this to get their IDs:
--   SELECT id, name FROM vendors ORDER BY name;
-- Then replace the subqueries below if needed.

insert into reviews (vendor_id, author_name, rating, text, created_at) values
  ((select id from vendors where name = 'Tulsa Bounce Co.'), 'Sarah M.', 5, 'Amazing setup for my daughter''s 5th birthday! They were on time and everything was spotless.', '2026-03-15'),
  ((select id from vendors where name = 'Tulsa Bounce Co.'), 'James R.', 5, 'Used them for our church fall festival. Great selection and very professional.', '2026-03-10'),
  ((select id from vendors where name = 'Tulsa Bounce Co.'), 'Maria L.', 4, 'Good service, the kids loved it. Would have liked more color options.', '2026-02-28'),
  ((select id from vendors where name = 'DJ Thunder Tulsa'), 'Ashley T.', 5, 'DJ Thunder made our wedding reception unforgettable! Everyone was on the dance floor all night.', '2026-03-20'),
  ((select id from vendors where name = 'DJ Thunder Tulsa'), 'Kevin P.', 5, 'Hired for our company holiday party. Totally professional and read the room perfectly.', '2026-03-05'),
  ((select id from vendors where name = 'Colorful Faces by Kim'), 'Priya K.', 5, 'Kim is a true artist! The kids were absolutely thrilled with her designs.', '2026-03-12'),
  ((select id from vendors where name = 'Colorful Faces by Kim'), 'Tom B.', 4, 'Great work at our neighborhood block party. Very patient with the little ones.', '2026-02-20'),
  ((select id from vendors where name = 'Twisted Creations Balloons'), 'Linda G.', 5, 'The balloon arch for my baby shower was stunning. So many compliments!', '2026-03-18'),
  ((select id from vendors where name = 'SnapZone Photo Booths'), 'Rachel W.', 5, 'The 360 booth was the highlight of our wedding! Everyone loved it.', '2026-03-22'),
  ((select id from vendors where name = 'SnapZone Photo Booths'), 'Derek S.', 5, 'Great props, great prints, great time. Would book again in a heartbeat.', '2026-03-01'),
  ((select id from vendors where name = 'Tulsa Tent & Event Rentals'), 'Michelle A.', 5, 'They handled our entire outdoor reception setup. Looked incredible and stress-free.', '2026-03-08'),
  ((select id from vendors where name = 'Tulsa Tent & Event Rentals'), 'Carlos R.', 4, 'Good selection and fair prices. Delivery was a bit late but setup was quick.', '2026-02-15'),
  ((select id from vendors where name = 'Green Country Catering'), 'Diana F.', 5, 'The brisket was to die for. Our guests are STILL talking about the food.', '2026-03-25'),
  ((select id from vendors where name = 'Green Country Catering'), 'Steve J.', 4, 'Solid catering for our corporate lunch. Good portions and presentation.', '2026-03-14'),
  ((select id from vendors where name = 'Princess & Pals Tulsa'), 'Jenny C.', 5, 'My daughter thought a REAL princess came to her party. Worth every penny for that magic!', '2026-03-19'),
  ((select id from vendors where name = 'Princess & Pals Tulsa'), 'Amanda H.', 5, 'Spider-Man showed up and my son completely lost his mind (in the best way). Amazing actors!', '2026-03-02'),
  ((select id from vendors where name = 'Bixby Bounce & Slide'), 'Nathan P.', 4, 'Affordable and reliable. The kids had a blast at our end-of-school party.', '2026-03-11'),
  ((select id from vendors where name = 'Tulsa Taco Truck Co.'), 'Chris M.', 5, 'Best event food decision we ever made. The line never stopped and everyone was raving.', '2026-03-21');
