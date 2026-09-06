import Image from 'next/image';
import { Dish } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Flame, ArrowRight, Sparkles } from 'lucide-react';

interface PopularDishesProps {
  dishes: Dish[];
}

export function PopularDishes({ dishes }: PopularDishesProps) {
  if (!dishes || dishes.length === 0) return null;

  return (
    <section id="populares" className="py-24 bg-[#09090c] relative">
      {/* Sombra sutil de separación */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de Sección Editorial */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e53e3e]/10 border border-[#e53e3e]/20 text-[#e53e3e] text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-[#e53e3e]" />
            <span>Favoritos de la Barra</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
            Los Más Populares
          </h2>

          <p className="text-sm sm:text-base text-slate-400">
            Los rolls y platos más aclamados por nuestros clientes en Lima Norte. 
            Crocantes, ahumados y con abundante salsa.
          </p>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {dishes.slice(0, 6).map((dish) => {
            const hasDiscount = Boolean(dish.discount_percentage && dish.discount_percentage > 0);
            const discountedPrice = hasDiscount
              ? dish.price * (1 - (dish.discount_percentage || 0) / 100)
              : dish.price;

            return (
              <div
                key={dish.id}
                className="group relative bg-[#13131b] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-[#e53e3e]/40 transition-all duration-300 card-interactive flex flex-col h-full"
              >
                {/* Contenedor de Imagen con Zoom */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/50">
                  {dish.image_url ? (
                    <Image
                      src={dish.image_url}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2 bg-[#171722]">
                      <Sparkles className="w-8 h-8 text-[#e53e3e]/60" />
                      <span className="text-xs font-medium">MakiBros Especial</span>
                    </div>
                  )}

                  {/* Badges Flotantes */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {hasDiscount && (
                      <span className="bg-[#f59e0b] text-black text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-lg">
                        -{dish.discount_percentage}% DSCTO
                      </span>
                    )}
                    {dish.is_popular && (
                      <span className="bg-[#e53e3e] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wide">
                        ★ Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-5 sm:p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#f59e0b] transition-colors mb-1.5">
                    {dish.name}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm mb-4 flex-grow line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.08]">
                    <div className="flex flex-col">
                      {hasDiscount ? (
                        <>
                          <span className="text-slate-500 text-xs line-through tabular-nums">
                            {formatPrice(dish.price)}
                          </span>
                          <span className="text-[#f59e0b] font-black text-lg sm:text-xl tabular-nums">
                            {formatPrice(discountedPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-white font-black text-lg sm:text-xl tabular-nums">
                          {formatPrice(dish.price)}
                        </span>
                      )}
                    </div>

                    <a
                      href="#menu"
                      className="inline-flex items-center gap-1.5 bg-white/[0.06] hover:bg-[#e53e3e] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all btn-press border border-white/[0.1] hover:border-[#e53e3e] cursor-pointer"
                      aria-label={`Ver ${dish.name} en el menú`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Pedir</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón hacia la carta completa */}
        <div className="mt-14 text-center">
          <a
            href="#menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/[0.15] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.3] text-white font-semibold text-sm transition-all btn-press cursor-pointer"
          >
            <span>Ver Carta Completa con Precios</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

