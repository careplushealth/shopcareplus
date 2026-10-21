import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, Mail } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useShop } from '../context/ShopContext';

interface FaqItem {
  question: string;
  answer: string;
  category: 'Orders & Delivery' | 'Products & Safety' | 'Returns & Refunds' | 'About CarePlus';
}

const FAQS: FaqItem[] = [
  {
    category: 'Orders & Delivery',
    question: 'How much does UK delivery cost?',
    answer: 'Standard Royal Mail Tracked 48 delivery is £2.99, or FREE on all UK orders of £35 and above. We also offer Royal Mail Tracked 24 for £4.49, and DPD Next Day by 12pm for £6.99.',
  },
  {
    category: 'Orders & Delivery',
    question: 'What time is the daily dispatch cut-off?',
    answer: 'Orders placed before 3:00pm Monday to Friday are prepared and handed to Royal Mail or DPD on the same day. Orders placed after 3:00pm on Friday will be dispatched the following Monday.',
  },
  {
    category: 'Orders & Delivery',
    question: 'Is parcel packaging discreet?',
    answer: 'Yes. All orders are packed in unmarked, plain, recyclable brown postal boxes or secure mailers. There is no external indication of the healthcare contents.',
  },
  {
    category: 'Products & Safety',
    question: 'Are all your products genuine UK stock?',
    answer: 'Absolutely. Every single product in our catalogue is sourced exclusively from licensed UK pharmaceutical wholesalers and verified brand manufacturers adhering to MHRA and UK standards.',
  },
  {
    category: 'Products & Safety',
    question: 'Can I purchase prescription-only medicines here?',
    answer: 'CarePlus Health Shop is an over-the-counter wellness and healthcare retail store. For NHS prescription dispensing and private consultation services, please connect directly with our affiliated North West community pharmacy branches.',
  },
  {
    category: 'Returns & Refunds',
    question: 'What is your returns policy?',
    answer: 'We offer a 30-day money-back guarantee on unopened, unused items in original sealed condition. For regulatory safety and hygiene reasons, opened supplements, medicines, and sterile medical devices cannot be returned once unsealed.',
  },
  {
    category: 'Returns & Refunds',
    question: 'How long do refunds take to process?',
    answer: 'Once our UK dispensary team inspects the returned items, refunds are issued back to your original payment method within 3 to 5 business days.',
  },
  {
    category: 'About CarePlus',
    question: 'Where is CarePlus based?',
    answer: 'CarePlus Health Shop is part of an established pharmacy network operating across the North West of England, with verified registered dispensaries serving thousands of UK patients.',
  },
];

export const FaqPage: React.FC = () => {
  const { navigate } = useShop();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-8 bg-brand-offwhite min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Frequently Asked Questions' }]} />

        <div className="my-6 text-center max-w-xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
            Help & Advice
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-brand-charcoal mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-2">
            Find immediate answers regarding orders, delivery, product safety, and returns.
          </p>

          {/* Search FAQs */}
          <div className="relative mt-6 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search questions (e.g. delivery, returns, genuine)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-brand-border rounded-full pl-10 pr-4 py-2.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-primary shadow-subtle"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {['All', 'Orders & Delivery', 'Products & Safety', 'Returns & Refunds', 'About CarePlus'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full transition-all font-medium ${
                activeCategory === cat
                  ? 'bg-brand-dark text-white font-semibold shadow-sm'
                  : 'bg-white border border-brand-border text-brand-charcoal hover:bg-brand-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-brand-lg border border-brand-border overflow-hidden shadow-subtle transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-brand-charcoal hover:text-brand-primary transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={16} className="text-brand-primary shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-brand-muted transition-transform duration-200 shrink-0 ${
                      isExpanded ? 'rotate-180 text-brand-primary' : ''
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-brand-muted leading-relaxed border-t border-brand-borderLight bg-brand-surface/20">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 bg-white rounded-brand-xl p-8 border border-brand-border text-center space-y-3 shadow-subtle">
          <Mail size={24} className="text-brand-primary mx-auto" />
          <h3 className="font-display font-bold text-base text-brand-charcoal">
            Still have questions?
          </h3>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Our UK support team is available Monday to Friday 9:00am to 5:30pm to assist with any enquiries.
          </p>
          <button
            onClick={() => navigate('contact')}
            className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-6 py-2.5 rounded-brand transition-colors inline-block"
          >
            Contact Customer Support
          </button>
        </div>
      </div>
    </div>
  );
};
