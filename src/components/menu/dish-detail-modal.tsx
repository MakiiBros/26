'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Minus, Plus, Camera, RotateCw, Sparkles, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Viewer360 } from './viewer-360'
import { useCart } from '@/context/cart-context'
import { useToast } from '@/components/ui/toast'
import type { Dish, Category } from '@/types'

type DishDetailModalItem = Dish & { category?: Category; categories?: Category }

interface DishDetailModalProps {
  dish: DishDetailModalItem | null
  isOpen: boolean
  onClose: () => void
  initialView?: 'photo' | '360'
}

function DishDetailContent({
  dish,
  onClose,
  initialView = 'photo',
}: {
  dish: DishDetailModalItem
  onClose: () => void
  initialView?: 'photo' | '360'
}) {
  const [quantity, setQuantity] = useState(1)
  const [activeMedia, setActiveMedia] = useState<'photo' | '360'>(() =>
    initialView === '360' && dish?.video_360_url ? '360' : 'photo'
  )

  const has360Video = Boolean(dish.video_360_url)
  const isDiscounted = dish.discount_percentage > 0
  const finalPrice = isDiscounted
    ? dish.price * (1 - dish.discount_percentage / 100)
    : dish.price

  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAdd = () => {
    if (dish) {
      addItem(dish, quantity)
      toast(`¡${dish.name} (${quantity}) agregado al pedido!`, 'success')
    }
    onClose()
  }

  return (
    <div className="bg-[#121217] rounded-3xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/90 relative flex flex-col max-h-[92vh]">
      <Dialog.Close asChild>
        <button 
          aria-label="Cerrar detalle"
          className="btn-press absolute top-4 right-4 z-30 bg-black/70 hover:bg-black text-white rounded-full p-2.5 backdrop-blur-md transition-all border border-white/15 shadow-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </Dialog.Close>

      {/* Media Container: Photo vs 360 Video */}
      <div className="relative w-full h-72 sm:h-80 bg-black shrink-0 overflow-hidden">
        {/* Switcher buttons if 360 video exists */}
        {has360Video && (
          <div className="absolute top-4 left-4 z-20 flex items-center bg-black/80 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveMedia('photo')}
              className={`btn-press flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeMedia === 'photo'
                  ? 'bg-white text-neutral-950 shadow-md'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMedia('360')}
              className={`btn-press flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeMedia === '360'
                  ? 'bg-gradient-to-r from-[#e53e3e] to-[#f59e0b] text-white shadow-lg shadow-red-950/50'
                  : 'text-[#f59e0b] hover:text-amber-300'
              }`}
            >
              <RotateCw
                className="w-3.5 h-3.5 animate-spin"
                style={{ animationDuration: '6s' }}
              />
              <span>Visor 3D 360°</span>
            </button>
          </div>
        )}

        {activeMedia === '360' && has360Video ? (
          <Viewer360
            videoUrl={dish.video_360_url!}
            posterUrl={dish.image_url ?? undefined}
            dishName={dish.name}
            className="w-full h-full"
          />
        ) : (
          <div className="relative w-full h-full bg-[#0a0a0e]">
            {dish.image_url ? (
              <Image 
                src={dish.image_url} 
                alt={dish.name} 
                fill 
                className="object-cover" 
                sizes="(max-width: 640px) 100vw, 600px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500 font-mono text-sm">
                Sin imagen disponible
              </div>
            )}

            {has360Video && (
              <button
                type="button"
                onClick={() => setActiveMedia('360')}
                className="btn-press absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-black/80 hover:bg-[#e53e3e] text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-xl"
              >
                <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                <span>Explorar en 3D 360°</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 overflow-y-auto space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {dish.category?.name && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#e53e3e]/15 border border-[#e53e3e]/30 text-[#e53e3e] text-[11px] font-mono font-bold uppercase tracking-wider">
                {dish.category.name}
              </span>
            )}
            {has360Video && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30 px-2.5 py-0.5 rounded-full">
                <RotateCw className="w-3 h-3" /> Modelo 360°
              </span>
            )}
            {dish.is_popular && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                Favorito de la casa
              </span>
            )}
          </div>

          <Dialog.Title className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            {dish.name}
          </Dialog.Title>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-[#f59e0b]">
              {formatPrice(finalPrice)}
            </span>
            {isDiscounted && (
              <span className="text-sm text-neutral-500 line-through font-mono tabular-nums">
                {formatPrice(dish.price)}
              </span>
            )}
          </div>
        </div>

        <Dialog.Description className="text-neutral-300 leading-relaxed text-sm sm:text-base">
          {dish.description || 'Delicioso roll preparado con ingredientes frescos y el inconfundible toque de MakiBros.'}
        </Dialog.Description>

        {/* Quick 360 Tip if active */}
        {has360Video && activeMedia === '360' && (
          <div className="p-3.5 rounded-2xl bg-[#f59e0b]/10 border border-[#f59e0b]/25 text-xs text-[#f59e0b] flex items-center gap-3">
            <RotateCw className="w-4 h-4 shrink-0 animate-spin" style={{ animationDuration: '10s' }} />
            <span>
              <strong>Vista interactiva:</strong> Arrastra con el mouse o dedo sobre el modelo para rotar 360° y observar todos los detalles del emplatado.
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto pt-4 flex flex-col sm:flex-row items-center gap-3 border-t border-white/[0.08]">
          {/* Stepper */}
          <div className="flex items-center bg-[#09090c] rounded-full border border-white/10 p-1 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Disminuir cantidad"
              className="btn-press w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-white font-mono font-bold tabular-nums text-base">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Aumentar cantidad"
              className="btn-press w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to order CTA */}
          <button
            onClick={handleAdd}
            className="btn-press w-full flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#e53e3e] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white font-bold py-3.5 px-6 rounded-full transition-all shadow-xl shadow-[#e53e3e]/25 cursor-pointer text-sm sm:text-base"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Agregar al pedido • <strong className="font-mono tabular-nums">{formatPrice(finalPrice * quantity)}</strong></span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function DishDetailModal({
  dish,
  isOpen,
  onClose,
  initialView = 'photo',
}: DishDetailModalProps) {
  if (!dish) return null

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ type: 'spring', damping: 28, stiffness: 350 }}
                className="fixed left-[50%] top-[50%] z-50 w-full max-w-xl translate-x-[-50%] translate-y-[-50%] p-4 outline-none"
              >
                <DishDetailContent
                  key={`${dish.id}-${initialView}`}
                  dish={dish}
                  onClose={onClose}
                  initialView={initialView}
                />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}



