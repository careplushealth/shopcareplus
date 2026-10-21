import React, { useState } from 'react';
import { Product } from '../../types';
import { CheckCircle2, AlertTriangle, Truck, RotateCcw, FileText, Sparkles } from 'lucide-react';

interface ProductTabsProps {
  product: Product;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ingredients' | 'usage' | 'warnings' | 'delivery'>('overview');

  return (
    <div className="mt-12 sm:mt-16 bg-white rounded-brand-xl border border-brand-border shadow-subtle overflow-hidden">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-brand-border bg-brand-surface/40 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-4 px-6 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'overview'
              ? 'border-brand-primary text-brand-primary bg-white'
              : 'border-transparent text-brand-muted hover:text-brand-charcoal'
          }`}
        >
          Overview & Benefits
        </button>

        {product.ingredients && (
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`py-4 px-6 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'ingredients'
                ? 'border-brand-primary text-brand-primary bg-white'
                : 'border-transparent text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            Ingredients & Specs
          </button>
        )}

        {product.dosageUsage && (
          <button
            onClick={() => setActiveTab('usage')}
            className={`py-4 px-6 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'usage'
                ? 'border-brand-primary text-brand-primary bg-white'
                : 'border-transparent text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            Directions & Dosage
          </button>
        )}

        {product.warnings && (
          <button
            onClick={() => setActiveTab('warnings')}
            className={`py-4 px-6 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'warnings'
                ? 'border-brand-primary text-brand-primary bg-white'
                : 'border-transparent text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            Safety & Warnings
          </button>
        )}

        <button
          onClick={() => setActiveTab('delivery')}
          className={`py-4 px-6 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
            activeTab === 'delivery'
              ? 'border-brand-primary text-brand-primary bg-white'
              : 'border-transparent text-brand-muted hover:text-brand-charcoal'
          }`}
        >
          Delivery & UK Returns
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-charcoal mb-3">
                About {product.name}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-brand-charcoal mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-brand-gold" /> Key Formulation Highlights
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.keyFeatures.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-brand-charcoal bg-brand-surface/50 p-3 rounded-brand border border-brand-border/40">
                      <CheckCircle2 size={16} className="text-brand-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.dietaryTags && product.dietaryTags.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-brand-muted mr-2">Certifications & Diets:</span>
                <div className="inline-flex flex-wrap gap-1.5 mt-1">
                  {product.dietaryTags.map((tag) => (
                    <span key={tag} className="text-[11px] bg-brand-light text-brand-dark px-2.5 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ingredients */}
        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-brand-charcoal">
              Full Ingredient List & Specifications
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed bg-brand-surface/60 p-4 rounded-brand border border-brand-border/60">
              {product.ingredients}
            </p>
            <p className="text-xs text-brand-subtle">
              CarePlus Health Shop ensures all ingredients meet strict UK cosmetic and nutritional standards. If you suffer from severe allergies, always cross-reference the manufacturer’s product carton.
            </p>
          </div>
        )}

        {/* Usage */}
        {activeTab === 'usage' && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-brand-charcoal flex items-center gap-2">
              <FileText size={18} className="text-brand-primary" /> Recommended Usage & Guidelines
            </h3>
            <div className="text-sm text-brand-charcoal leading-relaxed bg-brand-surface/60 p-5 rounded-brand border border-brand-border/60">
              {product.dosageUsage}
            </div>
            <p className="text-xs text-brand-muted">
              Do not exceed the stated dose. Keep in a cool, dry place away from direct sunlight.
            </p>
          </div>
        )}

        {/* Warnings */}
        {activeTab === 'warnings' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-sale">
              <AlertTriangle size={20} />
              <h3 className="font-display font-bold text-lg text-brand-charcoal">
                Safety Notes & Cautions
              </h3>
            </div>
            <div className="text-sm text-brand-charcoal leading-relaxed bg-amber-50/50 p-5 rounded-brand border border-amber-200/60">
              {product.warnings}
            </div>
            <p className="text-xs text-brand-subtle">
              MHRA Notice: Food supplements should not be used as a substitute for a balanced diet and healthy lifestyle. Always keep medication and sharp aids out of reach of young children.
            </p>
          </div>
        )}

        {/* Delivery & Returns */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <h3 className="font-display font-bold text-lg text-brand-charcoal">
              UK Delivery & Return Guarantee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-brand border border-brand-border bg-brand-surface/40 space-y-2">
                <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-wider">
                  <Truck size={16} /> UK Shipping Rates
                </div>
                <ul className="text-xs text-brand-muted space-y-1.5 leading-relaxed">
                  <li>• <strong>Royal Mail Tracked 48:</strong> £2.99 (Free on orders £35+)</li>
                  <li>• <strong>Royal Mail Tracked 24:</strong> £4.49 (Next working day)</li>
                  <li>• <strong>DPD Express Courier:</strong> £6.99 (Guaranteed next day by 12pm)</li>
                  <li>• Orders placed by 3:00pm Mon–Fri dispatched the same day.</li>
                </ul>
              </div>

              <div className="p-4 rounded-brand border border-brand-border bg-brand-surface/40 space-y-2">
                <div className="flex items-center gap-2 text-brand-primary font-semibold text-xs uppercase tracking-wider">
                  <RotateCcw size={16} /> 30-Day UK Returns Policy
                </div>
                <p className="text-xs text-brand-muted leading-relaxed">
                  We offer a full 30-day refund for unopened items in their original packaging. For hygiene and pharmaceutical safety reasons, opened medicines, sterile wound dressings, and personal hygiene products cannot be returned once unsealed.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
