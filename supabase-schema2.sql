-- ============================================================
-- The Forking Good Club - Migration #2
-- Run this AFTER supabase-schema.sql has been applied
-- Adds: grocery cart tables, profile fields, avatar storage
-- ============================================================

-- ============================================================
-- 1. User Profile enhancements
-- ============================================================

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- ============================================================
-- 2. Grocery Cart
-- ============================================================

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  amount text DEFAULT '',
  unit text DEFAULT '',
  checked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cart_items_user_idx ON cart_items(user_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Links cart items to the recipe(s) they came from
CREATE TABLE IF NOT EXISTS cart_item_recipes (
  cart_item_id uuid REFERENCES cart_items(id) ON DELETE CASCADE NOT NULL,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  recipe_title text NOT NULL,
  PRIMARY KEY (cart_item_id, recipe_id)
);

ALTER TABLE cart_item_recipes ENABLE ROW LEVEL SECURITY;

-- RLS for cart_item_recipes: check parent cart_item belongs to user
CREATE POLICY "Users can view own cart item recipes"
  ON cart_item_recipes FOR SELECT TO authenticated
  USING (cart_item_id IN (SELECT id FROM cart_items WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own cart item recipes"
  ON cart_item_recipes FOR INSERT TO authenticated
  WITH CHECK (cart_item_id IN (SELECT id FROM cart_items WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete own cart item recipes"
  ON cart_item_recipes FOR DELETE TO authenticated
  USING (cart_item_id IN (SELECT id FROM cart_items WHERE user_id = auth.uid()));

-- ============================================================
-- 3. Avatar storage bucket policies
-- Create a PUBLIC bucket called 'avatars' in the Supabase
-- dashboard under Storage BEFORE running these policies.
-- ============================================================

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'avatars');
