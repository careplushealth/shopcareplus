import React from 'react';
import { Truck, RotateCcw, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const DeliveryReturnsPage: React.FC = () => {
  return (
    <div className="py-8 bg-brand-offwhite min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Delivery & Returns Policy' }]} />

        <div className="my-6">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
            Customer Information
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-brand-charcoal mt-1">
            Delivery & Returns Policy
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Clear, transparent UK dispatch timescales, postal rates, and return procedures.
          </p>
        </div>

        {/* Delivery Options Table */}
        <div className="bg-white rounded-brand-xl p-6 sm:p-8 border border-brand-border shadow-subtle space-y-6 my-6">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
            <Truck size={20} className="text-brand-primary" />
            <h2 className="font-display font-bold text-lg text-brand-charcoal">
              UK Delivery Options & Costs
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface/50 text-brand-charcoal uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Estimated Arrival</th>
                  <th className="py-3 px-4">Orders Under £35</th>
                  <th className="py-3 px-4">Orders £35 & Over</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderLight">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-brand-dark">
                    Royal Mail Tracked 48
                  </td>
                  <td className="py-3.5 px-4 text-brand-muted">2–3 working days</td>
                  <td className="py-3.5 px-4 text-brand-charcoal">£2.99</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">FREE</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-brand-dark">
                    Royal Mail Tracked 24
                  </td>
                  <td className="py-3.5 px-4 text-brand-muted">Next working day</td>
                  <td className="py-3.5 px-4 text-brand-charcoal">£4.49</td>
                  <td className="py-3.5 px-4 text-brand-charcoal">£4.49</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-brand-dark">
                    DPD Express by 12:00pm
                  </td>
                  <td className="py-3.5 px-4 text-brand-muted">Guaranteed next day by 12pm</td>
                  <td className="py-3.5 px-4 text-brand-charcoal">£6.99</td>
                  <td className="py-3.5 px-4 text-brand-charcoal">£6.99</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-brand-surface/60 p-4 rounded-brand border border-brand-border/60 text-xs text-brand-muted space-y-1.5">
            <p className="font-semibold text-brand-charcoal">Cut-Off Times & Dispatch:</p>
            <p>• Orders placed before <strong>3:00pm Monday to Friday</strong> are dispatched the same day.</p>
            <p>• Orders placed after 3:00pm Friday or over the weekend will be dispatched on Monday.</p>
            <p>• All parcels are sent in plain, discreet recyclable boxes without external brand listings.</p>
          </div>
        </div>

        {/* 30-Day Returns Policy */}
        <div className="bg-white rounded-brand-xl p-6 sm:p-8 border border-brand-border shadow-subtle space-y-6 my-6">
          <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
            <RotateCcw size={20} className="text-brand-primary" />
            <h2 className="font-display font-bold text-lg text-brand-charcoal">
              30-Day UK Return Policy
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            We want you to be completely satisfied with your purchase from CarePlus Health Shop. You may return any unopened, unused items in their original packaging within <strong>30 days of receipt</strong> for a full refund.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-brand border border-emerald-200 bg-emerald-50/50 space-y-1.5">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-700" /> Eligible for Return:
              </span>
              <ul className="text-emerald-800 space-y-1 pl-5 list-disc">
                <li>Unopened vitamins & food supplements with safety seals intact.</li>
                <li>Unused mobility aids & bathroom accessories in original boxes.</li>
                <li>Cosmetics & moisturisers with unbroken protective foils.</li>
              </ul>
            </div>

            <div className="p-4 rounded-brand border border-amber-200 bg-amber-50/50 space-y-1.5">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle size={15} className="text-amber-700" /> Non-Returnable Items:
              </span>
              <p className="text-amber-800 leading-relaxed">
                Under UK Consumer Contracts Regulations & pharmacy safety law, unsealed medicines, sterile dressings, and opened personal hygiene items cannot be returned.
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-brand-muted">
            <h4 className="font-bold text-brand-charcoal mb-1">How to initiate a return:</h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Contact our UK support team at <strong>support@careplushealth.co.uk</strong> with your order number.</li>
              <li>We will issue you with a secure returns authorization code and UK return address.</li>
              <li>Package the items securely and obtain proof of postage from your local Post Office.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
