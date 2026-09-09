-- Eliminar la política permisiva para evitar spam desde clientes anónimos
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;

-- Ahora, por defecto, nadie puede hacer INSERT en public.orders desde el cliente anónimo (anon).
-- Las inserciones se harán exclusivamente desde el backend de Next.js usando la SERVICE_ROLE_KEY.

-- Para mantener funcionalidad del panel admin, permitimos insert a usuarios autenticados.
CREATE POLICY "Authenticated users can insert orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (true);
