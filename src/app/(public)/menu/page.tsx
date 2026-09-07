import { Suspense } from 'react'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'
import { createClient } from '@supabase/supabase-js'
import { MenuPageClient } from '@/components/menu/menu-page-client'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'
import { MOCK_CATEGORIES, MOCK_DISHES } from '@/lib/mock-data'
import type { Category, Dish } from '@/types'

export const revalidate = 0

export default async function MenuPage() {
  let categories: Category[] = []
  let dishes: Dish[] = []

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const [catRes, dishRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('dishes').select('*, category:categories(*)').eq('is_available', true)
    ])

    if (catRes.data && catRes.data.length > 0) {
      categories = catRes.data as Category[]
    }
    if (dishRes.data && dishRes.data.length > 0) {
      dishes = (dishRes.data as any[]).map((d) => ({
        ...d,
        category: d.category || d.categories || null,
        categories: d.categories || d.category || null,
      })) as Dish[]
    }
  } catch (err) {
    console.warn('[MenuPage] Database query failed, using fallback data:', err)
  }

  if (categories.length === 0) {
    categories = MOCK_CATEGORIES
  }
  if (dishes.length === 0) {
    dishes = MOCK_DISHES
  }

  return (
    <div className="min-h-screen bg-[#09090c] text-white flex flex-col selection:bg-[#e53e3e] selection:text-white">
      <Navbar />
      <main className="flex-1 py-4">
        <Suspense fallback={
          <div className="py-24 text-center text-neutral-400 font-mono text-sm">
            Cargando carta de makis...
          </div>
        }>
          <MenuPageClient 
            categories={categories} 
            dishes={dishes} 
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
