import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Truck,
  CreditCard,
  Check,
  AlertCircle,
  Tag,
  Key,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { OrderConfirmationData } from '../types';
import { api, StripeConfigResponse } from '../services/api';

interface CheckoutPageProps {
  onOrderComplete: (order: OrderConfirmationData) => void;
}

// Embedded Form appearance configuration specified by Checkout Studio
const appearance = {
  theme: 'stripe',
  labels: 'auto',
  inputs: 'spaced',
  variables: {
    borderRadius: '4px',
    colorBackground: '#ffffff',
    colorDanger: '#df1b41',
    colorPrimary: '#0570de',
    colorSuccess: '#00c853',
    colorText: '#30313d',
    fontFamily: 'default',
    fontSizeBase: '16px',
    spacingUnit: '4px',
  },
};

// Embedded Stripe Checkout Form Component (Part 2 of Stripe Checkout Integration)
const EmbeddedCheckoutForm: React.FC<{
  publishableKey: string;
  items: any[];
  onPaymentSuccess: () => void;
  onError: (msg: string) => void;
}> = ({ publishableKey, items, onPaymentSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function mountCheckout() {
      try {
        const stripeGlobal = (window as any).Stripe;
        if (!stripeGlobal) {
          throw new Error('Stripe.js Dahlia SDK not loaded from https://js.stripe.com/dahlia/stripe.js');
        }

        const stripe = stripeGlobal(publishableKey);

        const clientSecret = fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        })
          .then((response) => response.json())
          .then((json) => json.client_secret);

        const checkout = stripe.initCheckoutFormSdk({ clientSecret, appearance });
        const form = checkout.createForm({ layout: 'expanded' });

        const container = document.getElementById('checkout-form');
        if (container && isMounted) {
          form.mount('#checkout-form');
        }

        const loadActionsResult = await checkout.loadActions();
        if (loadActionsResult.type === 'success' && isMounted) {
          form.on('confirm', async (event: any) => {
            try {
              await loadActionsResult.actions.confirm({ formConfirmEvent: event });
              onPaymentSuccess();
            } catch (error: any) {
              console.error('Payment confirmation error:', error);
              onError(error.message || 'Payment confirmation error');
            }
          });
        }
        if (isMounted) setLoading(false);
      } catch (err: any) {
        if (isMounted) {
          setInitError(err.message);
          setLoading(false);
        }
      }
    }

    mountCheckout();

    return () => {
      isMounted = false;
    };
  }, [publishableKey]);

  return (
    <div className="space-y-4">
      {loading && (
        <div className="py-6 text-center text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw size={16} className="animate-spin text-emerald-800" />
          <span className="text-xs font-semibold">Loading Stripe Checkout Embedded Form...</span>
        </div>
      )}
      {initError && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
          <p className="font-bold">Embedded Form Notice</p>
          <p className="mt-0.5">{initError}</p>
        </div>
      )}
      <div id="checkout-form" className="min-h-[180px] bg-white p-4 rounded-xl border border-slate-200"></div>
    </div>
  );
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderComplete }) => {
  const {
    cart,
    cartSubtotal,
    freeDeliveryThreshold,
    appliedPromo,
    discountRate,
    discountAmount,
    applyPromoCode,
    customerProfile,
    clearCart,
    navigate,
  } = useShop();

  // Contact & Delivery details with prefill
  const [email, setEmail] = useState(customerProfile?.email || '');
  const [phone, setPhone] = useState(customerProfile?.phone || '');
  const [firstName, setFirstName] = useState(customerProfile?.firstName || '');
  const [lastName, setLastName] = useState(customerProfile?.lastName || '');
  const [addressLine1, setAddressLine1] = useState(customerProfile?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(customerProfile?.addressLine2 || '');
  const [city, setCity] = useState(customerProfile?.city || '');
  const [county, setCounty] = useState(customerProfile?.county || '');
  const [postcode, setPostcode] = useState(customerProfile?.postcode || '');
  const [country] = useState('United Kingdom');
  const [deliveryMethod, setDeliveryMethod] = useState<'rm48' | 'rm24' | 'dpd'>('rm48');

  // Stripe State
  const [stripeConfig, setStripeConfig] = useState<StripeConfigResponse | null>(null);
  const [orderNumber] = useState<string>(() => `CP-${Math.floor(100000 + Math.random() * 900000)}`);

  // Stripe Key Setup Modal / Inline Form State
  const [showStripeKeyInput, setShowStripeKeyInput] = useState(false);
  const [inputSecretKey, setInputSecretKey] = useState('');
  const [inputPublishableKey, setInputPublishableKey] = useState('');
  const [isSavingKeys, setIsSavingKeys] = useState(false);
  const [keySaveMessage, setKeySaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form & validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isDemoProcessing, setIsDemoProcessing] = useState(false);

  // Promo Code
  const [checkoutPromoInput, setCheckoutPromoInput] = useState('');
  const [checkoutPromoMsg, setCheckoutPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Delivery Calculations
  const isFreeDelivery = cartSubtotal >= freeDeliveryThreshold;
  let shippingCost = 0;
  if (deliveryMethod === 'rm48') {
    shippingCost = isFreeDelivery ? 0 : 2.99;
  } else if (deliveryMethod === 'rm24') {
    shippingCost = 4.49;
  } else if (deliveryMethod === 'dpd') {
    shippingCost = 6.99;
  }

  const grandTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const deliveryMethodName =
    deliveryMethod === 'dpd'
      ? 'DPD Guaranteed Next Day by 12pm'
      : deliveryMethod === 'rm24'
      ? 'Royal Mail Tracked 24'
      : 'Royal Mail Tracked 48';

  const estimatedDelivery =
    deliveryMethod === 'dpd' ? 'Tomorrow by 12:00pm' : deliveryMethod === 'rm24' ? '1–2 Working Days' : '2–3 Working Days';

  // Check Stripe configuration on mount
  useEffect(() => {
    checkStripeConfig();
  }, []);

  const checkStripeConfig = async () => {
    try {
      const config = await api.getStripeConfig();
      setStripeConfig(config);
    } catch (err) {
      console.warn('Failed to fetch stripe config:', err);
    }
  };

  // Handle saving Stripe Keys from inline form
  const handleSaveStripeKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSecretKey.trim() || !inputPublishableKey.trim()) {
      setKeySaveMessage({ type: 'error', text: 'Please enter both the Secret Key and Publishable Key.' });
      return;
    }

    setIsSavingKeys(true);
    setKeySaveMessage(null);

    const res = await api.saveStripeConfig({
      secretKey: inputSecretKey.trim(),
      publishableKey: inputPublishableKey.trim(),
    });

    setIsSavingKeys(false);

    if (res.success) {
      setKeySaveMessage({ type: 'success', text: 'Stripe keys validated and saved securely! Activating payment gateway...' });
      setStripeConfig({ configured: true, publishableKey: inputPublishableKey.trim() });
      setTimeout(() => {
        setShowStripeKeyInput(false);
      }, 1200);
    } else {
      setKeySaveMessage({ type: 'error', text: res.error || 'Failed to validate Stripe keys. Please double-check your keys.' });
    }
  };

  const handleApplyCheckoutPromo = () => {
    setCheckoutPromoMsg(null);
    if (!checkoutPromoInput.trim()) return;
    const res = applyPromoCode(checkoutPromoInput);
    if (res.success) {
      setCheckoutPromoInput('');
      setCheckoutPromoMsg({ text: res.message, isError: false });
    } else {
      setCheckoutPromoMsg({ text: res.message, isError: true });
    }
  };

  // Validate delivery fields
  const validateDeliveryDetails = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !emailRegex.test(email)) errors.email = 'Valid email is required for tracking & receipt';
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!addressLine1.trim()) errors.addressLine1 = 'House number / street address is required';
    if (!city.trim()) errors.city = 'Town / City is required';
    if (!postcode.trim() || postcode.trim().length < 5) errors.postcode = 'Valid UK postcode is required (e.g. M1 4BT)';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Order completion handler (shared by Stripe embedded form and demo mode)
  const completeOrder = async (paymentIntentId?: string) => {
    const orderData: OrderConfirmationData = {
      orderNumber,
      orderDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cart],
      subtotal: cartSubtotal,
      shipping: shippingCost,
      discount: discountAmount,
      total: grandTotal,
      customer: {
        email,
        phone,
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        county,
        postcode,
        country,
        deliveryOptionId: deliveryMethod,
        paymentMethod: 'card',
      },
      deliveryMethodName,
      estimatedDelivery,
      paymentIntentId: paymentIntentId || undefined,
      paymentStatus: paymentIntentId ? 'paid' : 'completed',
    };

    await api.saveOrder(orderData);
    clearCart();
    onOrderComplete(orderData);
    navigate('order-confirmation');
  };

  const handleDemoOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateDeliveryDetails()) {
      setErrorMessage('Please complete all required delivery details marked in red above.');
      return;
    }

    setIsDemoProcessing(true);
    await completeOrder();
    setIsDemoProcessing(false);
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <Truck size={28} />
        </div>
        <h2 className="text-2xl font-bold font-serif text-slate-900 mb-2">
          Your basket is empty
        </h2>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Add pharmacy essentials or everyday wellness items to proceed to checkout.
        </p>
        <button
          onClick={() => navigate('shop')}
          className="bg-emerald-900 hover:bg-emerald-950 text-white text-xs px-6 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer"
        >
          Browse Healthcare Dispensary
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Basket', path: 'cart' }, { label: 'Secure UK Checkout' }]} />

        {/* Top Trust Header Strip */}
        <div className="my-6 bg-white border-2 border-emerald-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck size={24} className="text-emerald-900" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 font-serif">
                CarePlus Health Dispensary Checkout
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Wilmslow Road Pharmacy &bull; Stripe Checkout Embedded Form &bull; Neon Postgres Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold">
              <Lock size={12} className="text-emerald-700" />
              <span>256-Bit SSL Secured</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded-full text-xs font-semibold">
              <CheckCircle2 size={12} className="text-emerald-600" />
              <span>GPhC Standards</span>
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-100 border-2 border-red-300 text-red-900 text-xs flex items-start gap-2.5 font-medium shadow-sm">
            <AlertCircle size={18} className="text-red-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-950">Please complete the required details</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Checkout Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer Contact */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-white text-xs flex items-center justify-center font-sans font-bold">
                    1
                  </span>
                  Customer Information
                </h2>
                <span className="text-xs text-slate-500 font-semibold">* Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@example.co.uk"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                    }}
                    className={`w-full border-2 rounded-xl p-3 text-slate-900 font-medium focus:outline-none transition-colors ${
                      formErrors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-300 focus:border-emerald-700'
                    }`}
                  />
                  {formErrors.email ? (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.email}</p>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-1">For order dispatch tracking &amp; VAT receipt.</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    UK Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="07123 456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-700"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">For delivery driver SMS alerts.</p>
                </div>
              </div>
            </div>

            {/* Step 2: UK Delivery Address */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-white text-xs flex items-center justify-center font-sans font-bold">
                    2
                  </span>
                  UK Delivery Address
                </h2>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: '' });
                      }}
                      className={`w-full border-2 rounded-xl p-3 text-slate-900 font-medium focus:outline-none transition-colors ${
                        formErrors.firstName ? 'border-red-400 bg-red-50/50' : 'border-slate-300 focus:border-emerald-700'
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jenkins"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: '' });
                      }}
                      className={`w-full border-2 rounded-xl p-3 text-slate-900 font-medium focus:outline-none transition-colors ${
                        formErrors.lastName ? 'border-red-400 bg-red-50/50' : 'border-slate-300 focus:border-emerald-700'
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Street Address (House number and road) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 142 Wilmslow Road"
                    value={addressLine1}
                    onChange={(e) => {
                      setAddressLine1(e.target.value);
                      if (formErrors.addressLine1) setFormErrors({ ...formErrors, addressLine1: '' });
                    }}
                    className={`w-full border-2 rounded-xl p-3 text-slate-900 font-medium focus:outline-none transition-colors ${
                      formErrors.addressLine1 ? 'border-red-400 bg-red-50/50' : 'border-slate-300 focus:border-emerald-700'
                    }`}
                  />
                  {formErrors.addressLine1 && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.addressLine1}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Address Line 2 (Flat, suite, unit - optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 3A"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full border-2 border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manchester"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (formErrors.city) setFormErrors({ ...formErrors, city: '' });
                      }}
                      className={`w-full border-2 rounded-xl p-3 text-slate-900 font-medium focus:outline-none transition-colors ${
                        formErrors.city ? 'border-red-400 bg-red-50/50' : 'border-slate-300 focus:border-emerald-700'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      County
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Greater Manchester"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full border-2 border-slate-300 rounded-xl p-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      UK Postcode *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. M14 5TP"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value.toUpperCase());
                        if (formErrors.postcode) setFormErrors({ ...formErrors, postcode: '' });
                      }}
                      className={`w-full border-2 rounded-xl p-3 text-slate-900 font-mono font-bold uppercase focus:outline-none transition-colors ${
                        formErrors.postcode ? 'border-red-400 bg-red-50/50' : 'border-slate-300 focus:border-emerald-700'
                      }`}
                    />
                    {formErrors.postcode && (
                      <p className="text-[11px] text-red-600 font-semibold mt-1">{formErrors.postcode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    disabled
                    value={country}
                    className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl p-3 text-slate-600 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: UK Delivery Service */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-white text-xs flex items-center justify-center font-sans font-bold">
                    3
                  </span>
                  Choose UK Delivery Service
                </h2>
              </div>

              <div className="space-y-3">
                {/* Royal Mail 48 */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'rm48'
                      ? 'border-emerald-800 bg-emerald-50/60 ring-1 ring-emerald-800'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="rm48"
                      checked={deliveryMethod === 'rm48'}
                      onChange={() => setDeliveryMethod('rm48')}
                      className="text-emerald-800 focus:ring-emerald-800 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Royal Mail Tracked 48 (Standard UK Delivery)
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        2 to 3 working days with end-to-end GPS delivery confirmation.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-900">
                    {isFreeDelivery ? 'FREE' : '£2.99'}
                  </span>
                </label>

                {/* Royal Mail 24 */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'rm24'
                      ? 'border-emerald-800 bg-emerald-50/60 ring-1 ring-emerald-800'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="rm24"
                      checked={deliveryMethod === 'rm24'}
                      onChange={() => setDeliveryMethod('rm24')}
                      className="text-emerald-800 focus:ring-emerald-800 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Royal Mail Tracked 24 (Next Working Day Priority)
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Same-day dispatch for orders placed before 3:00pm.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    £4.49
                  </span>
                </label>

                {/* DPD Express */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === 'dpd'
                      ? 'border-emerald-800 bg-emerald-50/60 ring-1 ring-emerald-800'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="dpd"
                      checked={deliveryMethod === 'dpd'}
                      onChange={() => setDeliveryMethod('dpd')}
                      className="text-emerald-800 focus:ring-emerald-800 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        DPD Guaranteed Next Day by 12:00pm
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Precise 1-hour delivery timeslot with live driver mapping.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    £6.99
                  </span>
                </label>
              </div>
            </div>

            {/* Step 4: Stripe Embedded Checkout Form */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-900 text-white text-xs flex items-center justify-center font-sans font-bold">
                    4
                  </span>
                  Stripe Checkout (Embedded Form)
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Lock size={12} />
                  <span>Stripe Dahlia SDK</span>
                </div>
              </div>

              {/* Stripe Configured: Render Embedded Checkout Form */}
              {stripeConfig?.configured && stripeConfig.publishableKey ? (
                <div className="space-y-4">
                  <EmbeddedCheckoutForm
                    publishableKey={stripeConfig.publishableKey}
                    items={cart}
                    onPaymentSuccess={() => completeOrder('stripe_checkout_session')}
                    onError={(msg) => setErrorMessage(msg)}
                  />
                </div>
              ) : (
                /* Stripe Setup & Connect Banner */
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-300 text-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                        <CreditCard size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-slate-950 font-serif">
                            Connect Your Stripe Account
                          </h3>
                          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-950 border border-amber-300 rounded-full text-[10px] font-extrabold uppercase">
                            Awaiting Keys
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                          Your app is fully configured for Stripe Checkout Embedded Form (<code className="font-mono text-emerald-900 font-bold">ui_mode: "form"</code>). Enter your Stripe API keys below or in <code className="font-mono text-emerald-900 font-bold">.env.local</code>.
                        </p>

                        {!showStripeKeyInput ? (
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setShowStripeKeyInput(true)}
                              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                              <Key size={14} />
                              <span>Enter Stripe API Keys</span>
                            </button>
                            <a
                              href="https://dashboard.stripe.com/apikeys"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-emerald-900 hover:underline inline-flex items-center gap-1"
                            >
                              <span>Get Keys from Stripe Dashboard</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        ) : (
                          <form onSubmit={handleSaveStripeKeys} className="mt-4 space-y-3 bg-white p-4 rounded-xl border border-emerald-200">
                            {keySaveMessage && (
                              <div
                                className={`p-3 rounded-lg text-xs font-semibold ${
                                  keySaveMessage.type === 'success'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-red-100 text-red-900 border border-red-300'
                                }`}
                              >
                                {keySaveMessage.text}
                              </div>
                            )}

                            <div>
                              <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                                Publishable Key (VITE_STRIPE_PUBLISHABLE_KEY: pk_test_... or pk_live_...) *
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="pk_test_..."
                                value={inputPublishableKey}
                                onChange={(e) => setInputPublishableKey(e.target.value)}
                                className="w-full font-mono text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-800 uppercase mb-1">
                                Secret Key (STRIPE_SECRET_KEY: sk_test_... or sk_live_...) *
                              </label>
                              <input
                                type="password"
                                required
                                placeholder="sk_test_..."
                                value={inputSecretKey}
                                onChange={(e) => setInputSecretKey(e.target.value)}
                                className="w-full font-mono text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                              />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => setShowStripeKeyInput(false)}
                                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={isSavingKeys}
                                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                              >
                                {isSavingKeys ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                <span>Save &amp; Activate Stripe</span>
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fallback Demo Checkout Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleDemoOrderSubmit}
                      disabled={isDemoProcessing}
                      className="w-full py-3.5 px-4 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isDemoProcessing ? (
                        <>
                          <RefreshCw size={14} className="animate-spin text-white" />
                          <span>Confirming Order...</span>
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          <span>Place Demo Order (£{grandTotal.toFixed(2)}) without Stripe Keys</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
                      Simulates order placement, creates GPS tracking reference, and persists order into Neon Postgres.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-slate-200 shadow-sm sticky top-24">
              <h2 className="font-serif font-bold text-lg text-slate-950 pb-4 border-b border-slate-100">
                Order Summary ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto py-2">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 p-1 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/products/panadol-advance.jpg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Qty: {item.quantity} &bull; £{item.product.price.toFixed(2)} each
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-950">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                  <Tag size={13} className="text-emerald-700" />
                  <span>Promo / Discount Code</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={checkoutPromoInput}
                    onChange={(e) => setCheckoutPromoInput(e.target.value.toUpperCase())}
                    placeholder="e.g. WELLBEING10"
                    className="flex-1 border-2 border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-emerald-700"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCheckoutPromo}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {checkoutPromoMsg && (
                  <p
                    className={`text-[11px] font-semibold mt-1.5 ${
                      checkoutPromoMsg.isError ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {checkoutPromoMsg.text}
                  </p>
                )}
                {appliedPromo && !checkoutPromoMsg && (
                  <p className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1">
                    <Check size={12} />
                    <span>Code {appliedPromo} applied ({Math.round(discountRate * 100)}% discount)</span>
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">£{cartSubtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Discount ({appliedPromo})</span>
                    <span>-£{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>UK Shipping ({deliveryMethod === 'dpd' ? 'DPD' : 'Royal Mail'})</span>
                  <span className="font-bold text-slate-900">
                    {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span className="font-serif font-extrabold text-base text-slate-950">
                      Total to Pay
                    </span>
                    <span className="text-[10px] text-slate-500 block">Includes UK VAT (where applicable)</span>
                  </div>
                  <span className="font-serif font-extrabold text-2xl text-slate-950">
                    £{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Delivery Guarantee Pill */}
              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-[11px] text-slate-600">
                <Truck size={16} className="text-emerald-700 shrink-0" />
                <span>
                  Dispatched via <strong>{deliveryMethodName}</strong> &bull; Est. delivery: {estimatedDelivery}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
