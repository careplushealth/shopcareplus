import React from 'react';
import { ArrowRight, ShieldCheck, HeartHandshake, Award, Building2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const BrandQualityStory: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
              Our Commitment
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-display text-brand-charcoal leading-tight">
              Everyday Health Essentials, <br />
              <span className="text-brand-dark italic font-normal">Made Easier</span>
            </h2>

            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              CarePlus Health Shop brings together a thoughtfully organised range of healthcare, personal care, and wellbeing products to help make everyday shopping simpler. Backed by established North West UK pharmacy roots, we believe access to dependable health products should be uncomplicated, transparent, and prompt.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-brand-lg border border-brand-border bg-brand-surface/40 space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center mb-2">
                  <Building2 size={16} />
                </div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                  UK Pharmacy Heritage
                </h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Operated in alignment with licensed UK retail pharmacy standards and practices.
                </p>
              </div>

              <div className="p-4 rounded-brand-lg border border-brand-border bg-brand-surface/40 space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center mb-2">
                  <ShieldCheck size={16} />
                </div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                  Authentic Brands Only
                </h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Every batch sourced directly from authorized UK distributors with verified batch tracings.
                </p>
              </div>

              <div className="p-4 rounded-brand-lg border border-brand-border bg-brand-surface/40 space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center mb-2">
                  <Award size={16} />
                </div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                  CarePlus Approved Range
                </h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  Our own formulations deliver maximum potency, pure ingredients, and sensible British value.
                </p>
              </div>

              <div className="p-4 rounded-brand-lg border border-brand-border bg-brand-surface/40 space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center mb-2">
                  <HeartHandshake size={16} />
                </div>
                <h4 className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                  Human UK Support
                </h4>
                <p className="text-xs text-brand-muted leading-relaxed">
                  No automated chatbots when you need genuine advice regarding your orders or returns.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('about')}
                className="bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-brand transition-colors inline-flex items-center gap-2"
              >
                <span>Discover CarePlus</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Right Image Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-brand-xl overflow-hidden shadow-card border border-brand-border aspect-[4/5] bg-brand-surface">
              <img
                src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1000&auto=format&fit=crop"
                alt="CarePlus healthcare pharmacy dispensary standards"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-brand border border-brand-border">
                <p className="text-xs font-bold text-brand-charcoal">
                  Serving UK communities with care & precision
                </p>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  Part of the regional pharmacy network serving thousands of customers monthly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
