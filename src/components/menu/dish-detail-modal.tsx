'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Minus, Plus, Camera, RotateCw, Sparkles } from 'lucide-react'
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
      toast(`¡${dish.name} (${quantity}) agregado al carrito!`, 'success')
    }
    onClose()
  }

  return (
    <div className="bg-[#141414] rounded-2xl overflow-hidden border border-[#2a2a2a] shadow-2xl relative flex flex-col max-h-[90vh]">
      <Dialog.Close asChild>
        <button className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/90 text-white rounded-full p-2.5 backdrop-blur-md transition-colors cursor-pointer border border-white/10 shadow-lg">
          <X className="w-5 h-5" />
        </button>
      </Dialog.Close>

      {/* Media Container: Photo vs 360 Video */}
      <div className="relative w-full h-72 sm:h-80 bg-black shrink-0 overflow-hidden">
        {/* Switcher buttons if 360 video exists */}
        {has360Video && (
          <div className="absolute top-4 left-4 z-20 flex items-center bg-black/75 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-xl">
            <button
              type="button"
              onClick={() => setActiveMedia('photo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeMedia === 'photo'
                  ? 'bg-white text-black shadow'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Foto
            </button>
            <button
              type="button"
              onClick={() => setActiveMedia('360')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeMedia === '360'
                  ? 'bg-gradient-to-r from-[#e53e3e] to-amber-600 text-white shadow-lg shadow-red-950/50'
                  : 'text-amber-300 hover:text-amber-200'
              }`}
            >
              <RotateCw
                className="w-3.5 h-3.5 text-amber-200 animate-spin"
                style={{ animationDuration: '6s' }}
              />
              Visor 3D 360°
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
          <div className="relative w-full h-full bg-[#0a0a0a]">
            {dish.image_url ? (
              <Image src={dish.image_url} alt={dish.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#a0a0a0]">
                Sin imagen
              </div>
            )}

            {has360Video && (
              <button
                type="button"
                onClick={() => setActiveMedia('360')}
                className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-black/80 hover:bg-[#e53e3e] text-white text-xs font-bold px-3.5 py-2 rounded-full border border-white/20 backdrop-blur-md transition-all shadow-xl hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Ver en 3D 360°
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 overflow-y-auto">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            {dish.category?.name && (
              <span className="text-[#e53e3e] text-xs font-bold uppercase tracking-wider block">
                {dish.category.name}
              </span>
            )}
            {has360Video && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                <RotateCw className="w-2.5 h-2.5" /> Video 360° Disponible
              </span>
            )}
          </div>

          <Dialog.Title className="text-2xl font-bold text-white mb-2">{dish.name}</Dialog.Title>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[#f6ad55]">
              {formatPrice(finalPrice)}
            </span>
            {isDiscounted && (
              <span className="text-sm text-[#a0a0a0] line-through">
                {formatPrice(dish.price)}
              </span>
            )}
          </div>
        </div>

        <Dialog.Description className="text-[#a0a0a0] mb-6 leading-relaxed text-sm">
          {dish.description || 'Sin descripción disponible.'}
        </Dialog.Description>

        {/* Quick 360 Tip if available */}
        {has360Video && activeMedia === '360' && (
          <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-red-950/30 to-amber-950/30 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-2.5">
            <RotateCw className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              ¡Interactúa! Arrastra con el mouse o tu dedo sobre el video para rotar la cámara en 360° en cualquier dirección.
            </span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto pt-4 flex items-center gap-4 border-t border-[#222222]">
          <div className="flex items-center bg-[#0a0a0a] rounded-full border border-[#2a2a2a] p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-[#2a2a2a] rounded-full transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-white font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-white hover:bg-[#2a2a2a] rounded-full transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-[#e53e3e] hover:bg-[#c53030] text-white font-bold py-3.5 px-6 rounded-full transition-colors shadow-lg shadow-red-900/20 cursor-pointer"
          >
            Agregar al carrito • {formatPrice(finalPrice * quantity)}
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
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
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


