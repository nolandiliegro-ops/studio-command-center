-- =============================================
-- FORCE RESET RLS - Fix OAuth users blocked from viewing data
-- This migration completely resets RLS policies to ensure both
-- anonymous AND authenticated users can read public catalog data
-- =============================================

-- DISABLE RLS temporarily to clean slate
ALTER TABLE public.brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scooter_models DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_compatibility DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials DISABLE ROW LEVEL SECURITY;

-- DROP ALL existing policies to avoid conflicts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on brands
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'brands' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.brands';
    END LOOP;
    
    -- Drop all policies on categories
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'categories' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.categories';
    END LOOP;
    
    -- Drop all policies on parts
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'parts' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.parts';
    END LOOP;
    
    -- Drop all policies on scooter_models
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'scooter_models' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.scooter_models';
    END LOOP;
    
    -- Drop all policies on part_compatibility
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'part_compatibility' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.part_compatibility';
    END LOOP;
    
    -- Drop all policies on tutorials
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'tutorials' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.tutorials';
    END LOOP;
END $$;

-- RE-ENABLE RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scooter_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_compatibility ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tutorials ENABLE ROW LEVEL SECURITY;

-- CREATE SIMPLE PERMISSIVE POLICIES
-- Allow EVERYONE (anon + authenticated) to read public catalog data

CREATE POLICY "allow_all_select_brands" 
  ON public.brands FOR SELECT 
  USING (true);

CREATE POLICY "allow_all_select_categories" 
  ON public.categories FOR SELECT 
  USING (true);

CREATE POLICY "allow_all_select_parts" 
  ON public.parts FOR SELECT 
  USING (true);

CREATE POLICY "allow_all_select_scooter_models" 
  ON public.scooter_models FOR SELECT 
  USING (true);

CREATE POLICY "allow_all_select_part_compatibility" 
  ON public.part_compatibility FOR SELECT 
  USING (true);

CREATE POLICY "allow_all_select_tutorials" 
  ON public.tutorials FOR SELECT 
  USING (true);

-- Add comments for clarity
COMMENT ON POLICY "allow_all_select_brands" ON public.brands IS 
  'Allows everyone (anonymous and authenticated users including OAuth) to view all brands';

COMMENT ON POLICY "allow_all_select_parts" ON public.parts IS 
  'Allows everyone (anonymous and authenticated users including OAuth) to view all parts';

COMMENT ON POLICY "allow_all_select_scooter_models" ON public.scooter_models IS 
  'Allows everyone (anonymous and authenticated users including OAuth) to view all scooter models';
