import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function DesktopCheckoutButton({ totalItems }: { totalItems: number }) {
  if (totalItems === 0) return null
  
  return (
    <Link href="/checkout" className="relative group ml-4 btn-press hidden md:block">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#e53e3e] to-[#f59e0b] rounded-full blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
      <button className="relative flex items-center justify-center gap-2 bg-[#e53e3e] hover:bg-[#c53030] text-white px-5 py-2.5 rounded-full transition-all text-sm font-bold shadow-[0_0_20px_rgba(229,62,62,0.3)] hover:shadow-[0_0_25px_rgba(229,62,62,0.5)]">
        <ShoppingBag className="w-4 h-4" />
        <span className="bg-white text-[#e53e3e] text-xs font-black px-2 py-0.5 rounded-full">
          {totalItems}
        </span>
        <span>Pedido</span>
      </button>
    </Link>
  )
}
