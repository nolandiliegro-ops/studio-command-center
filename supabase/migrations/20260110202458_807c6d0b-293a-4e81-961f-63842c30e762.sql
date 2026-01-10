-- Table profiles pour données utilisateur + points fidélité
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  performance_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS : Lecture/Modification du propre profil uniquement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Trigger pour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Table user_garage pour véhicules (owned + collection)
CREATE TABLE public.user_garage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  scooter_model_id uuid REFERENCES public.scooter_models(id) ON DELETE CASCADE NOT NULL,
  is_owned boolean DEFAULT false,
  nickname text,
  next_maintenance_km integer,
  current_km integer DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scooter_model_id)
);

-- RLS : CRUD sur son propre garage uniquement
ALTER TABLE public.user_garage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own garage"
  ON public.user_garage FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own garage"
  ON public.user_garage FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garage"
  ON public.user_garage FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own garage"
  ON public.user_garage FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Fonction auto-création profil avec 100 points bienvenue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, performance_points)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'display_name', 'Rider'),
    100
  );
  RETURN new;
END;
$$;

-- Trigger déclenché à chaque nouvel utilisateur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();