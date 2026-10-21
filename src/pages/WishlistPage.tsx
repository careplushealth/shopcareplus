import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductCard } from '../components/shop/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, wishlistCount, addToCart, toggleWishlist, navigate, products } = useShop();

  const catalog = products && products.length > 0 ? products : PRODUCTS;
  const savedProducts = catalog.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-8 bg-brand-offwhite min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Saved Items' }]} />

        <div className="my-6 bg-white rounded-brand-xl p-6 sm:p-8 border border-brand-border shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
              Your Personal Wishlist
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-brand-charcoal mt-1">
              Saved Health Essentials ({wishlistCount})
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Items saved to your local browser storage for easy re-ordering.
            </p>
          </div>
        </div>

        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {savedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-brand-xl p-12 text-center max-w-lg mx-auto border border-brand-border shadow-subtle">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-4">
              <Heart size={28} />
            </div>
            <h3 className="font-display font-bold text-lg text-brand-charcoal mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-brand-muted mb-6 leading-relaxed">
              Click the heart icon on any product to save it to your favourites list for convenient shopping later.
            </p>
            <button
              onClick={() => navigate('shop')}
              className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-6 py-3 rounded-brand transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <span>Explore Health Catalogue</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
