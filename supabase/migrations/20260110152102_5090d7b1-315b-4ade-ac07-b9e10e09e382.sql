-- =============================================
-- SCHEMA: piècestrottinettes.fr Database
-- =============================================

-- Table: brands (Marques de trottinettes)
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: scooter_models (Modèles de trottinettes avec specs techniques)
CREATE TABLE public.scooter_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    power_watts INTEGER,
    range_km INTEGER,
    max_speed_kmh INTEGER,
    voltage INTEGER,
    tire_size TEXT,
    compatible_parts_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: categories (Catégories de pièces)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    product_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: parts (Pièces détachées avec metadata JSONB)
CREATE TABLE public.parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    stock_quantity INTEGER DEFAULT 0,
    technical_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table: part_compatibility (Liaison pièces <-> modèles)
CREATE TABLE public.part_compatibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id UUID NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
    scooter_model_id UUID NOT NULL REFERENCES public.scooter_models(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(part_id, scooter_model_id)
);

-- =============================================
-- INDEXES pour performance
-- =============================================
CREATE INDEX idx_scooter_models_brand ON public.scooter_models(brand_id);
CREATE INDEX idx_parts_category ON public.parts(category_id);
CREATE INDEX idx_part_compatibility_part ON public.part_compatibility(part_id);
CREATE INDEX idx_part_compatibility_model ON public.part_compatibility(scooter_model_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scooter_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_compatibility ENABLE ROW LEVEL SECURITY;

-- Public Read policies (tout le monde peut voir les produits)
CREATE POLICY "Public can read brands" ON public.brands
    FOR SELECT USING (true);

CREATE POLICY "Public can read scooter_models" ON public.scooter_models
    FOR SELECT USING (true);

CREATE POLICY "Public can read categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read parts" ON public.parts
    FOR SELECT USING (true);

CREATE POLICY "Public can read part_compatibility" ON public.part_compatibility
    FOR SELECT USING (true);

-- =============================================
-- TRIGGER: Update updated_at on parts
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_parts_updated_at
    BEFORE UPDATE ON public.parts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- SEED DATA: Marques
-- =============================================
INSERT INTO public.brands (name, slug, logo_url) VALUES
    ('Xiaomi', 'xiaomi', NULL),
    ('Ninebot', 'ninebot', NULL),
    ('Segway', 'segway', NULL),
    ('Dualtron', 'dualtron', NULL),
    ('Kaabo', 'kaabo', NULL);

-- =============================================
-- SEED DATA: Modèles de trottinettes
-- =============================================
INSERT INTO public.scooter_models (brand_id, name, slug, image_url, power_watts, range_km, max_speed_kmh, voltage, tire_size, compatible_parts_count)
SELECT 
    b.id,
    m.name,
    m.slug,
    m.image_url,
    m.power_watts,
    m.range_km,
    m.max_speed_kmh,
    m.voltage,
    m.tire_size,
    m.compatible_parts_count
FROM (VALUES
    ('xiaomi', 'Mi Pro 2', 'mi-pro-2', NULL, 300, 45, 25, 36, '8.5"', 89),
    ('xiaomi', 'Mi Essential', 'mi-essential', NULL, 250, 20, 20, 36, '8.5"', 67),
    ('xiaomi', 'Mi 3', 'mi-3', NULL, 300, 30, 25, 36, '8.5"', 78),
    ('ninebot', 'G30 Max', 'g30-max', NULL, 350, 65, 25, 36, '10"', 124),
    ('ninebot', 'F40', 'f40', NULL, 350, 40, 25, 36, '10"', 56),
    ('segway', 'P100S', 'p100s', NULL, 650, 100, 30, 48, '10.5"', 92),
    ('segway', 'Ninebot Max G2', 'ninebot-max-g2', NULL, 450, 70, 25, 36, '10"', 88),
    ('dualtron', 'Thunder', 'thunder', NULL, 5400, 120, 85, 60, '11"', 156),
    ('dualtron', 'Victor', 'victor', NULL, 4000, 100, 80, 60, '11"', 134),
    ('kaabo', 'Mantis Pro', 'mantis-pro', NULL, 2000, 60, 60, 60, '10"', 78),
    ('kaabo', 'Wolf Warrior', 'wolf-warrior', NULL, 2400, 80, 80, 60, '11"', 112)
) AS m(brand_slug, name, slug, image_url, power_watts, range_km, max_speed_kmh, voltage, tire_size, compatible_parts_count)
JOIN public.brands b ON b.slug = m.brand_slug;

-- =============================================
-- SEED DATA: Catégories
-- =============================================
INSERT INTO public.categories (name, slug, icon, display_order, product_count) VALUES
    ('Pneus', 'pneus', '🔘', 1, 156),
    ('Chambres à Air', 'chambres-air', '⭕', 2, 89),
    ('Freinage', 'freinage', '🛑', 3, 124),
    ('Chargeurs', 'chargeurs', '🔌', 4, 78),
    ('Batteries', 'batteries', '🔋', 5, 45),
    ('Accessoires', 'accessoires', '🎒', 6, 234);