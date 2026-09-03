import Image from 'next/image';
import { Dish } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

interface PopularDishesProps {
  dishes: Dish[];
}

export function PopularDishes({ dishes }: PopularDishesProps) {
  if (!dishes || dishes.length === 0) return null;

  return (
    <section id="populares" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wider">
            Los Más Populares
          </h2>
          <div className="w-24 h-1 bg-[#e53e3e] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.slice(0, 6).map((dish) => (
            <div 
              key={dish.id}
              className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#e53e3e]/50 transition-all group flex flex-col h-full"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                {dish.image_url ? (
                  <Image
                    src={dish.image_url}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🍣
                  </div>
                )}
                {dish.discount_percentage && dish.discount_percentage > 0 && (
                  <div className="absolute top-4 left-4 bg-[#f6ad55] text-black text-xs font-bold px-2 py-1 rounded">
                    -{dish.discount_percentage}%
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2">{dish.name}</h3>
                <p className="text-[#a0a0a0] text-sm mb-4 flex-grow line-clamp-2">
                  {dish.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#2a2a2a]">
                  <div className="flex flex-col">
                    {dish.discount_percentage && dish.discount_percentage > 0 ? (
                      <>
                        <span className="text-[#a0a0a0] text-xs line-through">
                          {formatPrice(dish.price)}
                        </span>
                        <span className="text-[#f6ad55] font-bold text-lg">
                          {formatPrice(dish.price * (1 - dish.discount_percentage / 100))}
                        </span>
                      </>
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {formatPrice(dish.price)}
                      </span>
                    )}
                  </div>
                  
                  <a
                    href="#menu"
                    className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#e53e3e] text-white p-2 rounded-full transition-colors"
                    aria-label="Ver en el menú"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#menu"
            className="inline-block px-8 py-3 border border-white/20 text-white font-medium hover:bg-white/5 rounded-md transition-colors"
          >
            Ver Menú Completo
          </a>
        </div>
      </div>
    </section>
  );
}
