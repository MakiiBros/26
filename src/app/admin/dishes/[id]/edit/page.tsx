import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DishForm } from '@/components/admin/dish-form'
import type { DishWithCategory, Category } from '@/types'
import { ArrowLeft, Edit } from 'lucide-react'
import { MOCK_DISHES, MOCK_CATEGORIES } from '@/lib/mock-data'

export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  // Obtenemos los datos del plato y las categorías en paralelo
  let initialData: DishWithCategory | null = null
  let categories: Category[] = []

  try {
    const { data: dishData } = await supabase.from('dishes').select('*, categories(*)').eq('id', id).single()
    const { data: categoriesData } = await supabase.from('categories').select('*').order('sort_order')

    if (dishData) {
      initialData = dishData as unknown as DishWithCategory
    }
    if (categoriesData && categoriesData.length > 0) {
      categories = categoriesData as Category[]
    }
  } catch (err) {
    console.warn('Error al cargar plato para editar:', err)
  }

  // Fallback si no está en la base de datos o si es un plato de prueba
  if (!initialData) {
    const mockDish = MOCK_DISHES.find(d => d.id === id)
    if (mockDish) {
      initialData = mockDish as unknown as DishWithCategory
    }
  }

  if (categories.length === 0) {
    categories = MOCK_CATEGORIES
  }

  if (!initialData) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/dishes" 
          className="p-2 rounded-lg bg-[#141414] border border-[#2a2a2a] hover:bg-[#1f1f1f] text-gray-400 hover:text-white transition-colors"
          title="Volver a la lista de platos"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Edit className="w-6 h-6 text-[#f6ad55]" />
            Editar Plato: {initialData.name}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Modifica los detalles, precio o fotografía de este platillo.</p>
        </div>
      </div>

      <DishForm 
        initialData={initialData} 
        categories={categories} 
      />
    </div>
  )
}
