'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function DishDetailModal({ dish, isOpen, onClose }: { dish: any, isOpen: boolean, onClose: () => void }) {
  const [quantity, setQuantity] = useState(1)

  if (!dish) return null

  const isDiscounted = dish.discount_percentage > 0
  const finalPrice = isDiscounted ? dish.price * (1 - dish.discount_percentage / 100) : dish.price

  const handleAdd = () => {
    // Logic for cart can be hooked up later
    onClose()
    setQuantity(1)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose()
        setQuantity(1)
      }
    }}>
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
                className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-4 outline-none"
              >
                <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#2a2a2a] shadow-2xl relative flex flex-col max-h-[90vh]">
                  
                  <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 backdrop-blur transition-colors cursor-pointer">
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>

                  {/* Image */}
                  <div className="relative w-full h-64 bg-[#0a0a0a] shrink-0">
                    {dish.image_url ? (
                      <Image src={dish.image_url} alt={dish.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#a0a0a0]">Sin imagen</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 overflow-y-auto">
                    <div className="mb-4">
                      {dish.category?.name && (
                        <span className="text-[#e53e3e] text-xs font-bold uppercase tracking-wider mb-1 block">
                          {dish.category.name}
                        </span>
                      )}
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

                    <Dialog.Description className="text-[#a0a0a0] mb-6 leading-relaxed">
                      {dish.description || 'Sin descripción disponible.'}
                    </Dialog.Description>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-6 flex items-center gap-4">
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
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
