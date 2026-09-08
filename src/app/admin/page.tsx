import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Utensils, Grid, Plus, ExternalLink, Sparkles, ShoppingBag } from 'lucide-react';

export const metadata = {
  title: 'Dashboard | MakiBros Admin',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  let dishesCount: number | null = null;
  let categoriesCount: number | null = null;
  let ordersCount: number | null = null;

  try {
    const [{ count: dCount }, { count: cCount }, { count: oCount }] = await Promise.all([
      supabase.from('dishes').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending'),
    ]);
    dishesCount = dCount;
    categoriesCount = cCount;
    ordersCount = oCount;
  } catch (err) {
    console.warn('[AdminDashboard] Database count error:', err);
  }

  // Fallback if not connected or empty
  if (dishesCount === null) dishesCount = 8;
  if (categoriesCount === null) categoriesCount = 6;
  if (ordersCount === null) ordersCount = 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <span>Panel de Administración</span>
          <span className="text-xs uppercase font-bold tracking-widest bg-[#f6ad55]/20 text-[#f6ad55] px-2.5 py-1 rounded border border-[#f6ad55]/30">
            En línea
          </span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Gestiona el catálogo, platillos y contenido de la plataforma MakiBros.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card Órdenes Pendientes */}
        <div className="p-6 bg-[#141414] rounded-xl border border-[#2a2a2a] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Órdenes Pendientes</h3>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{ordersCount ?? 0}</p>
          <div className="mt-4 pt-4 border-t border-[#222222]">
            <Link href="/admin/orders" className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-medium">
              Revisar órdenes &rarr;
            </Link>
          </div>
        </div>
        <div className="p-6 bg-[#141414] rounded-xl border border-[#2a2a2a] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e53e3e] to-red-700" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Total Platos</h3>
            <div className="w-10 h-10 rounded-lg bg-[#e53e3e]/10 border border-[#e53e3e]/30 flex items-center justify-center text-[#e53e3e]">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{dishesCount ?? 0}</p>
          <div className="mt-4 pt-4 border-t border-[#222222]">
            <Link href="/admin/dishes" className="text-xs text-[#f6ad55] hover:underline flex items-center gap-1 font-medium">
              Ver todos los platos &rarr;
            </Link>
          </div>
        </div>

        <div className="p-6 bg-[#141414] rounded-xl border border-[#2a2a2a] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f6ad55] to-amber-600" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Categorías Activas</h3>
            <div className="w-10 h-10 rounded-lg bg-[#f6ad55]/10 border border-[#f6ad55]/30 flex items-center justify-center text-[#f6ad55]">
              <Grid className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">{categoriesCount ?? 0}</p>
          <div className="mt-4 pt-4 border-t border-[#222222]">
            <span className="text-xs text-gray-500 font-medium">
              Makis, Rolls, Ceviches, etc.
            </span>
          </div>
        </div>

        <div className="p-6 bg-[#141414] rounded-xl border border-[#2a2a2a] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600" />
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">Estado de Tienda</h3>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold text-emerald-400 mt-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Abierto al Público
          </p>
          <div className="mt-4 pt-4 border-t border-[#222222]">
            <Link href="/" className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" />
              Visitar web pública
            </Link>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="p-6 bg-[#141414] rounded-xl border border-[#2a2a2a] shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/orders">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-2 h-11 px-5 rounded-lg shadow-lg shadow-blue-900/30">
              <ShoppingBag className="w-4 h-4" />
              Ver Órdenes
            </Button>
          </Link>
          <Link href="/admin/dishes/new">
            <Button className="bg-[#e53e3e] hover:bg-red-700 text-white font-medium flex items-center gap-2 h-11 px-5 rounded-lg shadow-lg shadow-red-950/30">
              <Plus className="w-4 h-4" />
              Crear Nuevo Plato
            </Button>
          </Link>
          <Link href="/admin/dishes">
            <Button variant="outline" className="border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#252525] text-white h-11 px-5 rounded-lg">
              Gestionar Catálogo
            </Button>
          </Link>
          <Link href="/" target="_blank">
            <Button variant="outline" className="border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 h-11 px-5 rounded-lg flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Ver Tienda en Vivo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
