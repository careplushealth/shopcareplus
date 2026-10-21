import React, { useState } from 'react';
import { ShoppingBag, Heart, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { RatingStars } from '../common/RatingStars';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView, navigate } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1, product.packSizes ? product.packSizes[0] : 'Standard', true);
    setTimeout(() => {
      setIsAdding(false);
    }, 700);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product);
  };

  const hasSale = product.originalPrice && product.originalPrice > product.price;
  const discountSavings = hasSale ? (product.originalPrice! - product.price).toFixed(2) : null;

  return (
    <div
      onClick={() => navigate('product', { slug: product.slug })}
      className="group bg-white rounded-brand-lg border border-brand-border overflow-hidden shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Badges & Wishlist Action */}
      <div className="relative bg-brand-surface aspect-square p-5 sm:p-6 flex items-center justify-center overflow-hidden border-b border-brand-borderLight">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {hasSale && (
            <span className="bg-brand-sale text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Save £{discountSavings}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-dark text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="bg-brand-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New In
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-red-50 text-red-500 shadow-sm'
              : 'bg-white/90 text-brand-subtle hover:text-red-500 hover:bg-white shadow-subtle'
          }`}
          aria-label={isWishlisted ? 'Remove from saved items' : 'Save item'}
        >
          <Heart size={15} className={isWishlisted ? 'fill-current' : ''} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <button
            type="button"
            onClick={handleQuickView}
            className="w-full bg-white/95 hover:bg-brand-dark hover:text-white text-brand-charcoal text-xs font-semibold py-2 rounded-brand shadow-dropdown border border-brand-border flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-primary">
              {product.brand}
            </span>
            <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
              In Stock
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-display font-semibold text-xs sm:text-sm text-brand-charcoal line-clamp-2 leading-snug group-hover:text-brand-primary transition-colors mb-2">
            {product.name}
          </h3>

          {/* Star Rating */}
          <div className="mb-3">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-brand-borderLight flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-bold text-sm sm:text-base text-brand-dark">
                £{product.price.toFixed(2)}
              </span>
              {hasSale && (
                <span className="text-[11px] text-brand-subtle line-through">
                  £{product.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-[9.5px] text-brand-muted">UK VAT Included</p>
          </div>

          {/* Add to Basket button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-9 h-9 sm:w-auto sm:px-3 sm:py-2 rounded-brand flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-light hover:bg-brand-primary text-brand-dark hover:text-white'
            }`}
            aria-label={`Add ${product.name} to basket`}
            title="Add to basket"
          >
            {isAdding ? (
              <>
                <Check size={14} />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
