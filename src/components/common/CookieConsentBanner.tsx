import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const CookieConsentBanner: React.FC = () => {
  const { navigate } = useShop();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('careplus_cookie_consent');
      if (!consent) {
        // Show after a brief delay so page loads cleanly
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  if (!isVisible) return null;

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('careplus_cookie_consent', 'all');
    } catch {}
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('careplus_cookie_consent', 'essential');
    } catch {}
    setIsVisible(false);
  };

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-brand-border shadow-2xl animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Content */}
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-10 h-10 rounded-full bg-brand-light text-brand-dark flex items-center justify-center shrink-0 mt-0.5">
            <Cookie size={20} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-brand-primary">
                UK GDPR &amp; Privacy Standards
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">
                CarePlus Chemist
              </span>
            </div>
            <p className="text-xs text-brand-charcoal leading-relaxed">
              We use essential cookies to maintain your shopping basket state and ensure secure checkout. With your consent, we also use analytical cookies to help improve our healthcare and wellbeing catalogue.{' '}
              <button
                onClick={() => navigate('privacy')}
                className="text-brand-primary underline hover:text-brand-dark font-medium"
              >
                Read our Privacy &amp; Cookie Policy
              </button>
              .
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
          <button
            onClick={handleAcceptEssential}
            className="flex-1 sm:flex-initial text-xs font-semibold text-brand-charcoal hover:bg-brand-surface px-4 py-2.5 rounded-brand border border-brand-border transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-initial text-xs font-semibold text-white bg-brand-dark hover:bg-brand-primary px-5 py-2.5 rounded-brand shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Check size={14} />
            <span>Accept All</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
