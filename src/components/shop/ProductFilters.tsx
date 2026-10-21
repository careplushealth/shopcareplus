import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface ProductFiltersProps {
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedBrands: string[];
  maxPrice: number;
  inStockOnly: boolean;
  selectedDietary: string[];
  onSelectCategory: (cat?: string) => void;
  onSelectSubcategory: (sub?: string) => void;
  onToggleBrand: (brand: string) => void;
  onChangeMaxPrice: (price: number) => void;
  onToggleInStockOnly: (val: boolean) => void;
  onToggleDietary: (tag: string) => void;
  onResetFilters: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  selectedSubcategory,
  selectedBrands,
  maxPrice,
  inStockOnly,
  selectedDietary,
  onSelectCategory,
  onSelectSubcategory,
  onToggleBrand,
  onChangeMaxPrice,
  onToggleInStockOnly,
  onToggleDietary,
  onResetFilters,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const { products } = useShop();
  const catalog = products && products.length > 0 ? products : PRODUCTS;

  // Extract all unique brands
  const allBrands = Array.from(new Set(catalog.map((p) => p.brand))).sort();

  // Extract all unique dietary tags
  const allDietary = Array.from(
    new Set(catalog.flatMap((p) => p.dietaryTags || []))
  ).filter((tag) => ['Vegetarian', 'Vegan', 'Gluten-Free', 'Hypoallergenic'].includes(tag));

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedSubcategory) ||
    selectedBrands.length > 0 ||
    maxPrice < 30 ||
    inStockOnly ||
    selectedDietary.length > 0;

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-6' : ''}`}>
      {/* Filters Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-brand-primary" />
          <h3 className="font-display font-bold text-sm text-brand-dark">
            Filter Products
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[11px] font-semibold text-brand-muted hover:text-brand-sale flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          {isMobileDrawer && onCloseMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 rounded-full text-brand-subtle hover:text-brand-charcoal"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Category Accordion / List */}
      <div>
        <h4 className="text-xs uppercase font-bold tracking-wider text-brand-charcoal mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => {
              onSelectCategory(undefined);
              onSelectSubcategory(undefined);
            }}
            className={`w-full text-left text-xs py-1.5 px-2 rounded-brand transition-colors flex items-center justify-between ${
              !selectedCategory
                ? 'bg-brand-light text-brand-dark font-bold'
                : 'text-brand-muted hover:text-brand-charcoal hover:bg-brand-surface'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] text-brand-subtle">{catalog.length}</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isCatSelected = selectedCategory === cat.name;
            const count = catalog.filter((p) => p.category === cat.name).length;

            return (
              <div key={cat.id}>
                <button
                  onClick={() => {
                    onSelectCategory(cat.name);
                    onSelectSubcategory(undefined);
                  }}
                  className={`w-full text-left text-xs py-1.5 px-2 rounded-brand transition-colors flex items-center justify-between ${
                    isCatSelected
                      ? 'bg-brand-light text-brand-dark font-bold'
                      : 'text-brand-muted hover:text-brand-charcoal hover:bg-brand-surface'
                  }`}
                >
                  <span className="truncate pr-2">{cat.name}</span>
                  <span className="text-[10px] text-brand-subtle">{count}</span>
                </button>

                {/* Subcategories */}
                {isCatSelected && (
                  <div className="pl-3 py-1 space-y-0.5 border-l-2 border-brand-primary/30 ml-2 my-1">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => onSelectSubcategory(sub)}
                        className={`w-full text-left text-[11px] py-1 px-2 rounded transition-colors ${
                          selectedSubcategory === sub
                            ? 'text-brand-primary font-bold bg-white shadow-subtle'
                            : 'text-brand-subtle hover:text-brand-dark'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div className="pt-4 border-t border-brand-border">
        <h4 className="text-xs uppercase font-bold tracking-wider text-brand-charcoal mb-3">
          Brand
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {allBrands.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            const count = catalog.filter((p) => p.brand === brand).length;

            return (
              <label
                key={brand}
                className="flex items-center justify-between text-xs text-brand-charcoal hover:text-brand-dark cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleBrand(brand)}
                    className="w-3.5 h-3.5 rounded text-brand-primary focus:ring-brand-primary border-brand-border"
                  />
                  <span className={isChecked ? 'font-semibold text-brand-dark' : 'text-brand-muted'}>
                    {brand}
                  </span>
                </div>
                <span className="text-[10px] text-brand-subtle">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-brand-border">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs uppercase font-bold tracking-wider text-brand-charcoal">
            Max Price
          </h4>
          <span className="text-xs font-bold text-brand-dark font-display">
            £{maxPrice.toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={maxPrice}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-primary cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-brand-subtle mt-1">
          <span>£5.00</span>
          <span>£30.00</span>
        </div>
      </div>

      {/* Availability / In Stock Only */}
      <div className="pt-4 border-t border-brand-border">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-brand-charcoal">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary border-brand-border"
          />
        </label>
      </div>

      {/* Dietary & Lifestyle Preferences */}
      {allDietary.length > 0 && (
        <div className="pt-4 border-t border-brand-border">
          <h4 className="text-xs uppercase font-bold tracking-wider text-brand-charcoal mb-3">
            Dietary & Lifestyle
          </h4>
          <div className="space-y-2">
            {allDietary.map((tag) => {
              const isChecked = selectedDietary.includes(tag);
              return (
                <label
                  key={tag}
                  className="flex items-center gap-2 text-xs text-brand-charcoal hover:text-brand-dark cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleDietary(tag)}
                    className="w-3.5 h-3.5 rounded text-brand-primary focus:ring-brand-primary border-brand-border"
                  />
                  <span className={isChecked ? 'font-semibold text-brand-dark' : 'text-brand-muted'}>
                    {tag}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
