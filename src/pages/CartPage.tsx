import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck, Tag, ChevronLeft } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
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
  const [orderNote, setOrderNote] = useState('');

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

  return (
    <div className="py-8 bg-brand-offwhite min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Shopping Basket' }]} />

        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-bold font-display text-brand-charcoal">
            Shopping Basket ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            CarePlus UK Pharmacy dispensary fulfillment • Standard & express delivery available.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-brand-xl border border-brand-border p-12 text-center max-w-lg mx-auto shadow-subtle">
            <div className="w-20 h-20 rounded-full bg-brand-surface text-brand-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-xl font-bold font-display text-brand-charcoal mb-2">
              Your basket is empty
            </h2>
            <p className="text-xs text-brand-muted mb-6 leading-relaxed">
              Looks like you haven&rsquo;t added anything to your basket yet. Discover our curated collection of UK vitamins, daily health essentials, and mobility aids.
            </p>
            <button
              onClick={() => navigate('shop')}
              className="bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs px-8 py-3.5 rounded-brand transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <span>Explore Products</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Column (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free delivery prompt */}
              <div className="bg-brand-light/70 p-4 rounded-brand border border-brand-border/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck size={20} className="text-brand-primary shrink-0" />
                  <p className="text-xs text-brand-charcoal">
                    {isFreeDelivery ? (
                      <span className="font-semibold text-emerald-800">
                        🎉 You qualify for <strong>FREE UK Tracked Delivery</strong>!
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-brand-primary">£{amountNeededForFreeDelivery.toFixed(2)}</strong> more to your order for <strong>FREE UK Delivery</strong>.
                      </span>
                    )}
                  </p>
                </div>
                {!isFreeDelivery && (
                  <button
                    onClick={() => navigate('shop')}
                    className="text-xs font-bold text-brand-primary hover:underline shrink-0 hidden sm:inline"
                  >
                    Add more items &rarr;
                  </button>
                )}
              </div>

              {/* Items Card */}
              <div className="bg-white rounded-brand-xl border border-brand-border shadow-subtle divide-y divide-brand-borderLight overflow-hidden">
                <div className="p-4 bg-brand-surface/40 hidden sm:grid grid-cols-12 text-xs uppercase font-bold tracking-wider text-brand-muted">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Product & thumbnail */}
                    <div className="sm:col-span-6 flex gap-4 items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-surface rounded-brand p-2 border border-brand-border/40 shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain mix-blend-multiply"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider">
                          {item.product.brand}
                        </span>
                        <h3
                          onClick={() => navigate('product', { slug: item.product.slug })}
                          className="text-xs sm:text-sm font-semibold text-brand-charcoal hover:text-brand-primary cursor-pointer truncate max-w-xs transition-colors"
                        >
                          {item.product.name}
                        </h3>
                        {item.selectedPackSize && (
                          <span className="text-[11px] text-brand-muted block mt-0.5">
                            Option: {item.selectedPackSize}
                          </span>
                        )}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] text-brand-subtle hover:text-red-600 inline-flex items-center gap-1 mt-1.5 transition-colors"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="sm:col-span-2 text-left sm:text-center text-xs font-semibold text-brand-charcoal">
                      <span className="sm:hidden text-brand-muted mr-2 font-normal">Price:</span>
                      £{item.product.price.toFixed(2)}
                    </div>

                    {/* Stepper */}
                    <div className="sm:col-span-2 flex sm:justify-center items-center">
                      <div className="flex items-center border border-brand-border rounded-brand bg-white h-8 shadow-subtle">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center text-xs font-bold text-brand-muted hover:text-brand-charcoal"
                          aria-label="Decrease"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-brand-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-xs font-bold text-brand-muted hover:text-brand-charcoal"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="sm:col-span-2 text-left sm:text-right font-display font-bold text-sm text-brand-dark">
                      <span className="sm:hidden text-brand-muted mr-2 font-normal text-xs font-sans">Line Subtotal:</span>
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => navigate('shop')}
                  className="text-xs font-semibold text-brand-charcoal hover:text-brand-primary inline-flex items-center gap-1.5"
                >
                  <ChevronLeft size={16} /> Continue Shopping
                </button>

                <button
                  onClick={clearCart}
                  className="text-xs text-brand-subtle hover:text-red-600 transition-colors"
                >
                  Clear Shopping Basket
                </button>
              </div>

              {/* Order note for dispensary */}
              <div className="bg-white p-5 rounded-brand-lg border border-brand-border space-y-2">
                <label className="block text-xs font-semibold text-brand-charcoal">
                  Delivery instructions / Special note for our UK dispensary team:
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Leave with neighbour at No. 14 if out, or gate access code..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full text-xs p-3 border border-brand-border rounded-brand focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Order Summary Column (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-brand-xl border border-brand-border p-6 shadow-subtle space-y-6">
              <h2 className="font-display font-bold text-lg text-brand-dark pb-3 border-b border-brand-border">
                Order Summary
              </h2>

              {/* Promo Code input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-brand border border-emerald-200">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag size={14} /> Coupon <strong>{appliedPromo}</strong> applied (-{Math.round(discountRate * 100)}%)
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-xs underline hover:text-emerald-950 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code (try WELLBEING10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 text-xs border border-brand-border rounded-brand px-3 py-2.5 focus:outline-none focus:border-brand-primary uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-brand-surface hover:bg-brand-light text-brand-dark border border-brand-border text-xs font-semibold px-4 py-2.5 rounded-brand transition-colors"
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

              {/* Line item breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brand-charcoal">
                    £{cartSubtotal.toFixed(2)}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Promotion Discount ({Math.round(discountRate * 100)}%)</span>
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

                <div className="flex justify-between text-brand-muted text-[11px]">
                  <span>Estimated UK VAT (included)</span>
                  <span>£{((total * 20) / 120).toFixed(2)}</span>
                </div>

                <div className="pt-3 border-t border-brand-border flex justify-between text-base font-bold text-brand-dark font-display">
                  <span>Total Due</span>
                  <span className="text-lg text-brand-primary">
                    £{total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => navigate('checkout')}
                className="w-full bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs py-4 px-4 rounded-brand shadow-card hover:shadow-card-hover transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to UK Checkout</span>
                <ArrowRight size={15} />
              </button>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-brand-border space-y-2 text-[11px] text-brand-subtle">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-brand-primary" />
                  <span>256-bit SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-brand-primary" />
                  <span>Dispatched with Royal Mail Tracked delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
