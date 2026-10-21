import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    appliedPromo,
    discountRate,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    navigate,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMessage(null);
    if (!promoInput.trim()) return;
    const result = applyPromoCode(promoInput);
    if (result.success) {
      setPromoInput('');
      setPromoMessage({ text: result.message, isError: false });
    } else {
      setPromoMessage({ text: result.message, isError: true });
    }
  };

  const isFreeDelivery = cartSubtotal >= freeDeliveryThreshold;
  const deliveryCost = isFreeDelivery || cart.length === 0 ? 0 : 2.99;
  const total = Math.max(0, cartSubtotal - discountAmount + deliveryCost);

  const freeShippingProgress = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('checkout');
  };

  const handleViewCartPage = () => {
    setIsCartOpen(false);
    navigate('cart');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-brand-charcoal/50 backdrop-blur-sm animate-fadeIn"
      onClick={() => setIsCartOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Basket"
    >
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-white shadow-drawer flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/40">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-brand-primary" />
              <h2 className="font-display font-bold text-lg text-brand-dark">
                Your Basket
              </h2>
              <span className="text-xs bg-brand-light text-brand-dark px-2 py-0.5 rounded-full font-semibold">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-brand-subtle hover:text-brand-charcoal hover:bg-brand-surface transition-colors"
              aria-label="Close basket"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-brand-light/60 px-6 py-3 border-b border-brand-border/60">
            {isFreeDelivery ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <span className="text-base">🎉</span>
                <span>You qualify for <strong>FREE UK Tracked Delivery</strong>!</span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-brand-charcoal font-medium mb-1.5">
                  Add <strong className="text-brand-primary">£{amountNeededForFreeDelivery.toFixed(2)}</strong> more for <strong>FREE UK Delivery</strong>
                </p>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-brand-border/60">
                  <div
                    className="bg-brand-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-brand-surface flex items-center justify-center text-brand-subtle mb-4">
                  <ShoppingBag size={30} />
                </div>
                <h3 className="font-display font-semibold text-lg text-brand-charcoal mb-1">
                  Your basket is empty
                </h3>
                <p className="text-xs text-brand-muted max-w-xs mb-6">
                  Explore our carefully curated UK healthcare, vitamins, and wellbeing essentials.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('shop');
                  }}
                  className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-6 py-3 rounded-brand shadow-sm transition-colors inline-flex items-center gap-2"
                >
                  Start Shopping <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-4 border-b border-brand-borderLight group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-brand-surface rounded-brand p-2 shrink-0 border border-brand-border/50 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-brand-primary tracking-wider">
                            {item.product.brand}
                          </p>
                          <h4 className="text-xs font-semibold text-brand-charcoal truncate max-w-[200px] hover:text-brand-primary transition-colors">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-subtle hover:text-red-600 transition-colors p-1"
                          aria-label={`Remove ${item.product.name}`}
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {item.selectedPackSize && (
                        <p className="text-[11px] text-brand-muted mt-0.5">
                          Size: {item.selectedPackSize}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-brand-border rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-brand-muted hover:text-brand-charcoal"
                          aria-label="Decrease"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-semibold text-brand-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-brand-muted hover:text-brand-charcoal"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-brand-dark">
                          £{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-brand-subtle">
                            (£{item.product.price.toFixed(2)} each)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-brand-border bg-brand-surface/30 space-y-4">
              {/* Promo code toggle */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-brand border border-emerald-200">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag size={13} /> Code <strong>{appliedPromo}</strong> applied (-{Math.round(discountRate * 100)}%)
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-xs underline hover:text-emerald-950 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (try WELLBEING10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 text-xs border border-brand-border rounded-brand px-3 py-2 focus:outline-none focus:border-brand-primary uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-white border border-brand-border hover:border-brand-dark text-brand-charcoal text-xs font-semibold px-3 py-2 rounded-brand transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && (
                  <p className={`text-[11px] mt-1 ${promoMessage.isError ? 'text-red-600' : 'text-emerald-700 font-medium'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Subtotal lines */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-charcoal">
                    £{cartSubtotal.toFixed(2)}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({Math.round(discountRate * 100)}%)</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-brand-muted">
                  <span>UK Tracked Delivery</span>
                  <span className="font-semibold text-brand-charcoal">
                    {deliveryCost === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `£${deliveryCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-brand-border flex justify-between text-sm font-bold text-brand-dark font-display">
                  <span>Total (Inc. UK VAT)</span>
                  <span className="text-base text-brand-primary">
                    £{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs py-3.5 px-4 rounded-brand shadow-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Secure UK Checkout <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleViewCartPage}
                  className="w-full bg-white hover:bg-brand-surface border border-brand-border text-brand-charcoal font-medium text-xs py-2.5 px-4 rounded-brand transition-colors text-center"
                >
                  View Full Basket Details
                </button>
              </div>

              {/* Security reassurance */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-brand-subtle pt-1">
                <ShieldCheck size={14} className="text-brand-primary" />
                <span>256-bit Encrypted Checkout • UK Registered</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
