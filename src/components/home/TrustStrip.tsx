import React from 'react';
import { CheckCircle2, ShoppingBag, ShieldCheck, HeartHandshake } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const benefits = [
    {
      icon: CheckCircle2,
      title: 'Quality Products',
      description: 'Carefully sourced formulations and trusted British healthcare brands.',
    },
    {
      icon: ShoppingBag,
      title: 'Convenient Online Shopping',
      description: 'Straightforward browsing, transparent pricing, and fast UK dispatch.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Checkout',
      description: 'Encrypted payment processing adhering to UK consumer standards.',
    },
    {
      icon: HeartHandshake,
      title: 'Friendly Customer Support',
      description: 'Our UK-based support team is here to assist Monday to Friday.',
    },
  ];

  return (
    <section className="bg-white border-b border-brand-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="flex items-start gap-4 p-2">
                <div className="w-11 h-11 rounded-brand bg-brand-light/70 text-brand-primary flex items-center justify-center shrink-0 border border-brand-border/40">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-charcoal font-sans">
                    {b.title}
                  </h3>
                  <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
