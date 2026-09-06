'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Tag, ShoppingBag, Sparkles } from 'lucide-react';
import { Dish } from '@/types';
import { formatPrice } from '@/lib/utils';

interface PromoCarouselProps {
  dishes: Dish[];
}

export function PromoCarousel({ dishes }: PromoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const promoDishes = dishes.filter((d) => (d.discount_percentage ?? 0) > 0);

  if (!promoDishes || promoDishes.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="promociones" className="py-20 bg-[#09090c] overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera con controles de scroll */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/25 text-[#f59e0b] text-xs font-bold uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              <span>Descuentos Imperdibles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Promociones Especiales
            </h2>
            <p className="text-sm text-slate-400 max-w-lg">
              Aprovecha nuestras ofertas por tiempo limitado en rolls seleccionados y combos para bajonear.
            </p>
          </div>

          {/* Botones de navegación táctiles */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => scroll('left')}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all btn-press cursor-pointer"
              aria-label="Promoción anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08] transition-all btn-press cursor-pointer"
              aria-label="Promoción siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carrusel Deslizable */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pt-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {promoDishes.map((dish) => {
            const discount = dish.discount_percentage || 0;
            const discountedPrice = dish.price * (1 - discount / 100);

            return (
              <div
                key={dish.id}
                className="snap-start shrink-0 w-[300px] sm:w-[340px] bg-[#13131b] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#f59e0b]/40 transition-all duration-300 card-interactive flex flex-col group"
              >
                {/* Imagen del platillo en promo */}
                <div className="relative h-[210px] w-full bg-black/40 overflow-hidden">
                  {dish.image_url ? (
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fill
                      sizes="340px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Sparkles className="w-8 h-8 text-[#f59e0b]/50" />
                    </div>
                  )}

                  {/* Badge de Descuento Destacado */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-black text-xs px-3 py-1.5 rounded-full shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
                    -{discount}% DSCTO
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#f59e0b] transition-colors truncate">
                    {dish.name}
                  </h3>

                  {dish.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.08]">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 line-through tabular-nums">
                        {formatPrice(dish.price)}
                      </span>
                      <span className="text-xl font-black text-[#f59e0b] tabular-nums">
                        {formatPrice(discountedPrice)}
                      </span>
                    </div>

                    <a
                      href="#menu"
                      className="inline-flex items-center gap-1.5 bg-[#e53e3e]/15 hover:bg-[#e53e3e] text-[#f87171] hover:text-white border border-[#e53e3e]/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors btn-press cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Aprovechar</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

