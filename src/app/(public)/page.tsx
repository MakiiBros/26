import { createClient } from '@supabase/supabase-js';
import { MenuClient } from '@/components/menu/menu-client';
import type { Category, Dish } from '@/types';
import type { Database } from '@/types/database';

export const revalidate = 0;

export default async function PublicMenuPage() {
  let categories: Category[] = [];
  let dishes: Dish[] = [];
  let error = null;

  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [categoriesResult, dishesResult] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('dishes').select('*').eq('is_available', true).order('sort_order')
    ]);

    if (categoriesResult.error) throw categoriesResult.error;
    if (dishesResult.error) throw dishesResult.error;

    categories = (categoriesResult.data || []) as Category[];
    dishes = (dishesResult.data || []) as Dish[];
  } catch (err) {
    console.error('Error fetching menu data:', err);
    error = 'No se pudo cargar el menú. Por favor, intenta de nuevo más tarde.';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            MakiiBros
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto">
        {error ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ups, algo salió mal</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : (
          <MenuClient categories={categories} dishes={dishes} />
        )}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Makisbros. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
