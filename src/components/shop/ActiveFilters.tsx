import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedBrands: string[];
  maxPrice: number;
  inStockOnly: boolean;
  selectedDietary: string[];
  onRemoveCategory: () => void;
  onRemoveSubcategory: () => void;
  onRemoveBrand: (brand: string) => void;
  onResetPrice: () => void;
  onRemoveInStockOnly: () => void;
  onRemoveDietary: (tag: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedCategory,
  selectedSubcategory,
  selectedBrands,
  maxPrice,
  inStockOnly,
  selectedDietary,
  onRemoveCategory,
  onRemoveSubcategory,
  onRemoveBrand,
  onResetPrice,
  onRemoveInStockOnly,
  onRemoveDietary,
  onClearAll,
}) => {
  const hasFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedSubcategory) ||
    selectedBrands.length > 0 ||
    maxPrice < 30 ||
    inStockOnly ||
    selectedDietary.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <span className="text-xs font-semibold text-brand-muted mr-1">Active:</span>

      {selectedCategory && (
        <span className="inline-flex items-center gap-1 text-xs bg-brand-light text-brand-dark px-2.5 py-1 rounded-full border border-brand-border font-medium">
          Category: {selectedCategory}
          <button onClick={onRemoveCategory} className="hover:text-red-600 p-0.5">
            <X size={12} />
          </button>
        </span>
      )}

      {selectedSubcategory && (
        <span className="inline-flex items-center gap-1 text-xs bg-brand-light text-brand-dark px-2.5 py-1 rounded-full border border-brand-border font-medium">
          {selectedSubcategory}
          <button onClick={onRemoveSubcategory} className="hover:text-red-600 p-0.5">
            <X size={12} />
          </button>
        </span>
      )}

      {selectedBrands.map((brand) => (
        <span
          key={brand}
          className="inline-flex items-center gap-1 text-xs bg-brand-surface text-brand-charcoal px-2.5 py-1 rounded-full border border-brand-border font-medium"
        >
          {brand}
          <button onClick={() => onRemoveBrand(brand)} className="hover:text-red-600 p-0.5">
            <X size={12} />
          </button>
        </span>
      ))}

      {maxPrice < 30 && (
        <span className="inline-flex items-center gap-1 text-xs bg-brand-surface text-brand-charcoal px-2.5 py-1 rounded-full border border-brand-border font-medium">
          Under £{maxPrice}
          <button onClick={onResetPrice} className="hover:text-red-600 p-0.5">
            <X size={12} />
          </button>
        </span>
      )}

      {inStockOnly && (
        <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
          In Stock Only
          <button onClick={onRemoveInStockOnly} className="hover:text-red-600 p-0.5">
            <X size={12} />
          </button>
        </span>
      )}

      {selectedDietary.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 text-xs bg-brand-surface text-brand-charcoal px-2.5 py-1 rounded-full border border-brand-border font-medium"
        >
          {tag}
          <button onClick={() => onRemoveDietary(tag)} className="hover:text-red-600 p-0.5">
            <X size={12} />
          </button>
        </span>
      ))}

      <button
        onClick={onClearAll}
        className="text-xs text-brand-sale hover:underline font-semibold ml-2"
      >
        Clear all
      </button>
    </div>
  );
};
