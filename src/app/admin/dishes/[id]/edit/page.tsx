import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DishForm } from '@/components/admin/dish-form'
import type { DishWithCategory, Category } from '@/types'



export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  // Obtenemos los datos del plato y las categorías en paralelo
  const [dishResponse, categoriesResponse] = await Promise.all([
    supabase.from('dishes').select('*, categories(*)').eq('id', id).single(),
    supabase.from('categories').select('*').order('sort_order')
  ])

  const initialData = dishResponse.data as unknown as DishWithCategory
  const categories = (categoriesResponse.data || []) as Category[]

  if (dishResponse.error || !initialData) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editar Plato</h1>
        <p className="text-gray-500">Modifica los detalles del plato seleccionado.</p>
      </div>

      <DishForm 
        initialData={initialData} 
        categories={categories} 
      />
    </div>
  )
}
