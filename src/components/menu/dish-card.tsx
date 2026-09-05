'use client'

import Image from 'next/image'
import { ShoppingCart, RotateCw } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/components/ui/toast'
import type { Dish } from '@/types'

export function DishCard({ 
  dish, 
  onClick,
  onView360
}: { 
  dish: Dish
  onClick?: () => void
  onView360?: () => void
}) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const isDiscounted = dish.discount_percentage > 0;
  const has360Video = Boolean(dish.video_360_url);
  
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
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            addItem(dish, 1)
            toast(`¡${dish.name} agregado al pedido!`, 'success')
          }}
          className="bg-black/40 p-2 rounded-full backdrop-blur-sm text-white hover:bg-[#e53e3e] transition-colors"
          title="Agregar al pedido"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
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

      {/* 360 3D Badge */}
      {has360Video && (
        <div 
          onClick={(e) => {
            if (onView360) {
              e.stopPropagation()
              onView360()
            }
          }}
          className="absolute top-14 right-4 z-10 flex items-center gap-1.5 bg-gradient-to-r from-red-600/90 to-amber-600/90 hover:from-red-600 hover:to-amber-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md border border-amber-300/40 transition-all hover:scale-105"
          title="Ver en 3D 360°"
        >
          <RotateCw className="w-3 h-3 text-amber-200 animate-spin" style={{ animationDuration: '6s' }} />
          <span>3D 360°</span>
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
        <div className="absolute bottom-5 right-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
          {has360Video && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onView360) onView360()
                else if (onClick) onClick()
              }}
              className="bg-black/80 hover:bg-[#1a1a1a] text-amber-300 border border-amber-400/40 px-3 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
            >
              <RotateCw className="w-3 h-3" />
              360°
            </button>
          )}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              addItem(dish, 1)
              toast(`¡${dish.name} agregado al pedido!`, 'success')
            }}
            className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-900/20 active:scale-95 transition-transform"
          >
            Ordenar
          </button>
        </div>
      </div>
    </div>
  )
}
