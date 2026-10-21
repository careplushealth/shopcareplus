import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const EditorialPromo: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section className="py-14 sm:py-20 bg-brand-dark text-white relative overflow-hidden">
      {/* Background soft blur accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-900/30 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Visual (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-brand-xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1512290900672-1f55b9381734?q=80&w=1000&auto=format&fit=crop"
                alt="CarePlus daily wellness routine"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              
              {/* Floating quote badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-brand-dark/85 backdrop-blur-md p-3.5 rounded-brand border border-white/15">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1.5">
                  <Sparkles size={12} /> Mindful Self-Care
                </p>
                <p className="text-xs text-white/95 mt-0.5">
                  Pure botanicals, magnesium transdermals, and soothing sleep rituals.
                </p>
              </div>
            </div>
          </div>

          {/* Copy & CTAs (7 cols) */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-emerald-200">
              <Sparkles size={13} className="text-brand-gold" />
              <span>Routine & Vitality</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight leading-tight">
              Small Steps. <br />
              <span className="text-brand-gold italic font-normal">Better Wellbeing.</span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Explore everyday essentials designed to support your personal care and wellness routine. From certified magnesium recovery sprays to natural pillow mists, discover mindful self-care rituals that fit seamlessly into busy modern life.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/90 bg-white/5 p-3 rounded-brand border border-white/10">
                <CheckCircle2 size={16} className="text-brand-gold shrink-0" />
                <span>Therapeutic natural botanicals</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-emerald-100/90 bg-white/5 p-3 rounded-brand border border-white/10">
                <CheckCircle2 size={16} className="text-brand-gold shrink-0" />
                <span>Zero synthetic animal derivatives</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('shop', { category: 'Health & Wellness' })}
                className="bg-brand-gold hover:bg-amber-600 text-brand-dark font-bold text-xs sm:text-sm px-8 py-3.5 rounded-brand shadow-card transition-colors inline-flex items-center gap-2"
              >
                <span>Explore Wellness</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
