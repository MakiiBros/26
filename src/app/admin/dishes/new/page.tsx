import { createClient } from '@/lib/supabase/server'
import { DishForm } from '@/components/admin/dish-form'

export const instant = false

export default async function NewDishPage() {
  const supabase = await createClient()
  
  // Obtenemos las categorías para el select del formulario
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nuevo Plato</h1>
        <p className="text-gray-500">Añade un nuevo plato al menú.</p>
      </div>

      <DishForm categories={categories || []} />
    </div>
  )
}
