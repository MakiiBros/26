'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { CategoryTabs } from './category-tabs'
import { DishCard } from './dish-card'
import { DishDetailModal } from './dish-detail-modal'
import { Search } from 'lucide-react'
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-[#a0a0a0]">Categorías</h3>
            <CategoryTabs 
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={setUserSelectedCategory}
            />
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a0a0a0]" />
              <input 
                type="text"
                placeholder="Buscar platos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#e53e3e] transition-colors"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              <FilterPill label="Todos" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} />
              <FilterPill label="Populares" active={activeFilter === 'popular'} onClick={() => setActiveFilter('popular')} />
              <FilterPill label="En Descuento" active={activeFilter === 'discount'} onClick={() => setActiveFilter('discount')} />
              <FilterPill label="✨ 3D 360°" active={activeFilter === 'video360'} onClick={() => setActiveFilter('video360')} />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="col-span-full py-12 text-center text-[#a0a0a0]">
                No se encontraron platos que coincidan con la búsqueda.
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
      className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
        active ? 'bg-[#e53e3e] text-white' : 'bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#2a2a2a]'
      }`}
    >
      {label}
    </button>
  )
}
