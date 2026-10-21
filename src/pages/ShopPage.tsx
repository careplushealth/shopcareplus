import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { Product, SortOption } from '../types';
import { useShop } from '../context/ShopContext';
import { Breadcrumbs, BreadcrumbItem } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductFilters } from '../components/shop/ProductFilters';
import { ActiveFilters } from '../components/shop/ActiveFilters';
import { SortDropdown } from '../components/shop/SortDropdown';

export const ShopPage: React.FC = () => {
  const { route, navigate, products } = useShop();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    route.params?.category
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | undefined>(
    route.params?.subcategory
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    route.params?.brand ? [route.params.brand] : []
  );
  const [maxPrice, setMaxPrice] = useState<number>(30);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>(
    (route.params?.sort as SortOption) || 'featured'
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync route params when URL hash changes
  useEffect(() => {
    if (route.params?.category !== undefined) {
      setSelectedCategory(route.params.category);
    }
    if (route.params?.subcategory !== undefined) {
      setSelectedSubcategory(route.params.subcategory);
    }
  }, [route.params?.category, route.params?.subcategory]);

  // Current category info
  const currentCategoryInfo = useMemo(() => {
    if (!selectedCategory) return null;
    return CATEGORIES.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

  // Brand toggle
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Dietary toggle
  const handleToggleDietary = (tag: string) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory(undefined);
    setSelectedSubcategory(undefined);
    setSelectedBrands([]);
    setMaxPrice(30);
    setInStockOnly(false);
    setSelectedDietary([]);
    setSort('featured');
    navigate('shop');
  };

  // Filter & Sort Logic
  const catalog = products && products.length > 0 ? products : PRODUCTS;
  const filteredProducts = useMemo(() => {
    let result = [...catalog];

    // Filter by Special Offers (from URL param)
    if (route.params?.onSale === 'true') {
      result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
    }

    // Category
    if (selectedCategory) {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Subcategory
    if (selectedSubcategory) {
      result = result.filter(
        (p) => p.subcategory.toLowerCase() === selectedSubcategory.toLowerCase()
      );
    }

    // Brands
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Max Price
    if (maxPrice < 30) {
      result = result.filter((p) => p.price <= maxPrice);
    }

    // In Stock Only
    if (inStockOnly) {
      result = result.filter((p) => p.inStock && p.stockCount > 0);
    }

    // Dietary
    if (selectedDietary.length > 0) {
      result = result.filter((p) =>
        selectedDietary.some((tag) => p.dietaryTags?.includes(tag))
      );
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [
    selectedCategory,
    selectedSubcategory,
    selectedBrands,
    maxPrice,
    inStockOnly,
    selectedDietary,
    sort,
    route.params?.onSale,
  ]);

  // Breadcrumbs items
  const breadcrumbItems = useMemo(() => {
    const items: BreadcrumbItem[] = [{ label: 'Shop All', path: 'shop' }];
    if (selectedCategory) {
      items.push({
        label: selectedCategory,
        path: 'shop',
        params: { category: selectedCategory },
      });
    }
    if (selectedSubcategory) {
      items.push({ label: selectedSubcategory });
    }
    return items;
  }, [selectedCategory, selectedSubcategory]);

  return (
    <div className="py-8 bg-brand-offwhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Category Header Banner */}
        <div className="bg-white rounded-brand-xl p-6 sm:p-10 border border-brand-border shadow-subtle my-6 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
              CarePlus Health Shop • UK Catalogue
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-brand-charcoal">
              {route.params?.onSale === 'true'
                ? 'Special Offers & Bundles'
                : selectedSubcategory || selectedCategory || 'All Health & Wellbeing Products'}
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              {currentCategoryInfo
                ? currentCategoryInfo.description
                : 'Browse our complete range of authentic vitamins, everyday remedies, sensitive skincare, and mobility aids dispatched across the UK.'}
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-surface/60 to-transparent pointer-events-none hidden md:block" />
        </div>

        {/* Main Shop Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filters Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-brand-xl p-6 border border-brand-border shadow-subtle sticky top-28">
            <ProductFilters
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              selectedBrands={selectedBrands}
              maxPrice={maxPrice}
              inStockOnly={inStockOnly}
              selectedDietary={selectedDietary}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setSelectedSubcategory(undefined);
              }}
              onSelectSubcategory={(sub) => setSelectedSubcategory(sub)}
              onToggleBrand={handleToggleBrand}
              onChangeMaxPrice={setMaxPrice}
              onToggleInStockOnly={setInStockOnly}
              onToggleDietary={handleToggleDietary}
              onResetFilters={handleResetFilters}
            />
          </aside>

          {/* Product Grid Area (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Top Toolbar: Product count + Sort + Mobile filter trigger */}
            <div className="bg-white rounded-brand-lg p-4 border border-brand-border shadow-subtle flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden bg-brand-surface hover:bg-brand-light text-brand-dark text-xs font-semibold px-3 py-2 rounded-brand border border-brand-border flex items-center gap-1.5 transition-colors"
                >
                  <SlidersHorizontal size={14} />
                  <span>Filters</span>
                </button>

                <p className="text-xs text-brand-muted">
                  Showing <strong className="text-brand-dark">{filteredProducts.length}</strong> of{' '}
                  {catalog.length} products
                </p>
              </div>

              <SortDropdown value={sort} onChange={setSort} />
            </div>

            {/* Active filter chips */}
            <ActiveFilters
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              selectedBrands={selectedBrands}
              maxPrice={maxPrice}
              inStockOnly={inStockOnly}
              selectedDietary={selectedDietary}
              onRemoveCategory={() => {
                setSelectedCategory(undefined);
                setSelectedSubcategory(undefined);
              }}
              onRemoveSubcategory={() => setSelectedSubcategory(undefined)}
              onRemoveBrand={handleToggleBrand}
              onResetPrice={() => setMaxPrice(30)}
              onRemoveInStockOnly={() => setInStockOnly(false)}
              onRemoveDietary={handleToggleDietary}
              onClearAll={handleResetFilters}
            />

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white rounded-brand-xl p-12 text-center border border-brand-border shadow-subtle max-w-lg mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-brand-surface text-brand-muted flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={28} />
                </div>
                <h3 className="font-display font-bold text-lg text-brand-charcoal mb-2">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-brand-muted mb-6 leading-relaxed">
                  Try clearing your filters or increasing your maximum price to view more health essentials.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-6 py-3 rounded-brand shadow-sm transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 bg-brand-charcoal/60 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setIsMobileFiltersOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-drawer flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 overflow-y-auto">
              <ProductFilters
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                selectedBrands={selectedBrands}
                maxPrice={maxPrice}
                inStockOnly={inStockOnly}
                selectedDietary={selectedDietary}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setSelectedSubcategory(undefined);
                }}
                onSelectSubcategory={(sub) => setSelectedSubcategory(sub)}
                onToggleBrand={handleToggleBrand}
                onChangeMaxPrice={setMaxPrice}
                onToggleInStockOnly={setInStockOnly}
                onToggleDietary={handleToggleDietary}
                onResetFilters={handleResetFilters}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileFiltersOpen(false)}
              />
            </div>
            <div className="p-4 border-t border-brand-border bg-brand-surface/40">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold py-3 rounded-brand transition-colors"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
