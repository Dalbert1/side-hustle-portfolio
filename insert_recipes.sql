-- ============================================================
-- The Forking Good Club - Seed Recipes
-- Replace YOUR_USER_ID_HERE with your actual Supabase user UUID
-- You can find it in Supabase > Authentication > Users
-- ============================================================

-- Set your user ID here once:
DO $$
DECLARE
  uid uuid := '646c0911-6b60-4db0-be76-f2e408138f41';
BEGIN

-- 1. Creamy Chicken and Wild Rice Soup
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, notes)
VALUES (
  uid,
  'Creamy Chicken and Wild Rice Soup',
  'A hearty and satisfying soup. Like a chicken noodle soup made creamy with rice in place of noodles.',
  'dinner',
  15, 45, 5,
  ARRAY['soup', 'chicken', 'comfort food', 'wild rice'],
  '[
    {"name": "3/4 cup uncooked wild rice blend"},
    {"name": "1 cup chopped yellow onion (1 small onion)"},
    {"name": "1 cup diced carrots (2 medium)"},
    {"name": "1 cup diced celery (3 ribs)"},
    {"name": "7 Tbsp butter, diced, divided"},
    {"name": "1 large garlic clove, minced (1 1/2 tsp)"},
    {"name": "4 1/2 cups low-sodium chicken broth"},
    {"name": "1/4 tsp each dried thyme, marjoram, sage and rosemary"},
    {"name": "Salt and ground black pepper, to taste"},
    {"name": "1 lb boneless skinless chicken breasts"},
    {"name": "1/2 cup all-purpose flour"},
    {"name": "1 1/2 cups milk"},
    {"name": "1/2 cup heavy cream"},
    {"name": "1 tsp lemon zest"}
  ]'::jsonb,
  '[
    {"instruction": "Prepare rice according to directions listed on package."},
    {"instruction": "Halfway through the rice cooking, in a separate large pot, melt 1 Tbsp butter over medium heat. Add onion, carrots and celery and saute 4 minutes, add garlic and saute 30 seconds longer."},
    {"instruction": "Add chicken broth, thyme, marjoram, sage, rosemary and season with salt and black pepper to taste. Increase heat to medium-high, add chicken and bring mixture to a boil."},
    {"instruction": "Cover pot with lid, reduce to medium-low heat and allow mixture to simmer until chicken is cooked through, about 12-16 minutes."},
    {"instruction": "Remove chicken and set aside on cutting board to cool 5 minutes then shred into small bite size pieces. Leave soup covered over warm heat."},
    {"instruction": "In a separate medium saucepan, melt remaining 6 Tbsp butter over medium heat. Add flour and cook 1 1/2 minutes, whisking constantly."},
    {"instruction": "While whisking vigorously, slowly pour milk into butter/flour mixture. Whisk in heavy cream. Cook mixture, stirring constantly until it thickens."},
    {"instruction": "Add milk mixture to soup mixture in pot along with shredded chicken, cooked rice, and lemon zest. Stir well and remove from heat."},
    {"instruction": "Let soup cool slightly and serve."}
  ]'::jsonb,
  'Recommend using Lundberg Wild Blend Rice if you can find it.'
);

-- 2. Butter Chicken
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition, notes)
VALUES (
  uid,
  'Butter Chicken',
  'One of the easiest Indian curries to make. The Butter Chicken Sauce is so good you will want it on tap!',
  'dinner',
  10, 25, 4,
  ARRAY['curry', 'indian', 'chicken', 'comfort food'],
  '[
    {"name": "1/2 cup plain yoghurt, full fat (marinade)"},
    {"name": "1 tbsp lemon juice (marinade)"},
    {"name": "1 tsp turmeric powder (marinade)"},
    {"name": "2 tsp garam masala (marinade)"},
    {"name": "1/2 tsp chilli powder or cayenne (marinade)"},
    {"name": "1 tsp ground cumin (marinade)"},
    {"name": "1 tbsp ginger, freshly grated (marinade)"},
    {"name": "2 cloves garlic, crushed (marinade)"},
    {"name": "1.5 lb chicken thigh fillets, cut into bite size pieces"},
    {"name": "2 tbsp ghee or butter"},
    {"name": "1 cup tomato passata"},
    {"name": "1 cup heavy cream"},
    {"name": "1 tbsp sugar"},
    {"name": "1 1/4 tsp salt"},
    {"name": "Basmati rice for serving"},
    {"name": "Coriander/cilantro for garnish (optional)"}
  ]'::jsonb,
  '[
    {"instruction": "Combine the Marinade ingredients with the chicken in a bowl. Cover and refrigerate overnight, or up to 24 hours (minimum 3 hrs)."},
    {"instruction": "Heat the ghee (butter or oil) over high heat in a large fry pan. Take the chicken out of the Marinade but do not wipe off the marinade from the chicken."},
    {"instruction": "Place chicken in the fry pan and cook for around 3 minutes, or until the chicken is white all over."},
    {"instruction": "Add the tomato passata, cream, sugar and salt. Also add any remaining marinade left in the bowl. Turn down to low and simmer for 20 minutes."},
    {"instruction": "Do a taste test to see if it needs more salt. Garnish with coriander/cilantro leaves if using. Serve with basmati rice."}
  ]'::jsonb,
  '{"calories": 402, "carbohydrates": "9.8g", "protein": "39.8g", "fat": "23.4g"}'::jsonb,
  'Marinate chicken at least 3 hours, overnight is best. For a lighter version, use 3/4 cup light cream + 1/4 cup milk.'
);

-- 3. Chicken Fried Chicken
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition, notes)
VALUES (
  uid,
  'Chicken Fried Chicken',
  'A quick and flavorful dinnertime recipe that brings the whole family to the table, with minimal ingredients.',
  'dinner',
  10, 20, 6,
  ARRAY['chicken', 'fried', 'comfort food', 'southern'],
  '[
    {"name": "6-8 thin sliced chicken breasts"},
    {"name": "2 cups flour"},
    {"name": "2 tsp baking powder"},
    {"name": "1 tsp baking soda"},
    {"name": "1 tsp salt"},
    {"name": "1 tsp pepper"},
    {"name": "1 tsp garlic powder"},
    {"name": "1 1/2 cup buttermilk"},
    {"name": "1 egg"},
    {"name": "1 Tbs hot sauce"},
    {"name": "Oil for frying"},
    {"name": "Gravy: 1/4 cup reserved oil from frying"},
    {"name": "Gravy: 1/3 cup flour"},
    {"name": "Gravy: 2 cups milk"},
    {"name": "Gravy: Salt & pepper"}
  ]'::jsonb,
  '[
    {"instruction": "Heat oil in deep fryer or large pan on stove (a few inches deep) to 325."},
    {"instruction": "In large bowl whisk together your flour, baking powder, baking soda, salt, pepper and garlic powder."},
    {"instruction": "In another bowl whisk together buttermilk, egg and hot sauce."},
    {"instruction": "Dredge your chicken in the flour mixture then dip into the egg mixture then back into the flour mixture making sure to press down flour to get stuck on real good."},
    {"instruction": "Place chicken in pan/deep fryer and fry on each side 3-5 minutes until golden brown, remove and drain on paper towel lined plate."},
    {"instruction": "To make your gravy, in large pan add 1/4 inch of oil from cooking and heat on medium-high, stir in your flour until absorbed and cook for about 1 minute."},
    {"instruction": "Slowly add in your milk whisking to blend and heat until thickened then stir in salt and pepper to desired taste."},
    {"instruction": "Pour gravy over individual chicken before serving."}
  ]'::jsonb,
  '{"calories": 490, "carbohydrates": "45g", "protein": "35g", "fat": "18g"}'::jsonb,
  'You can use thin cut chicken from the store, or slice a regular chicken breast in half. If you do not want to use frying oil for gravy, substitute butter or bacon grease.'
);

-- 4. Wild Rice and Sausage Casserole
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps)
VALUES (
  uid,
  'Wild Rice and Sausage Casserole',
  'A simple and delicious casserole combining pork sausage and wild rice. Comfort food at its best.',
  'dinner',
  30, 60, 6,
  ARRAY['casserole', 'sausage', 'wild rice', 'comfort food'],
  '[
    {"name": "1 lb pork sausage (hot or mild)"},
    {"name": "1 cup wild rice (not cooked)"},
    {"name": "1 cup white onion, diced"},
    {"name": "3/4 cup celery, diced"},
    {"name": "1/2 cup carrot, diced"},
    {"name": "1/2 cup bell pepper, diced (any color)"},
    {"name": "1 (10 3/4 oz) can cream of celery soup"},
    {"name": "Water (2 soup cans worth)"},
    {"name": "1 tsp salt"},
    {"name": "2 tbsp butter"},
    {"name": "Fresh black pepper to taste"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 350 degrees."},
    {"instruction": "Wash wild rice several times under cold water until water runs clear. Set aside."},
    {"instruction": "Melt butter in skillet and fry sausage over medium high heat, breaking up into small pieces. Cook just until all pink is gone. Remove sausage and set aside."},
    {"instruction": "In same skillet saute onion, celery, carrot and bell pepper over medium high heat until just beginning to brown lightly. Toss frequently."},
    {"instruction": "Add wild rice to skillet and continue to saute a while longer, tossing frequently to coat wild rice with oil but do not let it burn."},
    {"instruction": "Add salt and black pepper to taste."},
    {"instruction": "Add Cream of Celery soup to skillet and mix quickly, then add 2 soup cans of water and stir until well mixed."},
    {"instruction": "Add reserved sausage meat and mix thoroughly. Bring to a boil, immediately remove from stove and pour into a buttered casserole (at least 2 qts.) and cover with foil."},
    {"instruction": "Place in oven and bake. After 30 minutes check and add a small amount of additional water if necessary, and stir well."},
    {"instruction": "Cook until most liquid is absorbed, but not until casserole is dry, about an hour total."}
  ]'::jsonb
);

-- 5. Thai Chicken Coconut Curry (Red)
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition, notes)
VALUES (
  uid,
  'Thai Chicken Coconut Curry (Red)',
  'An easy one-skillet curry ready in 20 minutes, layered with fabulous flavors. Low-cal, low-carb, and healthy but tastes like comfort food!',
  'dinner',
  10, 20, 6,
  ARRAY['curry', 'thai', 'chicken', 'coconut', 'healthy', 'quick'],
  '[
    {"name": "2-3 tbsp coconut oil (or olive oil)"},
    {"name": "1 medium/large sweet Vidalia or yellow onion, diced small"},
    {"name": "1 lb boneless skinless chicken breast, diced"},
    {"name": "3 cloves garlic, finely minced"},
    {"name": "2-3 tsp ground ginger (or 1 tbsp fresh, finely chopped)"},
    {"name": "2 tsp ground coriander"},
    {"name": "1 (13 oz) can coconut milk"},
    {"name": "1 to 1 1/2 cups shredded carrots"},
    {"name": "1-3 tbsp Thai red curry paste (to taste)"},
    {"name": "1 tsp kosher salt"},
    {"name": "1/2 tsp freshly ground black pepper"},
    {"name": "3 cups fresh spinach leaves"},
    {"name": "1 tbsp lime juice"},
    {"name": "1-2 tbsp brown sugar (optional, to taste)"},
    {"name": "1/4 cup fresh cilantro for garnish"},
    {"name": "Rice, quinoa, or naan for serving"}
  ]'::jsonb,
  '[
    {"instruction": "To a large skillet, add the oil, onion, and saute over medium-high heat until the onion begins to soften about 5 minutes; stir intermittently."},
    {"instruction": "Add the chicken and cook for about 5 minutes, or until chicken is done; flip and stir often."},
    {"instruction": "Add the garlic, ginger, coriander, and cook for about 1 minute, or until fragrant; stir frequently."},
    {"instruction": "Add the coconut milk, carrots, Thai curry paste, salt, pepper, and stir to combine. Reduce the heat to medium, and allow mixture to gently boil for about 5 minutes."},
    {"instruction": "Add the spinach, lime juice, and stir to combine. Cook until spinach has wilted, about 1-2 minutes. Taste and optionally add brown sugar, additional curry paste, salt, pepper to taste."},
    {"instruction": "Sprinkle with cilantro and serve immediately over rice."}
  ]'::jsonb,
  '{"calories": 474, "carbohydrates": "34g", "protein": "32g", "fat": "25g"}'::jsonb,
  'Curry is best warm and fresh but will keep airtight in the fridge for up to 1 week. Use full-fat coconut milk for a richer/thicker result.'
);

-- 6. Cajun Chicken Pasta
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps)
VALUES (
  uid,
  'Cajun Chicken Pasta',
  'Creamy cajun chicken pasta with a spicy kick. A quick weeknight dinner that is full of flavor.',
  'dinner',
  10, 20, 4,
  ARRAY['pasta', 'cajun', 'chicken', 'creamy', 'quick'],
  '[
    {"name": "1 lb chicken breast, sliced"},
    {"name": "2 tbsp cajun seasoning"},
    {"name": "8 oz penne pasta"},
    {"name": "2 tbsp olive oil"},
    {"name": "1 bell pepper, sliced"},
    {"name": "1/2 onion, diced"},
    {"name": "2 cloves garlic, minced"},
    {"name": "1 cup heavy cream"},
    {"name": "1/2 cup parmesan cheese, grated"},
    {"name": "Salt and pepper to taste"},
    {"name": "Fresh parsley for garnish"}
  ]'::jsonb,
  '[
    {"instruction": "Cook pasta according to package directions. Drain and set aside."},
    {"instruction": "Season chicken with cajun seasoning. Heat olive oil in a large skillet over medium-high heat and cook chicken until done, about 5-7 minutes per side. Remove and slice."},
    {"instruction": "In the same skillet, saute bell pepper, onion, and garlic until softened, about 3-4 minutes."},
    {"instruction": "Add heavy cream and parmesan cheese, stirring until the cheese is melted and sauce is smooth."},
    {"instruction": "Add the cooked pasta and sliced chicken back to the skillet. Toss everything together."},
    {"instruction": "Season with salt, pepper, and additional cajun seasoning to taste. Garnish with parsley and serve."}
  ]'::jsonb
);

-- 7. Smoked Sausage with Sweet Potato and Broccoli
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps)
VALUES (
  uid,
  'Smoked Sausage with Sweet Potato and Broccoli',
  'A simple and healthy sheet pan dinner with smoked sausage, roasted sweet potatoes, and broccoli.',
  'dinner',
  15, 25, 4,
  ARRAY['sheet pan', 'sausage', 'sweet potato', 'broccoli', 'healthy', 'quick'],
  '[
    {"name": "1 lb smoked sausage, sliced"},
    {"name": "2 large sweet potatoes, peeled and cubed"},
    {"name": "2 cups broccoli florets"},
    {"name": "2 tbsp olive oil"},
    {"name": "1 tsp garlic powder"},
    {"name": "1 tsp smoked paprika"},
    {"name": "Salt and pepper to taste"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 400 F. Line a large baking sheet with parchment paper."},
    {"instruction": "Toss sweet potato cubes with 1 tbsp olive oil, garlic powder, smoked paprika, salt and pepper. Spread on baking sheet and roast for 15 minutes."},
    {"instruction": "Remove from oven and add sliced smoked sausage and broccoli florets. Drizzle with remaining olive oil and toss to combine."},
    {"instruction": "Return to oven and bake for an additional 15-20 minutes until broccoli is tender and sausage is browned."},
    {"instruction": "Serve hot."}
  ]'::jsonb
);

-- 8. Old Bay Scallops
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps)
VALUES (
  uid,
  'Old Bay Scallops',
  'Quick and delicious pan-seared scallops seasoned with Old Bay. Ready in about 20 minutes.',
  'dinner',
  10, 10, 2,
  ARRAY['seafood', 'scallops', 'quick', 'old bay'],
  '[
    {"name": "1 lb sea scallops, patted dry"},
    {"name": "1-2 tsp Old Bay seasoning"},
    {"name": "2 tbsp butter"},
    {"name": "1 tbsp olive oil"},
    {"name": "2 cloves garlic, minced"},
    {"name": "Juice of 1/2 lemon"},
    {"name": "Fresh parsley for garnish"},
    {"name": "Salt and pepper to taste"}
  ]'::jsonb,
  '[
    {"instruction": "Pat scallops dry with paper towels. Season both sides with Old Bay seasoning, salt and pepper."},
    {"instruction": "Heat olive oil and 1 tbsp butter in a large skillet over medium-high heat until very hot."},
    {"instruction": "Add scallops in a single layer, making sure not to overcrowd. Sear for 2-3 minutes per side until golden brown crust forms."},
    {"instruction": "Add remaining butter and garlic to the pan in the last minute of cooking."},
    {"instruction": "Squeeze lemon juice over scallops, garnish with parsley and serve immediately."}
  ]'::jsonb
);

-- 9. Cajun Gumbo with Chicken and Andouille Sausage
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, notes)
VALUES (
  uid,
  'Cajun Gumbo with Chicken and Andouille Sausage',
  'A rich, deeply flavored Cajun gumbo with a dark roux, chicken thighs, and andouille sausage. Serious comfort food.',
  'dinner',
  5, 225, 10,
  ARRAY['cajun', 'gumbo', 'chicken', 'sausage', 'soup', 'southern'],
  '[
    {"name": "1 cup + 1 tbsp canola or vegetable oil, divided"},
    {"name": "6 boneless skinless chicken thighs (about 2 1/4 lbs total)"},
    {"name": "Kosher salt"},
    {"name": "1 1/2 lbs Cajun-style andouille sausage, sliced 1/2 inch thick"},
    {"name": "1 cup all-purpose flour"},
    {"name": "2 large yellow onions, cut into 1/4-inch dice"},
    {"name": "2 green bell peppers, cut into 1/4-inch dice"},
    {"name": "4 large celery ribs, cut into 1/4-inch dice"},
    {"name": "8 medium cloves garlic, minced"},
    {"name": "1/4 tsp cayenne pepper"},
    {"name": "Freshly ground black pepper"},
    {"name": "1 1/2 quarts chicken stock"},
    {"name": "2 dried bay leaves"},
    {"name": "2 large sprigs fresh thyme"},
    {"name": "1 lb fresh okra, sliced (optional)"},
    {"name": "1/2 tsp file powder (optional)"},
    {"name": "Warm rice, sliced scallions, and hot sauce for serving"}
  ]'::jsonb,
  '[
    {"instruction": "Heat 1 tbsp oil over medium-high heat. Season chicken with salt. Sear until browned on both sides, about 5 minutes per side. Set aside to cool, then shred."},
    {"instruction": "Add sliced andouille to pot and cook until lightly browned, about 6 minutes. Transfer to a platter."},
    {"instruction": "Add remaining 1 cup oil and flour, stirring to form a paste. Lower heat to medium-low and cook, stirring frequently, until roux is chocolate-brown, about 1 hour."},
    {"instruction": "Add onion, bell pepper, and celery. Season with salt. Cook over medium-high heat until softened, about 10 minutes."},
    {"instruction": "Stir in garlic, cayenne, and a generous amount of black pepper. Cook for 2 minutes."},
    {"instruction": "Add stock, bay leaves, and thyme. Season with salt. Bring to a gentle simmer and cook uncovered for 1 hour."},
    {"instruction": "Add okra (if using), sausage, and shredded chicken. Simmer uncovered for 1 more hour. Skim fat as it accumulates."},
    {"instruction": "Remove from heat, add file powder if using, season with salt. Discard thyme and bay leaves. Serve with warm rice, scallions, and hot sauce."}
  ]'::jsonb,
  'Okra and file powder are both traditional thickeners. Use one, the other, or both. Can be refrigerated for up to 5 days.'
);

-- 10. Jalapeno Chicken
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps)
VALUES (
  uid,
  'Jalapeno Chicken',
  'A sweet and savory stir-fry with a soy sauce and honey glaze, studded with fresh jalapenos. Serve over rice or noodles.',
  'dinner',
  10, 15, 4,
  ARRAY['chicken', 'jalapeno', 'stir fry', 'quick', 'spicy'],
  '[
    {"name": "1/4 cup soy sauce"},
    {"name": "3 tbsp rice vinegar"},
    {"name": "1/8 cup water"},
    {"name": "1 tbsp minced garlic"},
    {"name": "1/4 cup brown sugar"},
    {"name": "2 tbsp honey"},
    {"name": "1/2 tsp red pepper flakes"},
    {"name": "2 lbs boneless skinless chicken thighs or breasts, cut into bite sized pieces"},
    {"name": "Salt and pepper"},
    {"name": "1/4 cup cornstarch"},
    {"name": "2 tbsp oil"},
    {"name": "1/2 diced onion"},
    {"name": "1-3 sliced jalapenos"},
    {"name": "Rice or noodles for serving"}
  ]'::jsonb,
  '[
    {"instruction": "Mix together 1/4 cup soy sauce, 3 tbsp rice vinegar, 1/8 cup water, 1 tbsp minced garlic, 1/4 cup brown sugar, 2 tbsp honey and 1/2 tsp red pepper flakes. Set aside."},
    {"instruction": "Cut 2 lbs of boneless skinless chicken into bite sized pieces. Season with salt and a lot of pepper."},
    {"instruction": "Mix chicken with 1/4 cup of cornstarch."},
    {"instruction": "Heat 2 tbsp of oil in a skillet over medium high heat and cook the chicken. Remove and set aside."},
    {"instruction": "Add 1/2 of a diced onion and 1-3 sliced jalapenos. Cook until soft."},
    {"instruction": "Add the chicken and the sauce back in and cook over low heat until the sauce has thickened up."},
    {"instruction": "Serve over rice or noodles and enjoy!"}
  ]'::jsonb
);

-- 11. Broccoli and Potato Soup
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition, notes)
VALUES (
  uid,
  'Broccoli and Potato Soup',
  'A thick, hearty, creamy soup that will warm your soul. Tastes rich and indulgent, but made without a single drop of cream.',
  'dinner',
  10, 20, 5,
  ARRAY['soup', 'broccoli', 'potato', 'comfort food', 'vegetarian'],
  '[
    {"name": "3 tbsp unsalted butter"},
    {"name": "1 small onion, finely chopped"},
    {"name": "2 garlic cloves, minced"},
    {"name": "1/3 cup flour"},
    {"name": "2 cups milk (any fat %)"},
    {"name": "2 cups chicken broth/stock, low sodium"},
    {"name": "2 cups water"},
    {"name": "1 tsp salt"},
    {"name": "1/2 tsp black pepper"},
    {"name": "1.6 lb potato, peeled and cubed"},
    {"name": "5 cups broccoli, small florets (1 large head)"},
    {"name": "1+ cups grated cheddar cheese"},
    {"name": "Garnish: cooked bacon pieces (highly recommended)"},
    {"name": "Garnish: shallots/scallions, finely sliced"},
    {"name": "Garnish: extra grated cheese"}
  ]'::jsonb,
  '[
    {"instruction": "Melt butter in a large pot over medium high heat. Add onion and garlic, cook for 3 minutes or until onion is softened."},
    {"instruction": "Add flour and mix into onion mixture. Cook for 30 seconds."},
    {"instruction": "While stirring, slowly pour the milk in and keep mixing as it turns into a thickish paste. Use a whisk to make it smooth if needed."},
    {"instruction": "Add chicken stock, water, salt and pepper. Stir, then add potato."},
    {"instruction": "Bring to simmer then adjust heat so it is simmering gently. Cook for 8 minutes (no lid) or until potato is almost cooked. Stir occasionally so the base does not catch."},
    {"instruction": "Add broccoli and stir. Cook for 2 minutes or until broccoli is cooked to your liking, then take the pot off the stove."},
    {"instruction": "Stir through cheese (1 cup). Broth should be nicely thickened. Add more salt if needed."},
    {"instruction": "Ladle into bowls and top with garnishes of choice."}
  ]'::jsonb,
  '{"calories": 405, "carbohydrates": "48g", "protein": "18.3g", "fat": "16.6g"}'::jsonb,
  'Make without broccoli and add bacon 100%. Can be made gluten free by using cornstarch slurry instead of flour. Fridge for 4-5 days or freeze.'
);

-- 12. Creamy Chicken Noodle Soup
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, notes)
VALUES (
  uid,
  'Creamy Chicken Noodle Soup',
  'Creamy yet light chicken noodle soup with potato, flavorful thyme and oregano, and convenient pre-cooked rotisserie chicken.',
  'dinner',
  30, 40, 6,
  ARRAY['soup', 'chicken', 'noodle', 'comfort food', 'creamy'],
  '[
    {"name": "1 Tbsp unsalted butter"},
    {"name": "3/4 cup chopped yellow onion"},
    {"name": "1 cup sliced or diced carrots"},
    {"name": "1 cup sliced or diced celery"},
    {"name": "2 garlic cloves, minced"},
    {"name": "1/4 cup all-purpose flour"},
    {"name": "1/2 tsp salt"},
    {"name": "1/2 tsp fresh ground pepper"},
    {"name": "1 tsp dried thyme leaves"},
    {"name": "1/2 tsp dried oregano"},
    {"name": "8 cups chicken broth (reduced sodium)"},
    {"name": "1 medium potato, peeled and diced"},
    {"name": "2 cups shredded or chopped cooked chicken"},
    {"name": "1 cup half-and-half or whole milk"},
    {"name": "3-4 cups uncooked wide egg noodles"}
  ]'::jsonb,
  '[
    {"instruction": "Melt butter in a large pot over medium heat. Add onion, carrots, celery, and garlic. Cook for 5 minutes until softened. Stir in flour, salt, pepper, thyme, and oregano and cook for 2 minutes."},
    {"instruction": "Add the chicken broth and potato. Increase heat to medium-high. Bring to a boil and boil for 3 minutes. Reduce heat to medium-low, partially cover, and simmer for 25 minutes until potatoes have softened."},
    {"instruction": "Add the chicken, half-and-half/milk, and noodles. Cook for 10 minutes until the noodles are tender and soup has thickened. Taste and adjust seasoning. Serve warm."}
  ]'::jsonb,
  'Use rotisserie chicken for convenience. Freeze for up to 3 months. Try adding a squeeze of fresh lemon during the last few minutes of cooking. Soup thickens in the fridge as noodles soak up liquid.'
);

-- 13. Stuffed Peppers
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition)
VALUES (
  uid,
  'Stuffed Peppers',
  'Classic stuffed peppers filled with ground beef, rice, tomato sauce, and cheese. An easy weeknight supper.',
  'dinner',
  30, 45, 6,
  ARRAY['beef', 'peppers', 'stuffed', 'comfort food'],
  '[
    {"name": "1 lb 90% lean ground beef"},
    {"name": "1 1/4 tsp salt, divided"},
    {"name": "Heaping 1/4 tsp baking soda"},
    {"name": "3 large bell peppers, cut in half and cored"},
    {"name": "3 tbsp extra-virgin olive oil"},
    {"name": "1 medium yellow onion, finely chopped"},
    {"name": "3 cloves garlic, minced"},
    {"name": "1 1/2 tsp chili powder"},
    {"name": "1/2 tsp ground cumin"},
    {"name": "1/4 tsp dried oregano"},
    {"name": "1 (8 oz) can tomato sauce"},
    {"name": "1 cup cooked rice"},
    {"name": "1 1/2 cups shredded Monterey Jack or Cheddar Jack cheese"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 425 F. Mash beef with 1 tsp salt and baking soda in a bowl. Let sit 20 minutes."},
    {"instruction": "Place pepper halves cut side up in a 9x13 baking dish. Drizzle with 1 tbsp oil and 1/4 tsp salt. Roast for about 20 minutes."},
    {"instruction": "Meanwhile, heat remaining 2 tbsp oil over medium heat. Cook onion 3-4 minutes, add garlic for 1 minute. Add beef, chili powder, cumin, oregano and increase heat. Cook until browned, 4-5 minutes."},
    {"instruction": "Add tomato sauce, bring to a boil, reduce heat and cook 2-3 minutes until meat is cooked through. Add rice and 3/4 cup cheese, stir until melted."},
    {"instruction": "Spoon filling into roasted peppers. Sprinkle with remaining 3/4 cup cheese. Bake 10-15 minutes until cheese is melted and bubbling. Serve."}
  ]'::jsonb,
  '{"calories": 381, "fat": "24g", "carbohydrates": "17g", "protein": "24g"}'::jsonb
);

-- 14. Healthy Banana Muffins
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, notes)
VALUES (
  uid,
  'Maple-Sweetened Banana Muffins',
  'Whole wheat, maple-sweetened banana muffins that are fluffy and moist. Easy to make with basic ingredients and one mixing bowl!',
  'breakfast',
  10, 25, 12,
  ARRAY['muffins', 'banana', 'healthy', 'breakfast', 'baking'],
  '[
    {"name": "1/3 cup melted coconut oil or olive oil"},
    {"name": "1/2 cup maple syrup or honey"},
    {"name": "2 eggs, room temperature"},
    {"name": "1 cup packed mashed ripe bananas (about 3 bananas)"},
    {"name": "1/4 cup milk of choice or water"},
    {"name": "1 tsp baking soda"},
    {"name": "1 tsp vanilla extract"},
    {"name": "1/2 tsp salt"},
    {"name": "1/2 tsp cinnamon, plus more for sprinkling"},
    {"name": "1 3/4 cups white whole wheat flour"},
    {"name": "1/3 cup old-fashioned oats (optional), plus more for top"},
    {"name": "1 tsp turbinado sugar for sprinkling on top"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 325 F. Grease 12 cups of a muffin tin with butter or non-stick cooking spray."},
    {"instruction": "In a large bowl, beat the coconut oil and maple syrup together with a whisk. Add the eggs and beat well. Mix in the mashed bananas and milk, followed by the baking soda, vanilla extract, salt and cinnamon."},
    {"instruction": "Add the flour and oats to the bowl and mix with a large spoon, just until combined. Fold in any optional mix-ins (chocolate chips, nuts, dried fruit)."},
    {"instruction": "Divide batter evenly between muffin cups, filling each about two-thirds full. Sprinkle tops with oats and sugar."},
    {"instruction": "Bake for 22-25 minutes, or until a toothpick inserted into a muffin comes out clean. Cool on a wire rack."}
  ]'::jsonb,
  'Room temp 2 days, fridge 4 days, freezer 3 months. Can add up to 3/4 cup chocolate chips, nuts, or dried fruit as mix-ins.'
);

-- 15. Lemon Chia Seed Muffins
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition, notes)
VALUES (
  uid,
  'Lemon Chia Seed Muffins',
  'Soft muffins with the perfect amount of lemon tartness. Delicious for breakfast, a snack or dessert!',
  'breakfast',
  20, 17, 12,
  ARRAY['muffins', 'lemon', 'chia seed', 'breakfast', 'baking'],
  '[
    {"name": "1 3/4 cups all purpose flour"},
    {"name": "1 1/2 tsp baking powder"},
    {"name": "1/2 tsp baking soda"},
    {"name": "1/2 tsp salt"},
    {"name": "2 1/2 tbsp chia seeds"},
    {"name": "1/4 cup avocado oil"},
    {"name": "1/2 cup honey"},
    {"name": "2 tbsp lemon zest"},
    {"name": "1 1/2 tbsp lemon juice"},
    {"name": "2 large eggs, room temperature"},
    {"name": "3/4 cup Greek yogurt (full fat or 2%)"},
    {"name": "1 tsp vanilla extract"},
    {"name": "Optional topping: extra lemon zest + turbinado sugar"},
    {"name": "Optional icing: 1/2 cup powdered sugar + 1 tbsp lemon juice"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 350 F. Line a 12-count muffin pan with cupcake liners."},
    {"instruction": "In a large bowl whisk to combine the flour, baking powder, baking soda, chia seeds, and salt."},
    {"instruction": "In a medium bowl, add the avocado oil, lemon zest, Greek yogurt, honey, vanilla extract, eggs, and lemon juice. Whisk to combine."},
    {"instruction": "Stir the wet ingredients into the dry ingredients until just combined. Do not overmix. Scoop batter evenly into muffin pan (each about 3/4 full)."},
    {"instruction": "Optional: mix extra lemon zest and turbinado sugar and sprinkle over muffin tops."},
    {"instruction": "Bake 15-17 minutes or until a toothpick comes out clean."},
    {"instruction": "Cool in pan 5-10 minutes then transfer to wire rack. Once cooled, drizzle with lemon icing if desired."}
  ]'::jsonb,
  '{"calories": 202, "carbohydrates": "33g", "protein": "5g", "fat": "6g"}'::jsonb,
  'Avoid overmixing. Can swap honey for 1/2 cup maple syrup or 2/3 cup granulated sugar. Use whole fat plain Greek yogurt for best results.'
);

-- 16. Banana Breakfast Cookies
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition, notes)
VALUES (
  uid,
  'Banana Breakfast Cookies',
  'Soft, chewy and naturally sweetened cookies that are great for grab-and-go mornings.',
  'breakfast',
  15, 14, 15,
  ARRAY['cookies', 'banana', 'healthy', 'breakfast', 'oats', 'no flour'],
  '[
    {"name": "3 overripe bananas, mashed"},
    {"name": "1/2 cup Justin''s Cinnamon Almond Butter"},
    {"name": "4 tbsp maple syrup"},
    {"name": "1 tsp vanilla extract"},
    {"name": "2 cups rolled oats"},
    {"name": "1 tsp cinnamon"},
    {"name": "1/4 tsp salt"},
    {"name": "1 tbsp chia seeds"},
    {"name": "1/2 cup mini chocolate chips"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 350 F and line a baking sheet with parchment paper."},
    {"instruction": "In a large bowl, mash the 3 bananas thoroughly with a fork until smooth."},
    {"instruction": "Stir in the almond butter, maple syrup, and vanilla extract until well combined."},
    {"instruction": "Add oats, cinnamon, and salt and stir until evenly mixed. Fold in the chia seeds and mini chocolate chips."},
    {"instruction": "Let the dough rest for 5-10 minutes so the oats and chia seeds absorb moisture."},
    {"instruction": "Scoop about 2 tablespoons per cookie onto baking sheet. Flatten each one gently - these cookies will not spread on their own."},
    {"instruction": "Bake for 13-15 minutes until edges are set and tops look dry. They will firm up as they cool."},
    {"instruction": "Let cool on the pan for 5 minutes before transferring to an airtight container."}
  ]'::jsonb,
  '{"calories": 156, "fat": "7g", "carbohydrates": "21g", "protein": "3.5g"}'::jsonb,
  'For a smoother texture, pulse the oats 5-8 times in a food processor before mixing. Freeze baked cookies for up to 2 months. Pair with eggs or Greek yogurt for a complete breakfast.'
);

-- 17. The "WORST" Chocolate Chip Cookies
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition, notes)
VALUES (
  uid,
  'The "WORST" Chocolate Chip Cookies',
  'Somehow you stumbled upon the absolute worst chocolate chip cookie recipe. (They are dangerously good.)',
  'dessert',
  15, 13, 32,
  ARRAY['cookies', 'chocolate chip', 'baking', 'dessert'],
  '[
    {"name": "1 cup (226g) unsalted butter, melted and cooled"},
    {"name": "1 1/2 cups (300g) light brown sugar, firmly packed"},
    {"name": "1/2 cup (100g) granulated sugar"},
    {"name": "2 large eggs, room temperature"},
    {"name": "1 tsp vanilla extract"},
    {"name": "1/4 cup (60ml) maple syrup"},
    {"name": "3 1/3 cups (415g) all purpose flour"},
    {"name": "2 tsp cornstarch"},
    {"name": "1 tsp baking powder"},
    {"name": "1 tsp baking soda"},
    {"name": "1 tsp salt"},
    {"name": "2 cups (340g) chocolate chips (half regular, half mini semisweet)"}
  ]'::jsonb,
  '[
    {"instruction": "In a large bowl, stir together melted butter and sugars."},
    {"instruction": "Add eggs, one at a time, stirring until combined."},
    {"instruction": "Stir in vanilla extract and maple syrup."},
    {"instruction": "In a separate bowl, whisk together flour, cornstarch, baking powder, baking soda, and salt."},
    {"instruction": "Gradually add flour mixture to wet ingredients, stirring until completely combined."},
    {"instruction": "Stir in chocolate chips."},
    {"instruction": "Cover bowl with plastic wrap and chill for at least 30 minutes (and up to 3 days - longer chill = better cookies)."},
    {"instruction": "Preheat oven to 350 F. Line cookie sheets with parchment paper."},
    {"instruction": "Scoop about 2 Tablespoons of dough, roll into balls slightly taller than wide. Place 2 inches apart."},
    {"instruction": "Bake about 13 minutes (cookies will appear slightly underdone, edges just beginning to turn golden). Allow to cool completely on cookie sheet."}
  ]'::jsonb,
  '{"calories": 223, "carbohydrates": "33g", "protein": "2g", "fat": "10g"}'::jsonb,
  'Do NOT skip the maple syrup, it is critical to the flavor. Butter should not be too hot or dough will be runny. Chill dough at least 30 min. Do not place dough on a hot cookie sheet. Store at room temp up to 1 week.'
);

-- 18. Best Ever Chewy Brownies
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, notes)
VALUES (
  uid,
  'Best Ever Chewy Brownies',
  'Just as chewy as boxed brownies but packed with way more chocolate flavor. One bowl recipe made in less than 1 hour!',
  'dessert',
  15, 30, 9,
  ARRAY['brownies', 'chocolate', 'baking', 'dessert', 'one bowl'],
  '[
    {"name": "5 tbsp (71g) unsalted butter"},
    {"name": "1 1/4 cups (249g) granulated sugar"},
    {"name": "2 large eggs plus 1 egg yolk, cold"},
    {"name": "1 tsp vanilla extract"},
    {"name": "1/3 cup vegetable oil"},
    {"name": "3/4 cup (75g) unsweetened cocoa powder"},
    {"name": "1/2 cup (63g) all-purpose flour"},
    {"name": "1/8 tsp baking soda"},
    {"name": "1 tbsp cornstarch"},
    {"name": "1/4 tsp salt"},
    {"name": "3/4 cup (128g) semisweet chocolate chips"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 325 F. Line an 8x8 inch pan with foil or parchment paper and spray with nonstick cooking spray."},
    {"instruction": "In a microwave safe bowl, add the butter and sugar. Microwave for about 1 minute until butter is melted. Whisk in eggs, egg yolk, and vanilla. Stir in the oil and cocoa powder."},
    {"instruction": "With a rubber spatula, stir in the flour, baking soda, cornstarch, and salt until combined. Stir in the chocolate chips."},
    {"instruction": "Spread batter evenly into prepared pan. Bake for 30 minutes, or until set and a cake tester has moist crumbs attached. Do not overcook."},
    {"instruction": "Let cool completely before cutting and serving."}
  ]'::jsonb,
  'To double, use a 9x13 pan and bake for the same amount of time. Store in an airtight container at room temperature for up to 3 days.'
);

-- 19. Super Moist Spice Cake
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, notes)
VALUES (
  uid,
  'Super Moist Spice Cake',
  'Homemade and super moist spice cake with tangy cream cheese frosting. Easy recipe packed with tons of flavor!',
  'dessert',
  30, 50, 12,
  ARRAY['cake', 'spice', 'baking', 'dessert', 'cream cheese frosting'],
  '[
    {"name": "2 1/2 cups all-purpose flour"},
    {"name": "2 tsp baking powder"},
    {"name": "1 tsp baking soda"},
    {"name": "1/2 tsp salt"},
    {"name": "1 1/2 tsp ground cinnamon"},
    {"name": "1 tsp ground ginger"},
    {"name": "1/2 tsp ground nutmeg"},
    {"name": "1/2 tsp ground cloves"},
    {"name": "1 cup vegetable oil"},
    {"name": "1 3/4 cup packed dark brown sugar"},
    {"name": "1 cup unsweetened applesauce"},
    {"name": "4 large eggs"},
    {"name": "2 tsp pure vanilla extract"},
    {"name": "1 cup shredded apple (or carrot/zucchini)"},
    {"name": "Optional: 1 Tbsp unsulphured molasses"},
    {"name": "Frosting: 8 oz cream cheese, softened"},
    {"name": "Frosting: 1/2 cup unsalted butter, softened"},
    {"name": "Frosting: 3 cups confectioners sugar"},
    {"name": "Frosting: 1 tsp vanilla extract"},
    {"name": "Frosting: 1/8 tsp salt"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 350 F and grease a 9x13-inch pan."},
    {"instruction": "Whisk flour, baking powder, baking soda, salt, cinnamon, ginger, nutmeg, and cloves together in a large bowl."},
    {"instruction": "Whisk oil, brown sugar, applesauce, eggs, vanilla, and molasses (if using) in a medium bowl. Pour into dry ingredients and whisk until combined. Fold in shredded apple."},
    {"instruction": "Spread batter into prepared pan. Bake for 45-50 minutes until a toothpick comes out clean. If top browns too quickly, loosely cover with foil."},
    {"instruction": "Remove from oven and cool completely on a wire rack."},
    {"instruction": "Make the frosting: Beat cream cheese and butter on high until smooth. Add confectioners sugar, vanilla, and salt. Beat on low 30 seconds, then high for 2 minutes. Spread on cooled cake."},
    {"instruction": "Refrigerate 30 minutes before serving to set the frosting."}
  ]'::jsonb,
  'Store in fridge for up to 5 days. Can also be made as a layer cake (two 9-inch rounds, bake 30-34 min) or cupcakes (24 cupcakes, bake 18-21 min).'
);

-- 20. Old Fashioned Easy Apple Crisp
INSERT INTO recipes (user_id, title, description, category, prep_minutes, cook_minutes, servings, tags, ingredients, steps, nutrition, notes)
VALUES (
  uid,
  'Old Fashioned Easy Apple Crisp',
  'Made the old fashioned way like Grandma used to make. Perfect with a scoop of vanilla ice cream and salted caramel sauce!',
  'dessert',
  15, 45, 6,
  ARRAY['apple', 'crisp', 'baking', 'dessert', 'fall'],
  '[
    {"name": "6 golden delicious apples, peeled and chopped"},
    {"name": "2 Tbsp granulated sugar"},
    {"name": "1 3/4 tsp ground cinnamon, divided"},
    {"name": "1 1/2 tsp lemon juice"},
    {"name": "1 cup light brown sugar"},
    {"name": "3/4 cup old fashioned oats"},
    {"name": "3/4 cup all-purpose flour"},
    {"name": "1/2 cup cold unsalted butter, diced into small cubes"},
    {"name": "Pinch of kosher salt"}
  ]'::jsonb,
  '[
    {"instruction": "Preheat oven to 350 F. Butter an 8x8 baking dish."},
    {"instruction": "In a mixing bowl, add chopped apples, granulated sugar, 3/4 tsp cinnamon and lemon juice. Stir to combine, then transfer to prepared baking dish."},
    {"instruction": "In a separate bowl, add brown sugar, oats, flour, 1 tsp cinnamon, salt, and diced cold butter. Use a pastry cutter (or two forks/hands) to cut the butter into the oat mixture until it resembles pea-sized crumbs."},
    {"instruction": "Spread topping over apples in baking dish and gently pat to even it out."},
    {"instruction": "Bake 40-50 minutes until golden brown and bubbly. Serve warm!"}
  ]'::jsonb,
  '{"calories": 301}'::jsonb,
  'The amount of chopped apples would be about 6-7 cups. Other apple varieties can be used. Serve with vanilla ice cream!'
);

END $$;
