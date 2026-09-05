'use client'

import { DishCard } from './dish-card'
import type { Dish } from '@/types'

export function MenuClient({ dishes }: { dishes: Dish[] }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div className="text-center py-12 text-[#a0a0a0]">
        No hay platos disponibles por el momento.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {dishes.map(dish => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  )
}
