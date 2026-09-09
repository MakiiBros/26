'use client'

import { useCart } from '@/context/cart-context'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function FloatingCart() {
  const { totalItems, totalPrice } = useCart()
  const pathname = usePathname()

  // No mostrar el carrito flotante en estas rutas
  if (
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
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-white text-[#e53e3e] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {totalItems}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-red-100 uppercase tracking-wider leading-none mb-0.5">
                  Ver Pedido
                </span>
                <span className="text-sm font-bold leading-none">
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
