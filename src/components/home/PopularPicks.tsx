import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { useShop } from '../../context/ShopContext';

export const PopularPicks: React.FC = () => {
  const { navigate, products } = useShop();

  const catalog = products && products.length > 0 ? products : PRODUCTS;
  const bestSellers = catalog.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-brand-surface/40 border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest text-brand-primary mb-1">
              <Flame size={14} className="text-brand-sale" />
              <span>Customer Favourites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-brand-charcoal">
              Popular Picks
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
              Frequently repurchased health staples trusted by households throughout the UK.
            </p>
          </div>

          <button
            onClick={() => navigate('shop', { sort: 'rating' })}
            className="text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-hover inline-flex items-center gap-1 group self-start md:self-auto"
          >
            <span>View All Top Rated</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
