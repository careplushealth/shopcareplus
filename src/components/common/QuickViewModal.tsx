import React, { useState } from 'react';
import { X, Check, ShoppingBag, Heart, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { RatingStars } from './RatingStars';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist, navigate } = useShop();
  const [selectedPack, setSelectedPack] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentPack = selectedPack || (product.packSizes && product.packSizes[0]) || 'Standard';
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, currentPack, true);
    setTimeout(() => {
      setIsAdding(false);
      closeQuickView();
    }, 600);
  };

  const handleViewFullProduct = () => {
    closeQuickView();
    navigate('product', { slug: product.slug });
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={closeQuickView}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
    >
      <div
        className="relative bg-white rounded-brand-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-brand-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-brand-light text-brand-charcoal hover:text-brand-dark flex items-center justify-center shadow-subtle transition-all"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product image */}
          <div className="bg-brand-surface p-6 sm:p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-brand-border">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 w-auto object-contain rounded-brand mix-blend-multiply"
            />
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="absolute top-4 left-4 bg-brand-sale text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Save £{(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Product details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-primary">
                  {product.brand}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
                  In Stock ({product.stockCount})
                </span>
              </div>

              <h2 id="quick-view-title" className="text-xl font-bold text-brand-charcoal font-display leading-tight mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mb-4 pb-4 border-b border-brand-borderLight">
                <span className="text-2xl font-bold text-brand-dark font-display">
                  £{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-brand-subtle line-through">
                    £{product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-[11px] text-brand-muted">UK VAT Included</span>
              </div>

              {/* Short description */}
              <p className="text-xs text-brand-muted line-clamp-3 mb-4 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Pack Sizes */}
              {product.packSizes && product.packSizes.length > 1 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-brand-charcoal mb-2">
                    Select Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.packSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedPack(size)}
                        className={`text-xs px-3 py-1.5 rounded-brand border transition-all ${
                          currentPack === size
                            ? 'border-brand-primary bg-brand-light text-brand-dark font-semibold'
                            : 'border-brand-border hover:border-brand-muted text-brand-charcoal'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-brand-border rounded-brand bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-brand-charcoal hover:bg-brand-surface rounded-l-brand"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-semibold text-brand-charcoal">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center text-brand-charcoal hover:bg-brand-surface rounded-r-brand"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 bg-brand-dark hover:bg-brand-primary text-white font-medium text-xs px-4 py-2.5 rounded-brand shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-75"
                >
                  {isAdding ? (
                    <>
                      <Check size={16} /> Added to Basket
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} /> Add to Basket — £{(product.price * quantity).toFixed(2)}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`w-9 h-9 border rounded-brand flex items-center justify-center transition-colors ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-600'
                      : 'border-brand-border text-brand-muted hover:text-brand-charcoal hover:bg-brand-surface'
                  }`}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
                </button>
              </div>
            </div>

            {/* Modal footer trust icons & full page link */}
            <div className="pt-3 border-t border-brand-borderLight flex items-center justify-between text-xs text-brand-muted">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Truck size={13} className="text-brand-primary" /> Royal Mail Tracked
                </span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck size={13} className="text-brand-primary" /> UK Verified
                </span>
              </div>
              <button
                onClick={handleViewFullProduct}
                className="font-semibold text-brand-primary hover:text-brand-hover inline-flex items-center gap-1"
              >
                Full details <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
