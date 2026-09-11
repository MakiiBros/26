'use client'

import { useCart } from '@/context/cart-context'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function FloatingCart() {
  const { totalItems, totalPrice } = useCart()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // No mostrar el carrito flotante en estas rutas
  if (
    !isMounted ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/auth')
  ) {
    return null
  }

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link href="/checkout">
            <div className="flex items-center gap-3 bg-[#e53e3e] hover:bg-[#c53030] text-white px-5 py-3.5 rounded-full shadow-2xl shadow-[#e53e3e]/30 cursor-pointer hover:scale-105 transition-transform group border border-red-500/50">
              <div className="relative">
                <Image 
                  src="/cart-icon.png" 
                  alt="Cart" 
                  width={24} 
                  height={24} 
                  className="w-6 h-6 object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span className="absolute -top-1.5 -right-2 bg-white text-[#e53e3e] text-[11px] font-black w-4.5 h-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full shadow-sm">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col ml-1">
                <span className="text-[10px] font-bold text-red-100 uppercase tracking-wider leading-none mb-0.5">
                  Ver Pedido
                </span>
                <span className="text-sm font-black leading-none">
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
