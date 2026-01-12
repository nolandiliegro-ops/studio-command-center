-- Phase 1: Add installation columns to parts table
ALTER TABLE public.parts 
ADD COLUMN IF NOT EXISTS estimated_install_time_minutes INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS required_tools TEXT[] DEFAULT NULL;

-- Populate existing parts with realistic installation data based on difficulty level
-- Easy parts (difficulty 1-2): Quick installs, minimal tools
UPDATE public.parts SET 
  estimated_install_time_minutes = 10,
  required_tools = ARRAY['Aucun outil requis']
WHERE difficulty_level = 1 AND estimated_install_time_minutes IS NULL;

UPDATE public.parts SET 
  estimated_install_time_minutes = 15,
  required_tools = ARRAY['Clé Allen 4mm']
WHERE difficulty_level = 2 AND estimated_install_time_minutes IS NULL;

-- Medium parts (difficulty 3): Moderate install, basic toolkit
UPDATE public.parts SET 
  estimated_install_time_minutes = 30,
  required_tools = ARRAY['Clé Allen 4mm', 'Tournevis cruciforme', 'Démonte-pneu']
WHERE difficulty_level = 3 AND estimated_install_time_minutes IS NULL;

-- Hard parts (difficulty 4): Complex install, full toolkit
UPDATE public.parts SET 
  estimated_install_time_minutes = 60,
  required_tools = ARRAY['Kit clés Allen', 'Tournevis', 'Clé à molette', 'Extracteur']
WHERE difficulty_level = 4 AND estimated_install_time_minutes IS NULL;

-- Expert parts (difficulty 5): Professional install, specialized tools
UPDATE public.parts SET 
  estimated_install_time_minutes = 120,
  required_tools = ARRAY['Kit professionnel complet', 'Multimètre', 'Station de soudure']
WHERE difficulty_level = 5 AND estimated_install_time_minutes IS NULL;

-- Fallback for parts without difficulty level set
UPDATE public.parts SET 
  estimated_install_time_minutes = 20,
  required_tools = ARRAY['Outillage basique']
WHERE difficulty_level IS NULL AND estimated_install_time_minutes IS NULL;