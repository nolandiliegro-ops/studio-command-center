-- Fix OAuth user profile creation and RLS policies
-- This migration ensures OAuth users (Google, etc.) can access their data

-- 1. Create profiles for existing OAuth users who don't have one
INSERT INTO public.profiles (id, display_name, performance_points, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name', 
    au.email,
    'Rider'
  ) as display_name,
  100 as performance_points,
  now() as created_at,
  now() as updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 2. Update handle_new_user function to better handle OAuth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Extract display name from various OAuth metadata fields
  INSERT INTO public.profiles (id, display_name, performance_points)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'full_name',  -- Google OAuth
      new.raw_user_meta_data->>'name',       -- Generic OAuth
      new.raw_user_meta_data->>'display_name', -- Custom field
      split_part(new.email, '@', 1),         -- Email username
      'Rider'                                 -- Fallback
    ),
    100
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    updated_at = now();
  
  RETURN new;
END;
$$;

-- 3. Add helpful comments
COMMENT ON POLICY "Users can view own garage" ON public.user_garage IS 
  'Allows authenticated users (including OAuth) to view their own garage items using auth.uid()';

COMMENT ON POLICY "Users can view own profile" ON public.profiles IS 
  'Allows authenticated users (including OAuth) to view their own profile using auth.uid()';
