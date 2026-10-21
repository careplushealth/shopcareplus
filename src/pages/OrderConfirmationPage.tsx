import React from 'react';
import { CheckCircle2, Package, Truck, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrderConfirmationData } from '../types';
import { useShop } from '../context/ShopContext';

interface OrderConfirmationPageProps {
  orderData: OrderConfirmationData | null;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderData }) => {
  const { navigate } = useShop();

  if (!orderData) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <h2 className="text-xl font-bold font-display text-brand-charcoal mb-2">
          No Recent Order Found
        </h2>
        <p className="text-xs text-brand-muted mb-6">
          You don&rsquo;t have an active order confirmation session.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="bg-brand-dark text-white text-xs px-6 py-3 rounded-brand font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 bg-brand-offwhite min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Card */}
        <div className="bg-white rounded-brand-xl p-8 sm:p-12 border border-brand-border shadow-subtle text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-primary flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
            Order Confirmed
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold font-display text-brand-charcoal">
            Thank You for Your Order!
          </h1>

          <p className="text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            Your order reference is <strong className="text-brand-dark font-bold">{orderData.orderNumber}</strong>. We have sent a detailed confirmation to <strong className="text-brand-dark">{orderData.customer.email}</strong>.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-brand-surface hover:bg-brand-light text-brand-charcoal border border-brand-border text-xs font-semibold px-5 py-2.5 rounded-brand transition-colors inline-flex items-center gap-1.5"
            >
              <Printer size={14} /> Print Receipt
            </button>

            <button
              onClick={() => navigate('shop')}
              className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-6 py-2.5 rounded-brand transition-colors inline-flex items-center gap-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="mt-8 bg-white rounded-brand-xl p-6 sm:p-8 border border-brand-border shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border gap-2">
            <div>
              <p className="text-xs text-brand-muted">Order Placed On:</p>
              <p className="text-sm font-bold text-brand-charcoal">{orderData.orderDate}</p>
            </div>
            <div>
              <p className="text-xs text-brand-muted">Estimated Delivery:</p>
              <p className="text-sm font-bold text-brand-primary flex items-center gap-1.5">
                <Truck size={15} /> {orderData.estimatedDelivery}
              </p>
            </div>
          </div>

          {/* Delivery & Payment details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-brand-surface/40 rounded-brand border border-brand-border/60">
              <h4 className="font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                Delivery Address:
              </h4>
              <p className="font-semibold text-brand-charcoal">
                {orderData.customer.firstName} {orderData.customer.lastName}
              </p>
              <p className="text-brand-muted mt-0.5">{orderData.customer.addressLine1}</p>
              {orderData.customer.addressLine2 && (
                <p className="text-brand-muted">{orderData.customer.addressLine2}</p>
              )}
              <p className="text-brand-muted">
                {orderData.customer.city}{orderData.customer.county ? `, ${orderData.customer.county}` : ''}
              </p>
              <p className="text-brand-charcoal font-semibold mt-1">
                {orderData.customer.postcode}
              </p>
              <p className="text-brand-muted">{orderData.customer.country}</p>
            </div>

            <div className="p-4 bg-brand-surface/40 rounded-brand border border-brand-border/60 space-y-2">
              <h4 className="font-bold text-brand-charcoal uppercase tracking-wider mb-2">
                Shipping & Payment:
              </h4>
              <p className="text-brand-charcoal">
                <strong>Method:</strong> {orderData.deliveryMethodName}
              </p>
              <p className="text-brand-charcoal">
                <strong>Payment:</strong>{' '}
                {orderData.paymentIntentId
                  ? `Stripe Payment (Ref: ${orderData.paymentIntentId})`
                  : 'Stripe Card / Online Payment'}
              </p>
              <p className="text-brand-charcoal">
                <strong>Packaging:</strong> Plain discreet UK dispensary mailer
              </p>
              <div className="pt-2 text-emerald-800 text-[11px] flex items-center gap-1 font-medium">
                <ShieldCheck size={14} className="text-brand-primary" />
                <span>Tracked UK fulfillment</span>
              </div>
            </div>
          </div>

          {/* Itemized List */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-brand-charcoal mb-3">
              Items in this Delivery ({orderData.items.length})
            </h4>
            <div className="divide-y divide-brand-borderLight border border-brand-border rounded-brand overflow-hidden">
              {orderData.items.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-contain bg-brand-surface p-1 rounded mix-blend-multiply"
                    />
                    <div>
                      <p className="font-semibold text-brand-charcoal">{item.product.name}</p>
                      <p className="text-[11px] text-brand-muted">
                        Qty: {item.quantity} {item.selectedPackSize ? `• ${item.selectedPackSize}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold font-display text-brand-dark">
                    £{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-brand-border space-y-2 text-xs text-right max-w-xs ml-auto">
            <div className="flex justify-between text-brand-muted">
              <span>Subtotal:</span>
              <span className="font-semibold text-brand-charcoal">£{orderData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-brand-muted">
              <span>UK Delivery:</span>
              <span className="font-semibold text-brand-charcoal">
                {orderData.shipping === 0 ? 'FREE' : `£${orderData.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-brand-muted text-[11px]">
              <span>UK VAT (Included):</span>
              <span>£{((orderData.total * 20) / 120).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-brand-dark font-display pt-2 border-t border-brand-border">
              <span>Total Paid:</span>
              <span className="text-base text-brand-primary">£{orderData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
