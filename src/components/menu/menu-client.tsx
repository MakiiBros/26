'use client';

import { useState } from 'react';
import { Category, Dish } from '@/types';
import { CategoryTabs } from './category-tabs';
import { DishCard } from './dish-card';

interface MenuClientProps {
  categories: Category[];
  dishes: Dish[];
}

export function MenuClient({ categories, dishes }: MenuClientProps) {
  // Initialize with the first category if it exists
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories.length > 0 ? categories[0].id : ''
  );

  const filteredDishes = dishes.filter(
    (dish) => dish.category_id === selectedCategoryId
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Nuestro Menú</h1>
        <p className="text-gray-600">Descubre nuestra variedad de makis y platos especiales.</p>
      </div>

      {categories.length > 0 && (
        <CategoryTabs
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      )}

      {filteredDishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">No hay platos disponibles en esta categoría por el momento.</p>
        </div>
      )}
    </div>
  );
}
