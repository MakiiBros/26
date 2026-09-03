import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { DeleteDishButton } from '@/components/admin/delete-dish-button';
import { Plus, Utensils } from 'lucide-react';

export const metadata = {
  title: 'Gestión de Platos | MakiiBros Admin',
};

export default async function AdminDishesPage() {
  const supabase = await createClient();

  const { data: dishes, error } = await supabase
    .from('dishes')
    .select('*, categories(name)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false }); 
    
  if (error) {
    console.error('Error al cargar platos:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-[#e53e3e]" />
            Catálogo de Platos
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Administra los platillos disponibles en el menú de MakiiBros.
          </p>
        </div>
        <Link href="/admin/dishes/new">
          <Button className="bg-[#e53e3e] hover:bg-red-700 text-white font-medium flex items-center gap-2 rounded-lg px-4 h-11 shadow-lg shadow-red-950/30">
            <Plus className="w-4 h-4" />
            Nuevo Plato
          </Button>
        </Link>
      </div>

      <div className="bg-[#141414] shadow-xl rounded-xl overflow-hidden border border-[#2a2a2a]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-[#1a1a1a] text-gray-400 border-b border-[#2a2a2a]">
              <tr>
                <th scope="col" className="px-6 py-4">Imagen</th>
                <th scope="col" className="px-6 py-4">Nombre</th>
                <th scope="col" className="px-6 py-4">Categoría</th>
                <th scope="col" className="px-6 py-4">Precio</th>
                <th scope="col" className="px-6 py-4">Estado</th>
                <th scope="col" className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {dishes && dishes.length > 0 ? (
                dishes.map((dish: any) => (
                  <tr key={dish.id} className="hover:bg-[#1a1a1a]/60 transition-colors">
                    <td className="px-6 py-4">
                      {dish.image_url ? (
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#2a2a2a] bg-black">
                          <Image 
                            src={dish.image_url} 
                            alt={dish.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                          Sin foto
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      {dish.name}
                      {dish.description && (
                        <p className="text-xs text-gray-400 font-normal truncate max-w-xs mt-0.5">
                          {dish.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#1f1f1f] text-gray-300 px-2.5 py-1 rounded-md text-xs font-medium border border-[#2e2e2e]">
                        {dish.categories?.name || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#f6ad55]">
                      S/ {dish.price ? Number(dish.price).toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        dish.is_available 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dish.is_available ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        {dish.is_available ? 'Disponible' : 'Agotado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/dishes/${dish.id}/edit`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 text-xs border-[#2a2a2a] bg-[#1a1a1a] hover:bg-[#252525] text-white"
                          >
                            Editar
                          </Button>
                        </Link>
                        <DeleteDishButton id={dish.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No se encontraron platos registrados en el menú.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
