-- ============================================================
-- My Recipe Box - Full Supabase Schema (Multi-user)
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Recipes table (JSONB for ingredients, steps, nutrition)
CREATE TABLE IF NOT EXISTS recipes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  hero_image_url text,
  category text NOT NULL DEFAULT 'dinner',
  prep_minutes integer,
  cook_minutes integer,
  servings integer,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  rating_notes text,
  tags text[] DEFAULT '{}',
  ingredients jsonb DEFAULT '[]',
  steps jsonb DEFAULT '[]',
  nutrition jsonb,
  notes text,
  made_on date,
  like_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON recipes(user_id);
CREATE INDEX IF NOT EXISTS recipes_category_idx ON recipes(category);
CREATE INDEX IF NOT EXISTS recipes_tags_idx ON recipes USING gin(tags);

-- RLS: all authenticated users can browse, only owners can modify
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all recipes"
  ON recipes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own recipes"
  ON recipes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Likes
-- ============================================================

CREATE TABLE IF NOT EXISTS recipe_likes (
  user_id uuid REFERENCES auth.users NOT NULL,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view all likes"
  ON recipe_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own likes"
  ON recipe_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON recipe_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Auto-update like count on recipes
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE recipes SET like_count = like_count + 1 WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE recipes SET like_count = like_count - 1 WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipe_likes_count
  AFTER INSERT OR DELETE ON recipe_likes
  FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- ============================================================
-- Comments
-- ============================================================

CREATE TABLE IF NOT EXISTS recipe_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  body text NOT NULL CHECK (char_length(body) > 0),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS recipe_comments_recipe_idx ON recipe_comments(recipe_id);

ALTER TABLE recipe_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view all comments"
  ON recipe_comments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own comments"
  ON recipe_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON recipe_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- Storage: Create a PUBLIC bucket called 'recipe-photos'
-- in the Supabase dashboard under Storage.
-- ============================================================

CREATE POLICY "Users can upload recipe photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'recipe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update own recipe photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'recipe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own recipe photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'recipe-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view recipe photos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'recipe-photos');

-- ============================================================
-- MIGRATION: If you already ran the old schema, run this instead
-- ============================================================
-- ALTER TABLE recipes ADD COLUMN IF NOT EXISTS made_on date;
-- ALTER TABLE recipes ADD COLUMN IF NOT EXISTS like_count integer DEFAULT 0;
-- DROP POLICY IF EXISTS "Users can view own recipes" ON recipes;
-- CREATE POLICY "Authenticated users can view all recipes"
--   ON recipes FOR SELECT TO authenticated USING (true);
-- Then run the Likes and Comments CREATE TABLE blocks above.
