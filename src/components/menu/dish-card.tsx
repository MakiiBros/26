'use client'

import Image from 'next/image'
import { ShoppingCart, RotateCw, Flame, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/components/ui/toast'
import { TiltCard } from '@/components/ui/motion-wrappers'
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
  const discountedPrice = isDiscounted ? dish.price * (1 - dish.discount_percentage / 100) : dish.price;
  
  return (
    <TiltCard className="h-full">
    <div 
      onClick={onClick}
      className="group relative bg-[#121217] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#e53e3e]/40 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-lg shadow-black/40 hover:shadow-2xl hover:shadow-[#e53e3e]/10"
    >
      {/* Top badges bar */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10 pointer-events-none">
        <div className="flex flex-col gap-1.5 pointer-events-auto">
          {dish.is_popular && (
            <span className="inline-flex items-center gap-1 bg-[#e53e3e] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md shadow-[#e53e3e]/30">
              <Flame className="w-3 h-3 fill-white" />
              Popular
            </span>
          )}
          {isDiscounted && (
            <span className="inline-flex items-center bg-[#f59e0b] text-neutral-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
              -{dish.discount_percentage}%
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            addItem(dish, 1)
            toast(`¡${dish.name} agregado al pedido!`, 'success')
          }}
          className="btn-press pointer-events-auto bg-black/60 hover:bg-[#e53e3e] text-white p-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-all duration-200"
          title="Agregar al pedido"
          aria-label={`Agregar ${dish.name} al pedido`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 360 3D Badge */}
      {has360Video && (
        <button 
          type="button"
          onClick={(e) => {
            if (onView360) {
              e.stopPropagation()
              onView360()
            }
          }}
          className="btn-press absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-black/75 hover:bg-black/90 text-[#f59e0b] text-[11px] font-mono font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md border border-[#f59e0b]/40 transition-all"
          title="Ver en 3D 360°"
        >
          <RotateCw className="w-3 h-3 text-[#f59e0b] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Vista 360°</span>
        </button>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a0a0e]">
        {dish.image_url ? (
          <Image 
            src={dish.image_url} 
            alt={dish.name} 
            fill 
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.15]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs font-mono">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 relative justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 line-clamp-1 group-hover:text-[#e53e3e] transition-colors">
            {dish.name}
          </h3>
          {dish.description && (
            <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-4">
              {dish.description}
            </p>
          )}
        </div>
        
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex flex-col">
            {isDiscounted && (
              <span className="text-[11px] text-neutral-500 line-through font-mono tabular-nums">
                {formatPrice(dish.price)}
              </span>
            )}
            <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-[#f59e0b]">
              {formatPrice(discountedPrice)}
            </span>
          </div>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              addItem(dish, 1)
              toast(`¡${dish.name} agregado al pedido!`, 'success')
            }}
            className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#e53e3e] hover:bg-[#c53030] text-white text-xs font-bold shadow-md shadow-[#e53e3e]/20 transition-all hover:scale-105"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Pedir</span>
          </button>
        </div>
      </div>
    </div>
    </TiltCard>
  )
}

