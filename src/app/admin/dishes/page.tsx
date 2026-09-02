import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { DeleteDishButton } from '@/components/admin/delete-dish-button';



export const metadata = {
  title: 'Gestión de Platos | Makisbros Admin',
};

export default async function AdminDishesPage() {
  const supabase = await createClient();

  // Obtener los platos ordenados por sort_order (u otra columna si corresponde)
  const { data: dishes, error } = await supabase
    .from('dishes')
    .select('*, categories(name)')
    .order('sort_order', { ascending: true })
    // Si no existe sort_order, puedes cambiar el fallback a 'created_at'
    .order('created_at', { ascending: false }); 
    
  if (error) {
    console.error('Error al cargar platos:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Platos
        </h1>
        <Link href="/admin/dishes/new">
          <Button>
            Nuevo Plato
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">Imagen</th>
                <th scope="col" className="px-6 py-3">Nombre</th>
                <th scope="col" className="px-6 py-3">Categoría</th>
                <th scope="col" className="px-6 py-3">Precio</th>
                <th scope="col" className="px-6 py-3">Estado</th>
                <th scope="col" className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dishes && dishes.length > 0 ? (
                dishes.map((dish: any) => (
                  <tr key={dish.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">
                      {dish.image_url ? (
                        <div className="relative w-12 h-12 rounded overflow-hidden">
                          <Image 
                            src={dish.image_url} 
                            alt={dish.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {dish.name}
                    </td>
                    <td className="px-6 py-4">
                      {dish.categories?.name || 'Sin categoría'}
                    </td>
                    <td className="px-6 py-4">
                      S/ {dish.price?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${dish.is_available ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {dish.is_available ? 'Disponible' : 'Agotado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Link href={`/admin/dishes/${dish.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <DeleteDishButton id={dish.id} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron platos.
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
