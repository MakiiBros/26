import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryTabs({ categories, selectedCategoryId, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-2 min-w-max px-4 md:px-0">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-semibold transition-colors duration-200 whitespace-nowrap",
              selectedCategoryId === category.id
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
