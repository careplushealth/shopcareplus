import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, Home, ShoppingBag, Heart, Phone, HelpCircle, ShieldCheck, User, Package } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { navigate, wishlistCount, cartCount, setIsAccountModalOpen } = useShop();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const handleNavigate = (path: string, params?: Record<string, string>) => {
    onClose();
    navigate(path, params);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-brand-charcoal/50 backdrop-blur-sm lg:hidden animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      <div
        className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-drawer flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/50">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-subtle hover:text-brand-charcoal"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Links Strip */}
        <div className="grid grid-cols-3 divide-x divide-brand-border border-b border-brand-border bg-brand-light/30 text-center py-2 text-xs">
          <button
            onClick={() => handleNavigate('home')}
            className="flex flex-col items-center gap-1 text-brand-charcoal hover:text-brand-primary"
          >
            <Home size={16} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button
            onClick={() => handleNavigate('wishlist')}
            className="flex flex-col items-center gap-1 text-brand-charcoal hover:text-brand-primary"
          >
            <div className="relative">
              <Heart size={16} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">Saved ({wishlistCount})</span>
          </button>
          <button
            onClick={() => handleNavigate('shop')}
            className="flex flex-col items-center gap-1 text-brand-charcoal hover:text-brand-primary"
          >
            <ShoppingBag size={16} />
            <span className="text-[10px] font-semibold">All Items</span>
          </button>
        </div>

        {/* Account & Tracking Shortcut */}
        <div className="p-3 bg-brand-surface/70 border-b border-brand-border">
          <button
            onClick={() => {
              onClose();
              setIsAccountModalOpen(true);
            }}
            className="w-full bg-white hover:bg-brand-surface text-brand-charcoal text-xs font-semibold py-2 px-3 rounded-brand border border-brand-border flex items-center justify-between transition-colors shadow-subtle"
          >
            <span className="flex items-center gap-2">
              <Package size={15} className="text-brand-primary" />
              <span>Track Order / My Details</span>
            </span>
            <span className="text-[10px] text-brand-muted">&rarr;</span>
          </button>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-brand-muted px-2 mb-2">
            Browse Categories
          </p>

          <button
            onClick={() => handleNavigate('shop')}
            className="w-full text-left font-semibold text-xs py-2.5 px-3 rounded-brand hover:bg-brand-surface text-brand-charcoal flex items-center justify-between"
          >
            <span>Shop All Products</span>
            <ChevronRight size={14} className="text-brand-subtle" />
          </button>

          {CATEGORIES.map((cat) => {
            const isExpanded = expandedCategory === cat.id;
            return (
              <div key={cat.id} className="border-b border-brand-borderLight last:border-0 pb-1">
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full text-left font-semibold text-xs py-2.5 px-3 rounded-brand hover:bg-brand-surface text-brand-charcoal flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <ChevronDown
                    size={14}
                    className={`text-brand-muted transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="pl-4 pr-2 pb-2 space-y-1 bg-brand-surface/40 rounded-brand my-1">
                    <button
                      onClick={() => handleNavigate('shop', { category: cat.name })}
                      className="w-full text-left text-xs font-bold text-brand-primary py-1.5 px-2 hover:underline"
                    >
                      All in {cat.name} &rarr;
                    </button>
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() =>
                          handleNavigate('shop', {
                            category: cat.name,
                            subcategory: sub,
                          })
                        }
                        className="w-full text-left text-xs py-1.5 px-2 rounded text-brand-muted hover:text-brand-dark hover:bg-white"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={() => handleNavigate('shop', { onSale: 'true' })}
            className="w-full text-left font-bold text-xs py-2.5 px-3 rounded-brand text-brand-sale hover:bg-brand-saleBg flex items-center justify-between mt-2"
          >
            <span>Special Offers & Bundles</span>
            <span className="text-[10px] bg-brand-sale text-white px-2 py-0.5 rounded-full">
              Save
            </span>
          </button>

          {/* Help & Information links */}
          <div className="pt-4 mt-4 border-t border-brand-border space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-brand-muted px-2 mb-2">
              Customer Support
            </p>
            <button
              onClick={() => handleNavigate('about')}
              className="w-full text-left text-xs py-2 px-3 text-brand-charcoal hover:text-brand-primary flex items-center gap-2"
            >
              <ShieldCheck size={14} className="text-brand-primary" />
              <span>About CarePlus</span>
            </button>
            <button
              onClick={() => handleNavigate('delivery-returns')}
              className="w-full text-left text-xs py-2 px-3 text-brand-charcoal hover:text-brand-primary flex items-center gap-2"
            >
              <HelpCircle size={14} className="text-brand-primary" />
              <span>Delivery & Returns</span>
            </button>
            <button
              onClick={() => handleNavigate('faqs')}
              className="w-full text-left text-xs py-2 px-3 text-brand-charcoal hover:text-brand-primary flex items-center gap-2"
            >
              <HelpCircle size={14} className="text-brand-primary" />
              <span>FAQs</span>
            </button>
            <button
              onClick={() => handleNavigate('contact')}
              className="w-full text-left text-xs py-2 px-3 text-brand-charcoal hover:text-brand-primary flex items-center gap-2"
            >
              <Phone size={14} className="text-brand-primary" />
              <span>Contact Our UK Team</span>
            </button>
          </div>
        </div>

        {/* Mobile footer notice */}
        <div className="p-4 border-t border-brand-border bg-brand-surface/70 text-[11px] text-brand-muted text-center">
          <p className="font-semibold text-brand-charcoal">UK Registered Pharmacy Services</p>
          <p className="mt-0.5">Free UK Tracked Delivery over £35</p>
        </div>
      </div>
    </div>
  );
};
