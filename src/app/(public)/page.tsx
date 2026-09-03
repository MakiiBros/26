import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'
import { Navbar } from '@/components/public/navbar'
import { HeroSection } from '@/components/public/hero-section'
import { PopularDishes } from '@/components/public/popular-dishes'
import { PromoCarousel } from '@/components/public/promo-carousel'
import { AboutSection } from '@/components/public/about-section'
import { Footer } from '@/components/public/footer'
import { StoreStatusBanner } from '@/components/public/store-status-banner'
import type { Dish, StoreSettings } from '@/types'

export const revalidate = 0

export default async function HomePage() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  // Fetch data in parallel
  const [dishesRes, settingsRes] = await Promise.all([
    supabase.from('dishes').select('*, categories(*)').eq('is_available', true).order('sort_order'),
    supabase.from('store_settings').select('*').limit(1).single(),
  ])

  const dishes = (dishesRes.data || []) as Dish[]
  const settings = settingsRes.data as StoreSettings | null
  
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
          <section id="populares" className="py-20 px-4">
            <PopularDishes dishes={popularDishes} />
          </section>
        )}

        {/* Promociones */}
        {promoDishes.length > 0 && (
          <section id="promociones" className="py-20 px-4 bg-[#0f0f0f]">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">PROMOCIONES</h2>
              <p className="text-[#a0a0a0] mb-10">Aprovecha nuestras ofertas especiales</p>
              <PromoCarousel dishes={promoDishes} />
            </div>
          </section>
        )}

        {/* Sobre Nosotros */}
        <section id="nosotros" className="py-20 px-4">
          <AboutSection />
        </section>

        {/* CTA final */}
        <section className="py-20 px-4 bg-[#0f0f0f] text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para ordenar?</h2>
            <p className="text-[#a0a0a0] mb-8">Explora nuestro menú completo y haz tu pedido en minutos</p>
            <a href="/menu" className="inline-flex items-center justify-center px-8 py-4 bg-[#e53e3e] text-white font-semibold rounded-lg hover:bg-[#c53030] transition-colors text-lg">
              Ver Menú Completo
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
