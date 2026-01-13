-- =============================================
-- CORRECTION DES POLITIQUES RLS - PROFILS
-- =============================================

-- 1. Politique INSERT - Permet aux nouveaux utilisateurs de créer leur profil
CREATE POLICY "Users can create own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 2. Politique DELETE - Conformité RGPD
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);