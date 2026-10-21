import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useShop } from '../../context/ShopContext';

export const CategoryGrid: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section id="browse-categories" className="py-16 sm:py-20 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
              Shop By Category
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-brand-charcoal mt-1">
              Curated Essentials for Every Stage
            </h2>
          </div>
          <button
            onClick={() => navigate('shop')}
            className="text-xs sm:text-sm font-semibold text-brand-primary hover:text-brand-hover inline-flex items-center gap-1 group self-start md:self-auto"
          >
            <span>View All Categories</span>
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Categories Grid (6 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate('shop', { category: category.name })}
              className="group cursor-pointer bg-white rounded-brand-lg overflow-hidden border border-brand-border shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              {/* Category Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-surface">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Subcategories pill count */}
                <span className="absolute top-3.5 right-3.5 bg-white/90 backdrop-blur-sm text-brand-dark text-[11px] font-bold px-2.5 py-1 rounded-full border border-brand-border/60">
                  {category.itemCount} Items
                </span>

                {/* Category title on image */}
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold font-display text-white group-hover:text-emerald-200 transition-colors flex items-center justify-between">
                    <span>{category.name}</span>
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                      <ArrowUpRight size={14} />
                    </div>
                  </h3>
                </div>
              </div>

              {/* Category Description & Subcategory tags */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-brand-muted line-clamp-2 mb-3 leading-relaxed">
                  {category.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-brand-borderLight">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] bg-brand-surface text-brand-charcoal px-2 py-0.5 rounded-full font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="text-[10px] text-brand-subtle px-1 py-0.5 font-medium">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
