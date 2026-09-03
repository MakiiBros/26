'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dish } from '@/types';
import { formatPrice } from '@/lib/utils';

interface PromoCarouselProps {
  dishes: Dish[];
}

export function PromoCarousel({ dishes }: PromoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const promoDishes = dishes.filter(d => (d.discount_percentage ?? 0) > 0);

  if (!promoDishes || promoDishes.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="promociones" className="py-20 bg-[#0a0a0a] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
              Promociones Especiales
            </h2>
            <div className="w-16 h-1 bg-[#f6ad55] mt-2 rounded-full"></div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a] transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a] transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {promoDishes.map((dish) => (
            <div 
              key={dish.id} 
              className="snap-start shrink-0 w-[300px] bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] group"
            >
              <div className="relative h-[200px] w-full">
                {dish.image_url ? (
                  <Image 
                    src={dish.image_url} 
                    alt={dish.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full bg-black/40 flex items-center justify-center text-4xl">🍣</div>
                )}
                <div className="absolute top-3 left-3 bg-[#f6ad55] text-black font-black text-sm px-3 py-1 rounded-full shadow-lg">
                  -{dish.discount_percentage}% DSCTO
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 truncate">{dish.name}</h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[#a0a0a0] text-sm line-through decoration-[#e53e3e]">
                    {formatPrice(dish.price)}
                  </span>
                  <span className="text-[#f6ad55] font-bold text-xl">
                    {formatPrice(dish.price * (1 - (dish.discount_percentage || 0) / 100))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
