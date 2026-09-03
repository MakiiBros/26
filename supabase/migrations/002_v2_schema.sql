-- MakiBros v2.0 — Migración de esquema
-- Nuevos campos para dishes, profiles, y tabla store_settings

-- Agregar campos a dishes para descuentos y destacados
ALTER TABLE public.dishes ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100);
ALTER TABLE public.dishes ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;
ALTER TABLE public.dishes ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false;

-- Agregar campos a profiles para datos del cliente
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Tabla de configuración de la tienda (singleton)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_days TEXT[] DEFAULT ARRAY['lunes','martes','miércoles','jueves','viernes','sábado'],
  open_time TIME DEFAULT '12:00',
  close_time TIME DEFAULT '22:00',
  allows_reservations BOOLEAN DEFAULT true,
  delivery_enabled BOOLEAN DEFAULT true,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  tiktok_url TEXT DEFAULT 'https://www.tiktok.com/@makibros.of',
  instagram_url TEXT,
  facebook_url TEXT,
  about_text TEXT DEFAULT 'MakiBros — Fusión peruano-japonesa que despierta tus sentidos. Los mejores makis, rolls, ceviches y tiraditos de la ciudad.',
  hero_image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS para store_settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY store_settings_select_public ON public.store_settings FOR SELECT USING (true);
CREATE POLICY store_settings_insert_admin ON public.store_settings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY store_settings_update_admin ON public.store_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger updated_at para store_settings
CREATE TRIGGER trg_store_settings_updated_at
  BEFORE UPDATE ON public.store_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Seed de configuración inicial
INSERT INTO public.store_settings (
  phone, whatsapp, email, address, tiktok_url, about_text
) VALUES (
  '', '', '', '',
  'https://www.tiktok.com/@makibros.of',
  'MakiBros — Fusión peruano-japonesa que despierta tus sentidos. Nuestros makis, rolls especiales, ceviches y tiraditos están hechos con ingredientes frescos y la pasión de combinar lo mejor de la cocina peruana y japonesa.'
);

-- Índices adicionales
CREATE INDEX IF NOT EXISTS idx_dishes_is_popular ON public.dishes (is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_dishes_is_promoted ON public.dishes (is_promoted) WHERE is_promoted = true;
CREATE INDEX IF NOT EXISTS idx_dishes_discount ON public.dishes (discount_percentage) WHERE discount_percentage > 0;
