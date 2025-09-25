-- Add missing columns to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_price NUMERIC,
ADD COLUMN IF NOT EXISTS badge TEXT,
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Fix blog_posts table column name
ALTER TABLE public.blog_posts 
RENAME COLUMN published TO is_published;

-- Update products with sample data
UPDATE public.products SET 
  rating = 4.5 + (random() * 1.0),
  review_count = floor(random() * 500 + 10)::integer,
  original_price = price * 1.2,
  stock = floor(random() * 100 + 20)::integer,
  is_active = true
WHERE rating IS NULL;

-- Add some badges to products
UPDATE public.products SET badge = 'Best Seller' WHERE name ILIKE '%lavender%';
UPDATE public.products SET badge = 'New' WHERE name ILIKE '%coffee%';
UPDATE public.products SET badge = 'Sale' WHERE name ILIKE '%oatmeal%';