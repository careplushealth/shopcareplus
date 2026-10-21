import React from 'react';
import { ShieldCheck, Truck, Clock, Lock, ArrowRight, Heart } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';

export const Footer: React.FC = () => {
  const { navigate, setIsAccountModalOpen } = useShop();

  return (
    <footer className="bg-brand-dark text-white border-t border-brand-hover/40 pt-16 pb-12">
      {/* Trust Badges Strip inside Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-white/10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-gold">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">UK Tracked Delivery</h4>
              <p className="text-xs text-emerald-100/70 mt-1">
                Free on orders over £35. Dispatched promptly via Royal Mail.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-gold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Authentic Healthcare</h4>
              <p className="text-xs text-emerald-100/70 mt-1">
                100% genuine UK-sourced products from verified manufacturers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-gold">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Dedicated Support</h4>
              <p className="text-xs text-emerald-100/70 mt-1">
                UK customer care team available Monday to Friday 9am–5:30pm.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-gold">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Secure UK Checkout</h4>
              <p className="text-xs text-emerald-100/70 mt-1">
                256-bit encryption ensuring strict protection of your details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-sm">
              CarePlus Health Shop is dedicated to bringing you verified vitamins, supplements, everyday healthcare remedies, and mobility aids. Rooted in trusted North West pharmacy standards, we make everyday wellbeing shopping straightforward, reliable, and accessible.
            </p>
            <div className="pt-2 text-xs text-emerald-100/60 space-y-1">
              <p>📍 Operating with UK Registered Pharmacy partners across the North West.</p>
              <p>🇬🇧 Currency: British Pounds (GBP £) • All prices include UK VAT.</p>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-brand-gold mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={() => navigate('shop')}
                  className="hover:text-white transition-colors"
                >
                  Shop All Products
                </button>
              </li>
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate('shop', { category: cat.name })}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('shop', { onSale: 'true' })}
                  className="text-amber-300 hover:text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Special Offers & Bundles</span>
                  <ArrowRight size={11} />
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-brand-gold mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className="hover:text-white transition-colors flex items-center gap-1 text-emerald-200 font-semibold"
                >
                  <span>Track My Order &amp; Account</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('delivery-returns')}
                  className="hover:text-white transition-colors"
                >
                  Delivery & Returns Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('faqs')}
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact Our UK Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About CarePlus Health
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('wishlist')}
                  className="hover:text-white transition-colors"
                >
                  My Saved Items
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-brand-gold mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={() => navigate('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy & Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions of Sale
                </button>
              </li>
              <li>
                <span className="text-emerald-100/50 block">
                  General Pharmaceutical Council (GPhC) Standards
                </span>
              </li>
              <li>
                <span className="text-emerald-100/50 block">
                  MHRA Consumer Healthcare Guidance
                </span>
              </li>
              <li>
                <button
                  onClick={() => navigate('admin')}
                  className="hover:text-brand-gold text-emerald-200/90 font-medium transition-colors flex items-center gap-1.5 pt-2 border-t border-emerald-800/60 mt-1"
                >
                  <Lock size={12} className="text-brand-gold" />
                  <span>Pharmacy Staff Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-100/70">
          <div className="flex flex-wrap items-center gap-2">
            <p>
              &copy; {new Date().getFullYear()} CarePlus Health Shop. All rights reserved. Developed to UK healthcare & retail standards.
            </p>
            <span className="text-emerald-100/30">&bull;</span>
            <button
              onClick={() => navigate('admin')}
              className="text-emerald-300/80 hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1"
            >
              <Lock size={10} />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Supported UK Payment Method Pills */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-100/60 mr-1">Accepted Payment:</span>
            <div className="flex items-center gap-1.5">
              {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
                <span
                  key={method}
                  className="bg-white/10 text-white font-medium text-[10px] px-2 py-1 rounded border border-white/10 tracking-tight"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
