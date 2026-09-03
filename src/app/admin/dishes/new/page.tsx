import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DishForm } from '@/components/admin/dish-form'
import { ArrowLeft, Plus } from 'lucide-react'

export default async function NewDishPage() {
  const supabase = await createClient()
  
  // Obtenemos las categorías para el select del formulario
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

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
            <Plus className="w-6 h-6 text-[#e53e3e]" />
            Nuevo Plato
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Añade un nuevo platillo al menú de MakiiBros.</p>
        </div>
      </div>

      <DishForm categories={categories || []} />
    </div>
  )
}
