-- ============================================================
-- MAKISBROS — Migración inicial del esquema de base de datos
-- ============================================================
-- Descripción: Crea todas las tablas, índices, funciones,
--   triggers, políticas RLS y datos semilla necesarios para
--   la plataforma de catálogo de menú del restaurante.
-- Fecha de creación: 2026-09-02
-- ============================================================


-- ============================================================
-- 1. EXTENSIONES
-- ============================================================
-- Habilitar pgcrypto para disponer de gen_random_uuid() en la
-- generación automática de identificadores UUID.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ============================================================
-- 2. TABLAS
-- ============================================================


-- ------------------------------------------------------------
-- 2.1 Perfiles de usuario (public.profiles)
-- ------------------------------------------------------------
-- Cada fila se vincula 1:1 con auth.users. El campo `role`
-- determina los permisos dentro de la aplicación:
--   • 'user'  → usuario regular (valor por defecto)
--   • 'admin' → administrador con acceso total al CRUD
-- ------------------------------------------------------------

CREATE TABLE public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.profiles      IS 'Perfiles de usuario vinculados a auth.users';
COMMENT ON COLUMN public.profiles.role IS 'Rol del usuario: user | admin';


-- ------------------------------------------------------------
-- 2.2 Categorías del menú (public.categories)
-- ------------------------------------------------------------
-- Agrupa los platillos en secciones del menú. El campo `slug`
-- se utiliza para URLs amigables, y `sort_order` controla el
-- orden de visualización en el frontend.
-- ------------------------------------------------------------

CREATE TABLE public.categories (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL UNIQUE,
  slug       TEXT        NOT NULL UNIQUE,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.categories           IS 'Categorías del menú del restaurante';
COMMENT ON COLUMN public.categories.slug       IS 'Identificador amigable para URLs';
COMMENT ON COLUMN public.categories.sort_order IS 'Orden de visualización (ascendente)';


-- ------------------------------------------------------------
-- 2.3 Platillos (public.dishes)
-- ------------------------------------------------------------
-- Cada platillo pertenece a exactamente una categoría.
-- El precio no puede ser negativo. `is_available` permite
-- ocultar temporalmente un platillo sin eliminarlo.
-- `updated_at` se actualiza automáticamente mediante trigger.
-- ------------------------------------------------------------

CREATE TABLE public.dishes (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id  UUID         NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name         TEXT         NOT NULL,
  description  TEXT,
  price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url    TEXT,
  is_available BOOLEAN      NOT NULL DEFAULT true,
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.dishes              IS 'Platillos individuales del menú';
COMMENT ON COLUMN public.dishes.category_id  IS 'FK hacia la categoría a la que pertenece';
COMMENT ON COLUMN public.dishes.price        IS 'Precio del platillo (≥ 0)';
COMMENT ON COLUMN public.dishes.is_available IS 'Disponibilidad actual del platillo';
COMMENT ON COLUMN public.dishes.sort_order   IS 'Orden de visualización dentro de su categoría';


-- ============================================================
-- 3. ÍNDICES
-- ============================================================
-- Índices adicionales para optimizar las consultas más
-- frecuentes del frontend y del panel de administración.
-- ============================================================

-- Búsqueda de platillos por categoría
CREATE INDEX idx_dishes_category_id  ON public.dishes (category_id);

-- Filtrado rápido por disponibilidad
CREATE INDEX idx_dishes_is_available ON public.dishes (is_available);

-- Ordenamiento de platillos dentro de una categoría
CREATE INDEX idx_dishes_sort_order   ON public.dishes (sort_order);

-- Búsqueda de categoría por slug (resolución de URLs)
CREATE INDEX idx_categories_slug       ON public.categories (slug);

-- Ordenamiento global de categorías
CREATE INDEX idx_categories_sort_order ON public.categories (sort_order);


-- ============================================================
-- 4. FUNCIONES Y TRIGGERS
-- ============================================================


-- ------------------------------------------------------------
-- 4.1 Actualización automática de updated_at
-- ------------------------------------------------------------
-- Esta función se ejecuta ANTES de cada UPDATE en la tabla
-- dishes para mantener el campo updated_at sincronizado.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at()
  IS 'Establece updated_at = now() automáticamente en cada UPDATE';

CREATE TRIGGER trg_dishes_updated_at
  BEFORE UPDATE ON public.dishes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- ------------------------------------------------------------
-- 4.2 Creación automática de perfil para nuevos usuarios
-- ------------------------------------------------------------
-- Cuando un usuario se registra en auth.users, este trigger
-- inserta automáticamente una fila en public.profiles con el
-- rol por defecto 'user'.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user()
  IS 'Crea un perfil con rol user al registrar un nuevo usuario';

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Habilitamos RLS en todas las tablas y definimos políticas
-- granulares según el rol del usuario autenticado.
-- ============================================================

ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes     ENABLE ROW LEVEL SECURITY;


-- ------------------------------------------------------------
-- 5.1 Políticas para public.profiles
-- ------------------------------------------------------------
-- Los usuarios solo pueden leer y modificar su propio perfil.
-- ------------------------------------------------------------

-- Lectura: cada usuario ve únicamente su perfil
CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Actualización: cada usuario edita únicamente su perfil
CREATE POLICY profiles_update_own
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);


-- ------------------------------------------------------------
-- 5.2 Políticas para public.categories
-- ------------------------------------------------------------
-- Lectura pública (anon + authenticated).
-- Escritura restringida a administradores.
-- ------------------------------------------------------------

-- Lectura: acceso público sin restricciones
CREATE POLICY categories_select_public
  ON public.categories
  FOR SELECT
  USING (true);

-- Inserción: solo administradores
CREATE POLICY categories_insert_admin
  ON public.categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Actualización: solo administradores
CREATE POLICY categories_update_admin
  ON public.categories
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Eliminación: solo administradores
CREATE POLICY categories_delete_admin
  ON public.categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ------------------------------------------------------------
-- 5.3 Políticas para public.dishes
-- ------------------------------------------------------------
-- Mismo patrón que categorías: lectura pública, escritura
-- restringida a administradores.
-- ------------------------------------------------------------

-- Lectura: acceso público sin restricciones
CREATE POLICY dishes_select_public
  ON public.dishes
  FOR SELECT
  USING (true);

-- Inserción: solo administradores
CREATE POLICY dishes_insert_admin
  ON public.dishes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Actualización: solo administradores
CREATE POLICY dishes_update_admin
  ON public.dishes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Eliminación: solo administradores
CREATE POLICY dishes_delete_admin
  ON public.dishes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ============================================================
-- 6. ALMACENAMIENTO (Storage) — Bucket de imágenes
-- ============================================================
-- Bucket público para las imágenes de los platillos.
-- Límite de 5 MB por archivo. Solo formatos de imagen
-- permitidos: JPEG, PNG, WebP y AVIF.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dish-images',
  'dish-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);


-- ------------------------------------------------------------
-- 6.1 Políticas RLS para storage.objects (bucket dish-images)
-- ------------------------------------------------------------
-- Lectura pública; escritura, actualización y eliminación
-- restringidas a administradores.
-- Se usa (select auth.uid()) en lugar de auth.uid() para
-- optimizar el rendimiento (evita re-evaluación por fila).
-- ------------------------------------------------------------

-- Lectura pública de imágenes
CREATE POLICY storage_dish_images_select_public
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'dish-images');

-- Subida de imágenes: solo administradores
CREATE POLICY storage_dish_images_insert_admin
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'dish-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Actualización de imágenes: solo administradores
CREATE POLICY storage_dish_images_update_admin
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'dish-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );

-- Eliminación de imágenes: solo administradores
CREATE POLICY storage_dish_images_delete_admin
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'dish-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = (select auth.uid()) AND role = 'admin'
    )
  );


-- ============================================================
-- 7. DATOS SEMILLA (Seed Data)
-- ============================================================
-- Categorías iniciales del menú. El campo sort_order define
-- el orden en que aparecen en la interfaz del cliente.
-- ============================================================

INSERT INTO public.categories (name, slug, sort_order) VALUES
  ('Makis',            'makis',            1),
  ('Rolls Especiales', 'rolls-especiales', 2),
  ('Ceviches',         'ceviches',         3),
  ('Tiraditos',        'tiraditos',        4),
  ('Bebidas',          'bebidas',          5),
  ('Postres',          'postres',          6);


-- ============================================================
-- FIN DE LA MIGRACIÓN INICIAL
-- ============================================================
