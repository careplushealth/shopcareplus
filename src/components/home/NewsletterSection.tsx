import React, { useState } from 'react';
import { Mail, CheckCircle2, Shield, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { api } from '../../services/api';

export const NewsletterSection: React.FC = () => {
  const { navigate } = useShop();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid UK email address.');
      return;
    }

    setIsSubmitted(true);
    api.subscribeNewsletter(email).catch(() => {});
  };

  return (
    <section className="py-16 sm:py-20 bg-brand-surface/70 border-b border-brand-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-light text-brand-primary flex items-center justify-center mx-auto mb-4">
          <Mail size={22} />
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-brand-charcoal">
          Stay in the Know
        </h2>

        <p className="text-xs sm:text-sm text-brand-muted max-w-lg mx-auto mt-2 leading-relaxed">
          Get product updates, useful shopping news, and occasional offers from CarePlus. No spam, ever.
        </p>

        {isSubmitted ? (
          <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-brand-lg p-6 max-w-md mx-auto text-emerald-900 animate-fadeIn">
            <CheckCircle2 size={28} className="text-brand-primary mx-auto mb-2" />
            <h3 className="text-sm font-bold">Thank you for subscribing!</h3>
            <p className="text-xs text-emerald-800 mt-1">
              We&rsquo;ve sent a welcome confirmation to <strong>{email}</strong> with your 10% welcome coupon.
            </p>
            <p className="text-[10px] text-emerald-700/80 mt-2">
              (Prototype demo: In production this connects directly to our UK email provider).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border border-brand-border text-brand-charcoal text-xs sm:text-sm px-4 py-3 rounded-brand focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary shadow-subtle"
                required
              />
              <button
                type="submit"
                className="bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-brand shadow-sm transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {error && <p className="text-xs text-red-600 text-left">{error}</p>}

            <p className="text-[11px] text-brand-subtle flex items-center justify-center gap-1.5 pt-1">
              <Shield size={12} className="text-brand-primary shrink-0" />
              <span>
                We respect your privacy. Unsubscribe anytime. View our{' '}
                <button
                  type="button"
                  onClick={() => navigate('privacy')}
                  className="text-brand-charcoal underline hover:text-brand-primary"
                >
                  Privacy Policy
                </button>
                .
              </span>
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
