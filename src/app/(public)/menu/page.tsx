import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'
import { createClient } from '@supabase/supabase-js'
import { MenuPageClient } from '@/components/menu/menu-page-client'
import { Navbar } from '@/components/public/navbar'
import { Footer } from '@/components/public/footer'

export const revalidate = 0

export default async function MenuPage() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  const [{ data: categories }, { data: dishes }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    supabase.from('dishes').select('*, category:categories(*)').eq('is_available', true)
  ])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <MenuPageClient 
          categories={categories || []} 
          dishes={dishes || []} 
        />
      </main>
      <Footer />
    </div>
  )
}
