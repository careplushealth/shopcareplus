import React, { useState } from 'react';
import { Mail, Clock, Phone, Send, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [subject, setSubject] = useState('Order Enquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setIsSent(true);
    api.sendContactMessage({ name, email, orderNumber, subject, message }).catch(() => {});
  };

  return (
    <div className="py-8 bg-brand-offwhite min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        <div className="my-6">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
            UK Customer Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-brand-charcoal mt-1">
            Get in Touch With CarePlus
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-xl">
            Whether you have questions regarding products, parcel dispatch, or order support, our UK team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-brand-xl p-6 sm:p-8 border border-brand-border shadow-subtle space-y-6">
              <h3 className="font-display font-bold text-lg text-brand-charcoal pb-3 border-b border-brand-border">
                Support Details
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-brand bg-brand-light text-brand-dark flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <strong className="block text-brand-charcoal font-semibold">Opening Hours:</strong>
                    <span className="text-brand-muted">Monday – Friday: 9:00am – 5:30pm UK Time</span>
                    <span className="text-brand-subtle block text-[11px] mt-0.5">Closed weekends and UK Bank Holidays.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-brand bg-brand-light text-brand-dark flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <strong className="block text-brand-charcoal font-semibold">Email Enquiries:</strong>
                    <span className="text-brand-muted">support@careplushealth.co.uk</span>
                    <span className="text-brand-subtle block text-[11px] mt-0.5">Responses typically within 1 business day.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-brand bg-brand-light text-brand-dark flex items-center justify-center shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <strong className="block text-brand-charcoal font-semibold">Dispensary Fulfillment:</strong>
                    <span className="text-brand-muted">CarePlus Health Shop Operations</span>
                    <span className="text-brand-subtle block text-[11px] mt-0.5">North West Pharmacy Distribution Centre, United Kingdom</span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-surface/60 p-4 rounded-brand border border-brand-border/60 space-y-2 text-xs text-brand-muted">
                <div className="flex items-center gap-1.5 font-bold text-brand-dark">
                  <ShieldCheck size={16} className="text-brand-primary" />
                  <span>Medical Disclaimer Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  CarePlus Health Shop provides retail health and wellbeing products. If you are experiencing acute medical symptoms or emergencies, please contact NHS 111 or dial 999 immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-brand-xl p-6 sm:p-10 border border-brand-border shadow-subtle">
            {isSent ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-brand-primary flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-display font-bold text-2xl text-brand-charcoal">
                  Message Sent Successfully
                </h3>
                <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. We have received your enquiry and a member of our customer care team will reply to <strong>{email}</strong> shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="bg-brand-surface hover:bg-brand-light text-brand-charcoal text-xs font-semibold px-6 py-2.5 rounded-brand border border-brand-border"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-display font-bold text-lg text-brand-charcoal mb-4">
                  Send Us a Direct Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-brand-charcoal mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-brand-border rounded-brand p-2.5 focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-charcoal mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="liam.smith@example.co.uk"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-brand-border rounded-brand p-2.5 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-brand-charcoal mb-1">
                      Enquiry Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border border-brand-border rounded-brand p-2.5 focus:outline-none focus:border-brand-primary bg-white cursor-pointer"
                    >
                      <option value="Order Enquiry">Order Status / Delivery Enquiry</option>
                      <option value="Product Question">Product Specification & Advice</option>
                      <option value="Returns & Refunds">Returns, Cancellations & Refunds</option>
                      <option value="General Feedback">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-charcoal mb-1">
                      Order Reference (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CP-829104"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full border border-brand-border rounded-brand p-2.5 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-brand-charcoal mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Please include any helpful details regarding your question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-brand-border rounded-brand p-2.5 focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-dark hover:bg-brand-primary text-white font-semibold text-xs py-3.5 px-6 rounded-brand shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  <span>Send Enquiry to UK Support</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
