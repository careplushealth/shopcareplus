import React from 'react';
import { ShieldCheck, HeartHandshake, Award, Building2, Truck, Users, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useShop } from '../context/ShopContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useShop();

  return (
    <div className="py-8 bg-brand-offwhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'About CarePlus Health' }]} />

        {/* Hero Section */}
        <div className="bg-white rounded-brand-xl p-8 sm:p-14 border border-brand-border shadow-subtle my-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
              Our Story & Heritage
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-brand-charcoal leading-tight">
              Rooted in UK Community Pharmacy. Designed for Modern Living.
            </h1>
            <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
              CarePlus Health Shop is part of a dedicated regional pharmacy group serving communities across the North West of England. We established this digital store to provide households throughout Great Britain and Northern Ireland with straightforward access to verified healthcare remedies, vitamins, and everyday living essentials.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-brand-lg overflow-hidden border border-brand-border shadow-card aspect-[4/3] bg-brand-surface">
              <img
                src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop"
                alt="CarePlus healthcare dispensary team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="my-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
              Our Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-charcoal mt-1">
              What Defines CarePlus
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-brand-xl border border-brand-border shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-brand bg-brand-light text-brand-dark flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display font-bold text-base text-brand-charcoal">
                Strict UK Sourcing
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                We work directly with MHRA-regulated UK distributors and pharmaceutical manufacturers. Every item is verified for safety, batch integrity, and genuine formulation.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-brand-xl border border-brand-border shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-brand bg-brand-light text-brand-dark flex items-center justify-center">
                <HeartHandshake size={24} />
              </div>
              <h3 className="font-display font-bold text-base text-brand-charcoal">
                Honest, Transparent Guidance
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                We believe in realistic wellbeing. We never make unsupported miracle cure claims or publish misleading discounts. Product information is clear, factual, and medically responsible.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-brand-xl border border-brand-border shadow-subtle space-y-3">
              <div className="w-12 h-12 rounded-brand bg-brand-light text-brand-dark flex items-center justify-center">
                <Truck size={24} />
              </div>
              <h3 className="font-display font-bold text-base text-brand-charcoal">
                Prompt UK Delivery
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Dispatched with Royal Mail Tracked delivery in discreet, eco-conscious packaging. Orders placed by 3:00pm Monday to Friday are prepared and dispatched the very same day.
              </p>
            </div>
          </div>
        </div>

        {/* Pharmacy Network Section */}
        <div className="bg-brand-dark text-white rounded-brand-xl p-8 sm:p-12 my-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-gold">
              Community Health Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Connected to Local Healthcare
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Operating alongside physical community chemists across Greater Manchester, Lancashire, and Cheshire, we combine local pharmacy warmth with the speed and convenience of online retail.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('contact')}
                className="bg-brand-gold hover:bg-amber-600 text-brand-dark font-bold text-xs px-6 py-3 rounded-brand transition-colors inline-flex items-center gap-2"
              >
                <span>Get in Touch With Our Team</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
