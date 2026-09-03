'use client'

import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

export function DishCard({ dish, onClick }: { dish: any, onClick?: () => void }) {
  const isDiscounted = dish.discount_percentage > 0;
  
  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#2a2a2a] hover:border-[#e53e3e]/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <span className="text-[10px] font-black tracking-widest text-white/80 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
          MakiBros
        </span>
        <div className="bg-black/40 p-2 rounded-full backdrop-blur-sm text-white group-hover:bg-[#e53e3e] transition-colors">
          <ShoppingCart className="w-4 h-4" />
        </div>
      </div>

      {isDiscounted && (
        <div className="absolute top-14 left-4 z-10 bg-[#f6ad55] text-black text-xs font-bold px-2 py-1 rounded shadow-md">
          -{dish.discount_percentage}%
        </div>
      )}
      
      {dish.is_popular && (
        <div className={cn("absolute left-4 z-10 bg-[#e53e3e] text-white text-xs font-bold px-2 py-1 rounded shadow-md", isDiscounted ? "top-22" : "top-14")}>
          Popular
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0a]">
        {dish.image_url ? (
          <Image 
            src={dish.image_url} 
            alt={dish.name} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#a0a0a0]">
            Sin imagen
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 relative">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{dish.name}</h3>
        {dish.description && (
          <p className="text-sm text-[#a0a0a0] line-clamp-2 mb-4">{dish.description}</p>
        )}
        
        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            {isDiscounted ? (
              <div className="flex flex-col">
                <span className="text-xs text-[#a0a0a0] line-through">
                  {formatPrice(dish.price)}
                </span>
                <span className="text-lg font-bold text-[#f6ad55]">
                  {formatPrice(dish.price * (1 - dish.discount_percentage / 100))}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-[#f6ad55]">
                {formatPrice(dish.price)}
              </span>
            )}
          </div>
        </div>

        {/* Hover Button */}
        <div className="absolute bottom-5 right-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-900/20">
            Ordenar
          </button>
        </div>
      </div>
    </div>
  )
}
