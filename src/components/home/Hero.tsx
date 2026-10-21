import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Hero: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section className="relative bg-gradient-to-b from-brand-surface via-brand-offwhite to-white overflow-hidden py-12 md:py-20 border-b border-brand-border/60">
      {/* Subtle organic decorative background circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-light/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-goldLight/50 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-brand-border shadow-subtle text-xs font-semibold text-brand-dark">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
              </span>
              <span>Trusted Everyday UK Health & Wellness</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-brand-charcoal tracking-tight leading-[1.12]">
              Your Health. <br />
              <span className="text-brand-dark italic font-normal">Our Priority.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-brand-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover everyday health essentials, trusted healthcare products, and wellbeing favourites — all in one place. Handpicked for quality, safety, and everyday peace of mind.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => navigate('shop')}
                className="w-full sm:w-auto bg-brand-dark hover:bg-brand-primary text-white font-semibold text-sm px-8 py-4 rounded-brand shadow-card hover:shadow-card-hover transition-all flex items-center justify-center gap-2 group"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('browse-categories');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('shop');
                  }
                }}
                className="w-full sm:w-auto bg-white hover:bg-brand-surface text-brand-charcoal hover:text-brand-dark font-semibold text-sm px-6 py-4 rounded-brand border border-brand-border transition-colors text-center"
              >
                Explore Categories
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 border-t border-brand-border/60 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-brand-primary shrink-0 mt-0.5" />
                <span className="text-xs text-brand-charcoal font-medium">100% Genuine UK Sourced</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck size={16} className="text-brand-primary shrink-0 mt-0.5" />
                <span className="text-xs text-brand-charcoal font-medium">Free Delivery Over £35</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck size={16} className="text-brand-primary shrink-0 mt-0.5" />
                <span className="text-xs text-brand-charcoal font-medium">Pharmacy Registered</span>
              </div>
            </div>
          </div>

          {/* Right Image Composition (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Lifestyle Hero Photo */}
              <div className="relative rounded-brand-xl overflow-hidden shadow-card border border-brand-border/80 aspect-[4/5] bg-brand-surface">
                <img
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop"
                  alt="CarePlus Health and wellbeing essentials"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Floating caption on hero image */}
                <div className="absolute bottom-5 left-5 right-5 text-white p-4 rounded-brand bg-brand-dark/80 backdrop-blur-md border border-white/20">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-gold">
                    CarePlus Curated
                  </p>
                  <p className="text-sm font-semibold font-display">
                    Scientifically backed vitamins & daily wellness
                  </p>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-brand-lg shadow-dropdown border border-brand-border max-w-[210px] hidden sm:block">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {'★★★★★'}
                </div>
                <p className="text-xs font-bold text-brand-charcoal">
                  &ldquo;Fast UK delivery & exceptional service!&rdquo;
                </p>
                <p className="text-[10px] text-brand-muted mt-0.5">
                  Verified UK Customer
                </p>
              </div>

              {/* Floating Free UK Delivery badge */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white py-2.5 px-4 rounded-brand-lg shadow-dropdown border border-brand-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                  <Truck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-charcoal">Free Tracked UK Delivery</p>
                  <p className="text-[10px] text-brand-muted">On all orders over £35</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
