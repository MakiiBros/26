'use client'

import { ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryTabs({ categories, selectedCategoryId, onSelectCategory }: CategoryTabsProps) {
  const allOption = { id: 'all', name: 'Todos los platos', icon: null };
  const items = [allOption, ...categories];

  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <div className="hidden md:flex flex-col bg-[#111116] rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl shadow-black/40 p-1.5 space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
          <span>Categorías</span>
          <Sparkles className="w-3 h-3 text-[#f59e0b]" />
        </div>
        {items.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "btn-press flex items-center justify-between px-3.5 py-3 text-left rounded-xl transition-all duration-200 text-sm font-medium relative group",
                isSelected 
                  ? "bg-[#e53e3e] text-white shadow-lg shadow-[#e53e3e]/25 font-semibold" 
                  : "text-neutral-300 hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <span className="truncate">{cat.name}</span>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform duration-200 shrink-0",
                isSelected 
                  ? "text-white translate-x-0" 
                  : "text-neutral-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
              )} />
            </button>
          );
        })}
      </div>

      {/* Mobile Horizontal Scrollable Pills */}
      <div className="md:hidden flex items-center gap-2 pb-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
        {items.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "btn-press px-4 py-2.5 rounded-full whitespace-nowrap text-xs font-semibold tracking-wide transition-all duration-200 border shrink-0",
                isSelected
                  ? "bg-[#e53e3e] border-[#e53e3e] text-white shadow-md shadow-[#e53e3e]/30"
                  : "bg-[#14141a] border-white/[0.08] text-neutral-300 hover:border-white/20 hover:text-white"
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </>
  )
}

