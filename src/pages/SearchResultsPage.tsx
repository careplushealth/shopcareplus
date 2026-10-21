import React, { useMemo } from 'react';
import { Search, AlertCircle, ArrowRight } from 'lucide-react';
import { PRODUCTS, POPULAR_SEARCH_TERMS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/shop/ProductCard';

export const SearchResultsPage: React.FC = () => {
  const { route, executeSearch, navigate, products } = useShop();
  const query = route.params?.q || '';

  const catalog = products && products.length > 0 ? products : PRODUCTS;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return catalog.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="py-8 bg-brand-offwhite min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Search Results' }]} />

        {/* Search Header Banner */}
        <div className="bg-white rounded-brand-xl p-6 sm:p-8 border border-brand-border shadow-subtle my-6">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
            CarePlus Search Catalogue
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-brand-charcoal mt-1">
            Search Results for &ldquo;{query}&rdquo;
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Found <strong>{results.length}</strong> matching products in our UK dispensary catalogue.
          </p>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-brand-xl p-10 sm:p-14 border border-brand-border shadow-subtle max-w-lg mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-brand-surface text-brand-muted flex items-center justify-center mx-auto mb-4">
              <Search size={28} />
            </div>
            <h3 className="font-display font-bold text-lg text-brand-charcoal mb-2">
              No exact matches found
            </h3>
            <p className="text-xs text-brand-muted mb-6 leading-relaxed">
              We couldn&rsquo;t find any products matching &ldquo;{query}&rdquo;. Check your spelling or try exploring these popular terms:
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {POPULAR_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  onClick={() => executeSearch(term)}
                  className="text-xs bg-brand-surface hover:bg-brand-light text-brand-charcoal px-3.5 py-1.5 rounded-full border border-brand-border transition-colors font-medium"
                >
                  {term}
                </button>
              ))}
            </div>

            <button
              onClick={() => navigate('shop')}
              className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-6 py-3 rounded-brand transition-colors inline-flex items-center gap-2"
            >
              <span>Browse All Categories</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
