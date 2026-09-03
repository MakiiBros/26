'use client'

import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryTabsProps {
  categories: any[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryTabs({ categories, selectedCategoryId, onSelectCategory }: CategoryTabsProps) {
  const allOption = { id: 'all', name: 'Todos los platos', icon: null };
  const items = [allOption, ...categories];

  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <div className="hidden md:flex flex-col bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden shadow-lg">
        {items.map((cat, index) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              "flex items-center justify-between px-4 py-4 text-left transition-colors border-l-4",
              selectedCategoryId === cat.id 
                ? "bg-white/10 border-[#e53e3e] text-white" 
                : "border-transparent text-[#a0a0a0] hover:bg-white/5 hover:text-white",
              index !== items.length - 1 && "border-b border-b-[#2a2a2a]"
            )}
          >
            <span className="font-medium">{cat.name}</span>
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform",
              selectedCategoryId === cat.id ? "text-[#e53e3e]" : "opacity-0 -translate-x-2"
            )} />
          </button>
        ))}
      </div>

      {/* Mobile Horizontal Pills */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-4 hide-scrollbar">
        {items.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border shadow-sm",
              selectedCategoryId === cat.id
                ? "bg-[#e53e3e] border-[#e53e3e] text-white"
                : "bg-[#1a1a1a] border-[#2a2a2a] text-[#a0a0a0] hover:border-white/20"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </>
  )
}
