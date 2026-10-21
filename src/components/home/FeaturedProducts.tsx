import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { useShop } from '../../context/ShopContext';

export const FeaturedProducts: React.FC = () => {
  const { navigate, products } = useShop();
  const [activeTab, setActiveTab] = useState<'All' | 'Vitamins' | 'Healthcare' | 'Personal Care' | 'Wellness'>('All');

  const catalog = products && products.length > 0 ? products : PRODUCTS;
  const filteredProducts = catalog.filter((p) => {
    if (activeTab === 'All') return p.isFeatured;
    if (activeTab === 'Vitamins') return p.category === 'Vitamins & Supplements';
    if (activeTab === 'Healthcare') return p.category === 'Everyday Healthcare';
    if (activeTab === 'Personal Care') return p.category === 'Personal Care';
    if (activeTab === 'Wellness') return p.category === 'Health & Wellness' || p.category === 'Mobility & Living Aids';
    return true;
  }).slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
              Handpicked By CarePlus
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-brand-charcoal mt-1">
              Shop Our Favourites
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
              Discover our most trusted vitamins, gentle skincare formulas, and everyday healthcare essentials.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {(['All', 'Vitamins', 'Healthcare', 'Personal Care', 'Wellness'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap font-medium ${
                  activeTab === tab
                    ? 'bg-brand-dark text-white font-semibold shadow-sm'
                    : 'bg-brand-surface hover:bg-brand-light text-brand-charcoal'
                }`}
              >
                {tab === 'All' ? 'All Favourites' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-2 bg-brand-light hover:bg-brand-primary text-brand-dark hover:text-white font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-brand transition-colors"
          >
            <span>Explore All Health Essentials</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};
