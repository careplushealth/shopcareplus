import React, { useState } from 'react';
import { ShoppingBag, Heart, ShieldCheck, Truck, Clock, Check, ArrowRight, Share2 } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { RatingStars } from '../common/RatingStars';

interface ProductInfoProps {
  product: Product;
  onScrollToReviews: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product, onScrollToReviews }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [selectedPack, setSelectedPack] = useState<string>(
    product.packSizes && product.packSizes.length > 0 ? product.packSizes[0] : 'Standard'
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const hasSale = product.originalPrice && product.originalPrice > product.price;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedPack, true);
    setTimeout(() => {
      setIsAdding(false);
    }, 700);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Brand & Stock Pill */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs uppercase font-bold tracking-wider text-brand-primary">
            {product.brand}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            In Stock ({product.stockCount} available)
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-brand-charcoal leading-tight">
          {product.name}
        </h1>

        {/* Rating & Review Jump */}
        <div className="flex items-center gap-3 mt-3">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
          <span className="text-brand-subtle">•</span>
          <button
            onClick={onScrollToReviews}
            className="text-xs font-semibold text-brand-primary hover:underline"
          >
            Read {product.reviewCount} verified reviews
          </button>
        </div>
      </div>

      {/* Pricing Strip */}
      <div className="bg-brand-surface/70 p-4 rounded-brand border border-brand-border/60">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold font-display text-brand-dark">
            £{product.price.toFixed(2)}
          </span>
          {hasSale && (
            <span className="text-base text-brand-subtle line-through">
              £{product.originalPrice!.toFixed(2)}
            </span>
          )}
          {hasSale && (
            <span className="text-xs font-bold text-brand-sale bg-brand-saleBg px-2 py-0.5 rounded">
              Save £{(product.originalPrice! - product.price).toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-xs text-brand-muted mt-1">
          Price includes UK VAT. Free UK Tracked Delivery on orders over £35.
        </p>
      </div>

      {/* Short Description */}
      <p className="text-sm text-brand-muted leading-relaxed">
        {product.shortDescription}
      </p>

      {/* Pack Size / Variant Selector */}
      {product.packSizes && product.packSizes.length > 0 && (
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-charcoal">
            Package Size / Option: <span className="text-brand-primary">{selectedPack}</span>
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.packSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedPack(size)}
                className={`text-xs px-4 py-2.5 rounded-brand border transition-all text-left ${
                  selectedPack === size
                    ? 'border-brand-primary bg-brand-light text-brand-dark font-bold shadow-subtle'
                    : 'border-brand-border bg-white text-brand-charcoal hover:border-brand-muted'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Basket */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Stepper */}
          <div className="flex items-center border border-brand-border rounded-brand bg-white h-12 shadow-subtle">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-full flex items-center justify-center text-sm font-semibold text-brand-charcoal hover:bg-brand-surface rounded-l-brand"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-12 text-center text-sm font-bold text-brand-charcoal">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
              className="w-10 h-full flex items-center justify-center text-sm font-semibold text-brand-charcoal hover:bg-brand-surface rounded-r-brand"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Basket button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 h-12 bg-brand-dark hover:bg-brand-primary text-white font-semibold text-sm px-6 rounded-brand shadow-card hover:shadow-card-hover transition-all flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <Check size={18} />
                <span>Added to Basket</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>Add to Basket — £{(product.price * quantity).toFixed(2)}</span>
              </>
            )}
          </button>

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`w-12 h-12 border rounded-brand flex items-center justify-center transition-all ${
              isWishlisted
                ? 'border-red-200 bg-red-50 text-red-600 shadow-sm'
                : 'border-brand-border bg-white text-brand-muted hover:text-brand-charcoal hover:bg-brand-surface shadow-subtle'
            }`}
            aria-label={isWishlisted ? 'Remove from saved items' : 'Save to wishlist'}
            title="Wishlist"
          >
            <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            className="w-12 h-12 border border-brand-border bg-white text-brand-muted hover:text-brand-charcoal hover:bg-brand-surface rounded-brand flex items-center justify-center shadow-subtle transition-colors relative"
            aria-label="Share product"
            title="Copy link"
          >
            <Share2 size={18} />
            {copiedLink && (
              <span className="absolute -top-8 bg-brand-charcoal text-white text-[10px] px-2 py-0.5 rounded shadow">
                Copied!
              </span>
            )}
          </button>
        </div>

        {/* Same-day dispatch guarantee strip */}
        <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-brand p-3 flex items-center gap-3 text-xs text-emerald-900">
          <Clock size={16} className="text-brand-primary shrink-0" />
          <span>
            <strong>Order before 3:00pm</strong> for same-day UK dispatch via Royal Mail Tracked.
          </span>
        </div>
      </div>

      {/* Trust & Guarantee Highlights */}
      <div className="pt-4 border-t border-brand-border grid grid-cols-2 gap-3 text-xs text-brand-charcoal">
        <div className="flex items-center gap-2">
          <Truck size={15} className="text-brand-primary shrink-0" />
          <span>Free UK Delivery Over £35</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={15} className="text-brand-primary shrink-0" />
          <span>100% Genuine UK Supply</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={15} className="text-brand-primary shrink-0" />
          <span>30-Day Hassle-Free Returns</span>
        </div>
        <div className="flex items-center gap-2">
          <Check size={15} className="text-brand-primary shrink-0" />
          <span>UK Pharmacy Partner</span>
        </div>
      </div>
    </div>
  );
};
