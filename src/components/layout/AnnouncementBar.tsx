import React, { useState } from 'react';
import { Truck, ShieldCheck, Phone, ChevronRight, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AnnouncementBar: React.FC = () => {
  const { navigate } = useShop();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-brand-dark text-white text-xs border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
        {/* Left message: UK Dispatch info */}
        <div className="hidden md:flex items-center gap-4 text-emerald-100/90 text-[11.5px]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <strong className="text-white">UK Registered Healthcare Provider</strong>
          </span>
          <span className="text-white/30">•</span>
          <span className="flex items-center gap-1.5">
            <Truck size={13} className="text-brand-gold" />
            Free UK Tracked Delivery Over £35
          </span>
        </div>

        {/* Center message on mobile & desktop */}
        <div className="flex-1 md:flex-initial text-center">
          <button
            onClick={() => navigate('shop')}
            className="group inline-flex items-center gap-1.5 font-medium text-emerald-50 hover:text-white transition-colors"
          >
            <span>Your everyday essentials for better wellbeing</span>
            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Right message: Help / Customer Service */}
        <div className="hidden lg:flex items-center gap-4 text-emerald-100/90 text-[11.5px]">
          <button
            onClick={() => navigate('contact')}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone size={12} className="text-brand-gold" />
            <span>Mon–Fri 9am–5:30pm UK</span>
          </button>
          <span className="text-white/30">•</span>
          <button
            onClick={() => navigate('delivery-returns')}
            className="hover:text-white transition-colors"
          >
            Delivery & Returns
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-white/60 hover:text-white p-0.5 ml-2"
            aria-label="Dismiss banner"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
