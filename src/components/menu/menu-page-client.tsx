'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { CategoryTabs } from './category-tabs'
import { DishCard } from './dish-card'
import { DishDetailModal } from './dish-detail-modal'
import { Search, X, UtensilsCrossed, Sparkles } from 'lucide-react'
import type { Category, Dish } from '@/types'

export function MenuPageClient({ categories, dishes }: { categories: Category[], dishes: Dish[] }) {
  const searchParams = useSearchParams()
  const catParam = searchParams.get('category')
  
  const initialCategory = useMemo(() => {
    if (!catParam) return 'all'
    const matched = categories.find((c) =>
      c.id === catParam ||
      c.name.toLowerCase().includes(catParam.toLowerCase())
    )
    return matched ? matched.id : 'all'
  }, [catParam, categories])

  const [userSelectedCategory, setUserSelectedCategory] = useState<string | null>(null)
  const selectedCategoryId = userSelectedCategory ?? initialCategory
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'popular' | 'new' | 'discount' | 'video360'>('all')
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [initialModalView, setInitialModalView] = useState<'photo' | '360'>('photo')

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      if (selectedCategoryId !== 'all' && dish.category_id !== selectedCategoryId) return false
      if (searchQuery && !dish.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (activeFilter === 'popular' && !dish.is_popular) return false
      if (activeFilter === 'discount' && !(dish.discount_percentage > 0)) return false
      if (activeFilter === 'video360' && !dish.video_360_url) return false
      return true
    })
  }, [dishes, selectedCategoryId, searchQuery, activeFilter])

  const handleOpenDish = (dish: Dish, view: 'photo' | '360' = 'photo') => {
    setSelectedDish(dish)
    setInitialModalView(view)
  }

  const handleResetFilters = () => {
    setUserSelectedCategory('all')
    setSearchQuery('')
    setActiveFilter('all')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-3">
            <CategoryTabs 
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setUserSelectedCategory}
            />
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Top Bar: Search & Quick Filters */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between p-4 rounded-2xl bg-[#121217] border border-white/[0.08]">
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text"
                placeholder="Buscar makis, rolls, ceviches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#09090c] border border-white/10 rounded-full py-2.5 pl-10 pr-9 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#e53e3e] focus:ring-1 focus:ring-[#e53e3e]/40 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
              <FilterPill label="Todos" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
              <FilterPill label="🔥 Populares" active={activeFilter === 'popular'} onClick={() => setActiveFilter('popular')} />
              <FilterPill label="⚡ Descuentos" active={activeFilter === 'discount'} onClick={() => setActiveFilter('discount')} />
              <FilterPill label="✨ 3D 360°" active={activeFilter === 'video360'} onClick={() => setActiveFilter('video360')} />
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Mostrando <strong className="text-white tabular-nums">{filteredDishes.length}</strong> {filteredDishes.length === 1 ? 'plato' : 'platos'}
            </span>
            {(searchQuery || activeFilter !== 'all' || selectedCategoryId !== 'all') && (
              <button 
                onClick={handleResetFilters}
                className="text-xs text-[#e53e3e] hover:text-[#f59e0b] font-mono transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredDishes.length > 0 ? (
              filteredDishes.map(dish => (
                <DishCard 
                  key={dish.id} 
                  dish={dish} 
                  onClick={() => handleOpenDish(dish, 'photo')} 
                  onView360={() => handleOpenDish(dish, '360')}
                />
              ))
            ) : (
              <div className="col-span-full py-16 px-4 text-center rounded-3xl bg-[#121217] border border-white/[0.06] flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500">
                  <UtensilsCrossed className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-base">No se encontraron platos</h4>
                  <p className="text-neutral-400 text-sm max-w-sm">
                    No encontramos ningún plato con los filtros actuales o tu término de búsqueda.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="btn-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e53e3e] hover:bg-[#c53030] text-white font-semibold text-xs transition-colors shadow-md shadow-[#e53e3e]/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ver toda la carta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DishDetailModal 
        dish={selectedDish} 
        isOpen={!!selectedDish} 
        initialView={initialModalView}
        onClose={() => setSelectedDish(null)} 
      />
    </div>
  )
}

function FilterPill({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`btn-press px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold tracking-wide transition-all border shrink-0 ${
        active 
          ? 'bg-[#e53e3e] border-[#e53e3e] text-white shadow-md shadow-[#e53e3e]/25' 
          : 'bg-[#09090c] border-white/10 text-neutral-300 hover:text-white hover:border-white/20'
      }`}
    >
      {label}
    </button>
  )
}

