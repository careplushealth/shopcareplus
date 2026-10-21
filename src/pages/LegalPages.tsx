import React from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-8 bg-brand-offwhite min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Privacy & Cookie Policy' }]} />

        <div className="bg-white rounded-brand-xl p-8 sm:p-12 border border-brand-border shadow-subtle my-6 space-y-6 text-xs text-brand-charcoal leading-relaxed">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
            UK Data Protection & Privacy
          </span>
          <h1 className="text-3xl font-bold font-display text-brand-dark">
            Privacy & Cookie Policy
          </h1>
          <p className="text-brand-muted">
            Last updated: October 2026 • Compliant with the UK GDPR and the Data Protection Act 2018.
          </p>

          <hr className="border-brand-border" />

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              1. Information We Collect
            </h2>
            <p>
              When you visit or make a purchase from CarePlus Health Shop, we collect personal information necessary to process your transaction, arrange delivery, and communicate order updates. This includes your name, postal delivery address, email address, phone number, and IP address.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              2. How We Use Your Information
            </h2>
            <p>
              We process your personal data lawfully to fulfil orders placed through the website, process refunds, respond to customer service requests, and adhere to relevant UK consumer and pharmacy regulations. We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              3. Payment Security & Storage
            </h2>
            <p>
              All online payment details are encrypted using 256-bit Secure Sockets Layer (SSL) technology and handled directly by certified payment gateways. CarePlus Health Shop does not store payment card numbers or CVV codes on our servers or client browser storage.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              4. Cookies
            </h2>
            <p>
              We use essential cookies to maintain your shopping basket state and ensure site security. Analytical cookies are only used to understand site traffic and improve the customer experience. You may modify your browser settings to reject non-essential cookies at any time.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              5. Your Rights Under UK GDPR
            </h2>
            <p>
              You possess the right to access, rectify, or erase personal data we hold about you. To exercise any of these rights, contact our Data Protection Officer at privacy@careplushealth.co.uk.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="py-8 bg-brand-offwhite min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

        <div className="bg-white rounded-brand-xl p-8 sm:p-12 border border-brand-border shadow-subtle my-6 space-y-6 text-xs text-brand-charcoal leading-relaxed">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
            Legal Terms of Sale
          </span>
          <h1 className="text-3xl font-bold font-display text-brand-dark">
            Terms & Conditions of Sale
          </h1>
          <p className="text-brand-muted">
            Governed by the laws of England and Wales. Applicable to all online purchases.
          </p>

          <hr className="border-brand-border" />

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              1. General
            </h2>
            <p>
              These terms govern the supply of goods by CarePlus Health Shop to consumers within the United Kingdom. By placing an order via this website, you confirm that you are at least 18 years of age and legally capable of entering into binding contracts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              2. Pricing & Payment
            </h2>
            <p>
              All prices are quoted in British Pounds Sterling (£ GBP) and include UK Value Added Tax (VAT) where applicable. While we endeavor to ensure all pricing is accurate, errors may occasionally occur. If an error is identified, we will notify you promptly and offer the option to reconfirm or cancel.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              3. Delivery & Title
            </h2>
            <p>
              Dispatch dates and courier delivery estimates are provided in good faith. Risk of loss passes to you upon delivery by the carrier. Title to goods passes upon full receipt of payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">
              4. Product Information & Disclaimers
            </h2>
            <p>
              Information provided on product pages is for educational and retail guidance only and does not substitute for personalized medical advice from a registered General Practitioner (GP) or qualified pharmacist.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
