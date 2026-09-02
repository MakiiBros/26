import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Dish } from '@/types';

interface DishCardProps {
  dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video w-full bg-gray-100">
        {dish.image_url ? (
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-400">
            <span className="text-sm font-medium">Sin imagen</span>
          </div>
        )}
        
        {!dish.is_available && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            Agotado
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {dish.name}
          </h3>
          <span className="text-orange-600 font-bold whitespace-nowrap">
            {formatPrice(dish.price)}
          </span>
        </div>
        
        {dish.description && (
          <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
            {dish.description}
          </p>
        )}
      </div>
    </div>
  );
}
