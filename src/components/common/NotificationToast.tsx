import React from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const NotificationToast: React.FC = () => {
  const { notification, dismissNotification, setIsCartOpen } = useShop();

  if (!notification) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] bg-white rounded-brand-lg shadow-dropdown border border-brand-border p-4 transition-all duration-300 transform translate-y-0 opacity-100 flex items-start gap-3.5"
    >
      <div className="shrink-0 mt-0.5">
        {notification.type === 'cart' ? (
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-brand-primary flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center">
            <ShoppingBag size={18} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-charcoal">
          {notification.message}
        </p>
        {notification.productName && (
          <p className="text-xs text-brand-muted truncate mt-0.5">
            {notification.productName}
          </p>
        )}
        {notification.type === 'cart' && (
          <button
            onClick={() => {
              setIsCartOpen(true);
              dismissNotification();
            }}
            className="text-xs font-semibold text-brand-primary hover:text-brand-hover underline mt-1.5 inline-block"
          >
            View Basket & Checkout &rarr;
          </button>
        )}
      </div>

      <button
        onClick={dismissNotification}
        className="text-brand-subtle hover:text-brand-charcoal p-1 rounded-md transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
