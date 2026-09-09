import { Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'
import { Navbar } from '@/components/public/navbar'
import { HeroSection } from '@/components/public/hero-section'
import { AboutSection } from '@/components/public/about-section'
import { Footer } from '@/components/public/footer'
import { StoreStatusBanner } from '@/components/public/store-status-banner'
import { MenuPageClient } from '@/components/menu/menu-page-client'
import { MOCK_CATEGORIES, MOCK_DISHES, MOCK_STORE_SETTINGS } from '@/lib/mock-data'
import { ArrowDown, Flame, MessageCircle, Sparkles } from 'lucide-react'
import type { Category, Dish, StoreSettings } from '@/types'

export const revalidate = 0

async function getHomePageData(): Promise<{
  dishes: Dish[]
  categories: Category[]
  settings: StoreSettings
}> {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const [dishesRes, categoriesRes, settingsRes] = await Promise.all([
      supabase.from('dishes').select('*, categories(*)').eq('is_available', true).order('sort_order'),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('store_settings').select('*').limit(1).maybeSingle(),
    ])

    const dishes: Dish[] = (dishesRes.data && dishesRes.data.length > 0)
      ? (dishesRes.data as any[]).map((d) => ({
          ...d,
          category: d.category || d.categories || null,
          categories: d.categories || d.category || null,
        }))
      : MOCK_DISHES

    const categories: Category[] = (categoriesRes.data && categoriesRes.data.length > 0)
      ? (categoriesRes.data as Category[])
      : MOCK_CATEGORIES

    const settings: StoreSettings = settingsRes.data || MOCK_STORE_SETTINGS

    return { dishes, categories, settings }
  } catch (err) {
    console.warn('[HomePage] Database query failed, using fallback data:', err)
    return {
      dishes: MOCK_DISHES,
      categories: MOCK_CATEGORIES,
      settings: MOCK_STORE_SETTINGS,
    }
  }
}

export default async function HomePage() {
  const { dishes, categories, settings } = await getHomePageData()

  return (
    <div className="min-h-screen bg-[#09090c] text-white selection:bg-[#e53e3e] selection:text-white">
      <StoreStatusBanner 
        isOpen={settings?.is_open ?? true}
        openTime={settings?.open_time ?? '17:30'}
        closeTime={settings?.close_time ?? '22:00'}
      />
      <Navbar />
      <main>
        <HeroSection />


        {/* Menú Completo Integrado */}
        <section id="menu" className="py-20 sm:py-28 px-4 sm:px-6 scroll-mt-20 border-t border-white/[0.06] relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center sm:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e53e3e]/10 border border-[#e53e3e]/20 text-[#e53e3e] text-xs font-mono uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Carta Completa Digital
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                NUESTRO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">MENÚ</span>
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
                Filtra por categoría, visualiza cada roll en 3D 360° y arma tu pedido con la frescura que mereces.
              </p>
            </div>
            
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
          </div>
        </section>

        {/* Sobre Nosotros */}
        <AboutSection />

        {/* CTA final Gastronómico */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 bg-gradient-to-b from-[#09090c] to-[#121217] text-center border-t border-white/[0.06] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#e53e3e]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl mx-auto relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-neutral-300 text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-[#e53e3e]" />
              <span>Lima Norte • Delivery & Local</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ¿Listo para vivir la verdadera fiesta <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53e3e] to-[#f59e0b]">MakiBros</span>?
            </h2>

            <p className="text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Elige tus banderillas crocantes y makis favoritos. Te lo preparamos al instante con el mejor crunch de Lima.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a 
                href="#menu" 
                className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold rounded-full transition-all shadow-xl shadow-[#e53e3e]/25 text-sm sm:text-base"
              >
                <span>Explorar Carta</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a 
                href="https://wa.me/51970725307?text=Hola%20MakiBros!%20Deseo%20hacer%20un%20pedido." 
                target="_blank"
                rel="noreferrer"
                className="btn-press w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold rounded-full transition-all text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pedir por WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

