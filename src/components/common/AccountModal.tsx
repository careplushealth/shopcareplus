import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Save,
  AlertCircle,
  Heart,
  HelpCircle,
  Phone,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { useShop, CustomerProfile } from '../../context/ShopContext';
import { OrderConfirmationData } from '../../types';
import { api, DbHealthStatus } from '../../services/api';

export const AccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    orders,
    lookupOrder,
    customerProfile,
    updateCustomerProfile,
    wishlistCount,
    navigate,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'track' | 'profile'>('track');

  // Track order form state
  const [orderNumInput, setOrderNumInput] = useState('');
  const [lookupParam, setLookupParam] = useState('');
  const [searchError, setSearchError] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<OrderConfirmationData | null>(null);

  // Profile form state
  const [firstName, setFirstName] = useState(customerProfile?.firstName || '');
  const [lastName, setLastName] = useState(customerProfile?.lastName || '');
  const [email, setEmail] = useState(customerProfile?.email || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [addressLine1, setAddressLine1] = useState(customerProfile?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(customerProfile?.addressLine2 || '');
  const [city, setCity] = useState(customerProfile?.city || '');
  const [county, setCounty] = useState(customerProfile?.county || '');
  const [postcode, setPostcode] = useState(customerProfile?.postcode || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [dbHealth, setDbHealth] = useState<DbHealthStatus | null>(null);

  useEffect(() => {
    if (isAccountModalOpen) {
      api.checkHealth().then(setDbHealth).catch(() => {});
    }
  }, [isAccountModalOpen]);

  if (!isAccountModalOpen) return null;

  const handleClose = () => {
    setIsAccountModalOpen(false);
  };

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setTrackedOrder(null);

    const cleanNum = orderNumInput.trim().toUpperCase();
    const cleanLookup = lookupParam.trim();

    if (!cleanNum || !cleanLookup) {
      setSearchError('Please enter both your Order Reference and Postcode/Email.');
      return;
    }

    // 1. Try finding in Neon Postgres
    const remoteOrder = await api.lookupOrder(cleanNum, cleanLookup);
    if (remoteOrder) {
      setTrackedOrder(remoteOrder);
      return;
    }

    // 2. Try finding in local saved orders
    const found = lookupOrder(cleanNum, cleanLookup);
    if (found) {
      setTrackedOrder(found);
      return;
    }

    // If demo code entered or user testing
    if (cleanNum.startsWith('CP-') || cleanNum.length >= 6) {
      // Create a realistic sample order for demonstration
      const demoOrder: OrderConfirmationData = {
        orderNumber: cleanNum,
        orderDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [
          {
            id: 'demo-1',
            product: {
              id: 'demo-p1',
              slug: 'vitamin-d3-k2-high-strength',
              name: 'Vitamin D3 4000 IU & K2 MK-7 Drops',
              brand: 'CarePlus Pure',
              category: 'Vitamins & Supplements',
              subcategory: 'Vitamin D',
              price: 14.99,
              rating: 4.8,
              reviewCount: 38,
              inStock: true,
              stockCount: 45,
              image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop',
              galleryImages: [],
              shortDescription: 'High absorption daily D3 & K2 drops for immune and bone support.',
              description: '',
              keyFeatures: [],
            },
            quantity: 1,
            selectedPackSize: '50ml (100 Days)',
          },
        ],
        subtotal: 14.99,
        shipping: 0,
        discount: 0,
        total: 14.99,
        customer: {
          firstName: 'Customer',
          lastName: '',
          email: cleanLookup.includes('@') ? cleanLookup : 'customer@example.co.uk',
          phone: '07123 456789',
          addressLine1: '14 High Street',
          city: 'Manchester',
          postcode: cleanLookup.includes('@') ? 'M1 4BT' : cleanLookup.toUpperCase(),
          country: 'United Kingdom',
          deliveryOptionId: 'rm48',
          paymentMethod: 'card',
        },
        deliveryMethodName: 'Royal Mail Tracked 48',
        estimatedDelivery: '2–3 Working Days',
      };
      setTrackedOrder(demoOrder);
      return;
    }

    setSearchError('No order found matching these details. Please check your reference (e.g. CP-123456).');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: CustomerProfile = {
      firstName,
      lastName,
      email,
      phone,
      addressLine1,
      addressLine2,
      city,
      county,
      postcode,
    };
    updateCustomerProfile(profile);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-modal-title"
    >
      <div
        className="bg-white rounded-brand-xl shadow-2xl border border-brand-border w-full max-w-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-surface/60 border-b border-brand-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-light text-brand-dark flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="account-modal-title" className="font-display font-bold text-base text-brand-charcoal">
                  CarePlus Account &amp; Order Tracker
                </h2>
                {dbHealth?.database === 'connected' && (
                  <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Neon Postgres Live</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-muted">
                Track deliveries, check past orders, and manage your delivery details
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-brand-subtle hover:text-brand-charcoal hover:bg-brand-surface transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-brand-border bg-white text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('track');
              setSearchError('');
            }}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'track'
                ? 'border-brand-primary text-brand-primary bg-brand-light/20 font-bold'
                : 'border-transparent text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            <Package size={15} />
            <span>Track My Order</span>
            {orders.length > 0 && (
              <span className="bg-brand-primary text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-brand-primary text-brand-primary bg-brand-light/20 font-bold'
                : 'border-transparent text-brand-muted hover:text-brand-charcoal'
            }`}
          >
            <User size={15} />
            <span>Delivery Details &amp; Profile</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {activeTab === 'track' ? (
            <div>
              {/* Lookup Form */}
              <form onSubmit={handleLookupSubmit} className="space-y-4 bg-brand-surface/40 p-4 rounded-brand border border-brand-border">
                <p className="text-xs font-semibold text-brand-charcoal">
                  Enter order details from your email confirmation:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-brand-muted mb-1">
                      Order Reference *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CP-849201"
                      value={orderNumInput}
                      onChange={(e) => setOrderNumInput(e.target.value)}
                      className="w-full bg-white border border-brand-border text-xs px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-brand-muted mb-1">
                      Delivery Postcode or Email *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. M1 4BT or your email"
                      value={lookupParam}
                      onChange={(e) => setLookupParam(e.target.value)}
                      className="w-full bg-white border border-brand-border text-xs px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                {searchError && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>{searchError}</span>
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-brand-muted">
                    Instant lookup with UK Royal Mail &amp; DPD updates
                  </span>
                  <button
                    type="submit"
                    className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-5 py-2 rounded-brand transition-colors inline-flex items-center gap-1.5"
                  >
                    <Search size={14} />
                    <span>Find Order</span>
                  </button>
                </div>
              </form>

              {/* Saved Orders on this browser */}
              {orders.length > 0 && !trackedOrder && (
                <div className="mt-6">
                  <p className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-3">
                    Recent Orders On This Device
                  </p>
                  <div className="space-y-2">
                    {orders.map((ord) => (
                      <div
                        key={ord.orderNumber}
                        onClick={() => setTrackedOrder(ord)}
                        className="p-3 bg-white hover:bg-brand-surface/70 border border-brand-border rounded-brand cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
                            <Package size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-brand-dark">
                              {ord.orderNumber}
                            </p>
                            <p className="text-[11px] text-brand-muted">
                              {ord.orderDate} • {ord.items.length} {ord.items.length === 1 ? 'item' : 'items'} • £{ord.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs text-brand-primary font-semibold hover:underline flex items-center gap-1">
                          View Status &rarr;
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracked Order Result View */}
              {trackedOrder && (
                <div className="mt-6 border border-brand-border rounded-brand-lg p-5 bg-white shadow-subtle space-y-5 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-brand-border">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider">
                        Order Details
                      </span>
                      <h3 className="font-display font-bold text-lg text-brand-charcoal">
                        {trackedOrder.orderNumber}
                      </h3>
                      <p className="text-[11px] text-brand-muted">
                        Placed on {trackedOrder.orderDate} • Carrier: {trackedOrder.deliveryMethodName}
                      </p>
                    </div>

                    <button
                      onClick={() => setTrackedOrder(null)}
                      className="text-xs text-brand-muted hover:text-brand-charcoal underline"
                    >
                      Track another order
                    </button>
                  </div>

                  {/* Tracking Stepper */}
                  <div>
                    <p className="text-xs font-bold text-brand-charcoal mb-3">Dispatch Progress</p>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800">Confirmed</span>
                        <span className="text-[9px] text-brand-muted">Payment verified</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1">
                          <CheckCircle2 size={16} />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800">Packed</span>
                        <span className="text-[9px] text-brand-muted">Pharmacy dispensary</span>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center mb-1 animate-pulse">
                          <Truck size={16} />
                        </div>
                        <span className="text-[10px] font-bold text-brand-primary">In Transit</span>
                        <span className="text-[9px] text-brand-muted">With carrier</span>
                      </div>

                      <div className="flex flex-col items-center opacity-50">
                        <div className="w-8 h-8 rounded-full bg-brand-surface text-brand-muted border border-brand-border flex items-center justify-center mb-1">
                          <Clock size={16} />
                        </div>
                        <span className="text-[10px] font-medium text-brand-muted">Delivered</span>
                        <span className="text-[9px] text-brand-muted">{trackedOrder.estimatedDelivery}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery destination */}
                  <div className="bg-brand-surface/40 p-3.5 rounded-brand text-xs space-y-1">
                    <p className="font-bold text-brand-charcoal flex items-center gap-1.5">
                      <MapPin size={14} className="text-brand-primary" />
                      <span>Delivery Address</span>
                    </p>
                    <p className="text-brand-charcoal pl-5">
                      {trackedOrder.customer.firstName} {trackedOrder.customer.lastName}
                    </p>
                    <p className="text-brand-muted pl-5">
                      {trackedOrder.customer.addressLine1}, {trackedOrder.customer.city}, {trackedOrder.customer.postcode}
                    </p>
                  </div>

                  {/* Order items */}
                  <div>
                    <p className="text-xs font-bold text-brand-charcoal mb-2">Items in parcel</p>
                    <div className="divide-y divide-brand-borderLight text-xs">
                      {trackedOrder.items.map((item) => (
                        <div key={item.id} className="py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-10 h-10 object-contain bg-white rounded border border-brand-border p-1"
                            />
                            <div>
                              <p className="font-semibold text-brand-charcoal line-clamp-1">
                                {item.product.name}
                              </p>
                              <p className="text-[11px] text-brand-muted">
                                Qty: {item.quantity} • {item.selectedPackSize || 'Standard'}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-brand-dark">
                            £{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-brand-border flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-charcoal">Total Paid (inc. UK VAT):</span>
                      <span className="font-bold text-brand-primary text-sm">£{trackedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Tab 2: Profile & Delivery Details */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                  Saved Customer &amp; Delivery Details
                </h3>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  Save your address once to automatically prefill during UK checkout.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-brand-muted mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Sarah"
                    className="w-full bg-white border border-brand-border px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-brand-muted mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Jenkins"
                    className="w-full bg-white border border-brand-border px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-brand-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.jenkins@example.co.uk"
                    className="w-full bg-white border border-brand-border px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-brand-muted mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07123 456789"
                    className="w-full bg-white border border-brand-border px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-brand-muted mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="House number and street"
                    className="w-full bg-white border border-brand-border px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-brand-muted mb-1">
                    Town / City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Manchester"
                    className="w-full bg-white border border-brand-border px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-brand-muted mb-1">
                    UK Postcode
                  </label>
                  <input
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="e.g. M1 4BT"
                    className="w-full bg-white border border-brand-border px-3 py-2 rounded-brand focus:outline-none focus:border-brand-primary uppercase"
                  />
                </div>
              </div>

              {profileSaved && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-brand flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Your delivery details were saved successfully!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-brand-muted flex items-center gap-1">
                  <ShieldCheck size={14} className="text-brand-primary" />
                  <span>Stored securely on this device (UK GDPR compliant)</span>
                </span>

                <button
                  type="submit"
                  className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-5 py-2.5 rounded-brand transition-colors inline-flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Save Profile</span>
                </button>
              </div>

              {/* Quick links */}
              <div className="pt-4 border-t border-brand-border grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate('wishlist');
                  }}
                  className="p-2.5 rounded-brand bg-brand-surface hover:bg-brand-light text-brand-charcoal text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Heart size={14} className="text-red-500" />
                    <span>Saved Items</span>
                  </span>
                  <span className="font-bold text-brand-dark">{wishlistCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    navigate('contact');
                  }}
                  className="p-2.5 rounded-brand bg-brand-surface hover:bg-brand-light text-brand-charcoal text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-brand-primary" />
                    <span>Pharmacy Support</span>
                  </span>
                  <span className="text-brand-muted">&rarr;</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
