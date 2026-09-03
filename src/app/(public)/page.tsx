import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'
import { Navbar } from '@/components/public/navbar'
import { HeroSection } from '@/components/public/hero-section'
import { PopularDishes } from '@/components/public/popular-dishes'
import { PromoCarousel } from '@/components/public/promo-carousel'
import { AboutSection } from '@/components/public/about-section'
import { Footer } from '@/components/public/footer'
import { StoreStatusBanner } from '@/components/public/store-status-banner'
import { MenuPageClient } from '@/components/menu/menu-page-client'
import { MOCK_CATEGORIES, MOCK_DISHES, MOCK_STORE_SETTINGS } from '@/lib/mock-data'
import type { Category, Dish, StoreSettings } from '@/types'

export const revalidate = 0

export default async function HomePage() {
  let dishes: Dish[] = []
  let categories: Category[] = []
  let settings: StoreSettings | null = null

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Fetch data in parallel
    const [dishesRes, categoriesRes, settingsRes] = await Promise.all([
      supabase.from('dishes').select('*, categories(*)').eq('is_available', true).order('sort_order'),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('store_settings').select('*').limit(1).single(),
    ])

    if (dishesRes.data && dishesRes.data.length > 0) {
      dishes = dishesRes.data as Dish[]
    }
    if (categoriesRes.data && categoriesRes.data.length > 0) {
      categories = categoriesRes.data as Category[]
    }
    if (settingsRes.data) {
      settings = settingsRes.data as StoreSettings
    }
  } catch (err) {
    console.warn('[HomePage] Database query failed, using fallback data:', err)
  }

  // Fallback to sample seed data if database is unconfigured or empty
  if (dishes.length === 0) {
    dishes = MOCK_DISHES
  }
  if (categories.length === 0) {
    categories = MOCK_CATEGORIES
  }
  if (!settings) {
    settings = MOCK_STORE_SETTINGS
  }
  
  const popularDishes = dishes.filter((d: any) => d.is_popular)
  const promoDishes = dishes.filter((d: any) => d.discount_percentage > 0)

  return (
    <>
      <StoreStatusBanner 
        isOpen={settings?.is_open ?? true}
        openTime={settings?.open_time ?? '12:00'}
        closeTime={settings?.close_time ?? '22:00'}
      />
      <Navbar />
      <main>
        <HeroSection />
        
        {/* Populares */}
        {popularDishes.length > 0 && (
          <PopularDishes dishes={popularDishes} />
        )}

        {/* Promociones */}
        {promoDishes.length > 0 && (
          <PromoCarousel dishes={promoDishes} />
        )}

        {/* Menú Completo Integrado */}
        <section id="menu" className="py-20 px-4 scroll-mt-20 border-t border-[#1a1a1a]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e53e3e]/10 border border-[#e53e3e]/20 text-[#e53e3e] text-xs font-semibold uppercase tracking-wider mb-3">
                Carta Completa
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                NUESTRO MENÚ
              </h2>
              <p className="text-[#a0a0a0] mt-1 text-base">
                Filtra por categoría, busca tus favoritos o descubre nuestras especialidades nikkei.
              </p>
            </div>
            
            <MenuPageClient 
              categories={categories} 
              dishes={dishes} 
            />
          </div>
        </section>

        {/* Sobre Nosotros */}
        <section id="nosotros" className="py-20 px-4">
          <AboutSection />
        </section>

        {/* CTA final */}
        <section className="py-20 px-4 bg-[#0f0f0f] text-center border-t border-[#1a1a1a]">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para ordenar?</h2>
            <p className="text-[#a0a0a0] mb-8">Elige tus makis y platos favoritos de nuestro menú en minutos</p>
            <a href="#menu" className="inline-flex items-center justify-center px-8 py-4 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors text-lg">
              Explorar Menú
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
