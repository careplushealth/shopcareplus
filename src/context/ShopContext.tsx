import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderConfirmationData } from '../types';
import { PRODUCTS } from '../data/products';
import { api } from '../services/api';

export interface RouteState {
  path: string;
  params?: Record<string, string>;
}

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postcode: string;
}

interface NotificationState {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'cart';
  productName?: string;
  productImage?: string;
}

interface PromoResult {
  success: boolean;
  message: string;
}

interface ShopContextType {
  // Navigation
  route: RouteState;
  navigate: (path: string, params?: Record<string, string>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedPackSize?: string, openDrawer?: boolean) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;

  // Promo / Discount
  appliedPromo: string | null;
  discountRate: number;
  discountAmount: number;
  applyPromoCode: (code: string) => PromoResult;
  removePromoCode: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Orders & Account
  orders: OrderConfirmationData[];
  saveOrder: (order: OrderConfirmationData) => void;
  lookupOrder: (orderNumber: string, postcodeOrEmail: string) => OrderConfirmationData | null;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  customerProfile: CustomerProfile | null;
  updateCustomerProfile: (profile: CustomerProfile) => void;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  executeSearch: (query: string) => void;

  // Toast
  notification: NotificationState | null;
  dismissNotification: () => void;

  // Live Products from Neon Postgres
  products: Product[];
  isLoadingProducts: boolean;
  refetchProducts: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state from window URL hash or default
  const [route, setRoute] = useState<RouteState>(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash || hash === '/' || hash === '') {
      return { path: 'home' };
    }
    const [pathPart, queryPart] = hash.split('?');
    const params: Record<string, string> = {};
    if (queryPart) {
      new URLSearchParams(queryPart).forEach((val, key) => {
        params[key] = val;
      });
    }
    return { path: pathPart || 'home', params };
  });

  const navigate = (path: string, params?: Record<string, string>) => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    let newHash = cleanPath || 'home';
    if (params && Object.keys(params).length > 0) {
      const q = new URLSearchParams(params).toString();
      newHash += `?${q}`;
    }
    window.location.hash = newHash;
    setRoute({ path: cleanPath || 'home', params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const [pathPart, queryPart] = hash.split('?');
      const params: Record<string, string> = {};
      if (queryPart) {
        new URLSearchParams(queryPart).forEach((val, key) => {
          params[key] = val;
        });
      }
      setRoute({ path: pathPart || 'home', params });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Products State synchronized with Neon Postgres database
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

  const refetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await api.getPublicProducts();
      if (res.success && res.products && res.products.length > 0) {
        setProducts(res.products);
      }
    } catch (err) {
      console.warn('Could not fetch products from Neon Postgres, using initial dataset:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    refetchProducts();
  }, []);

  // Cart State with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('careplus_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('careplus_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Promo Code State
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('careplus_promo') || null;
    } catch {
      return null;
    }
  });

  // Calculate discount rate
  const discountRate = appliedPromo === 'CAREPLUS15' ? 0.15 : appliedPromo === 'SAVE5' ? 0.05 : appliedPromo ? 0.10 : 0;

  const applyPromoCode = (code: string): PromoResult => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELLBEING10') {
      setAppliedPromo('WELLBEING10');
      try { localStorage.setItem('careplus_promo', 'WELLBEING10'); } catch {}
      return { success: true, message: 'Code WELLBEING10 applied: 10% discount added!' };
    }
    if (clean === 'CAREPLUS15') {
      setAppliedPromo('CAREPLUS15');
      try { localStorage.setItem('careplus_promo', 'CAREPLUS15'); } catch {}
      return { success: true, message: 'Code CAREPLUS15 applied: 15% VIP discount added!' };
    }
    if (clean === 'SAVE5') {
      setAppliedPromo('SAVE5');
      try { localStorage.setItem('careplus_promo', 'SAVE5'); } catch {}
      return { success: true, message: 'Code SAVE5 applied: 5% discount added!' };
    }
    return { success: false, message: 'Invalid promo code. Try "WELLBEING10" for 10% off.' };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    try { localStorage.removeItem('careplus_promo'); } catch {}
  };

  // Orders History State
  const [orders, setOrders] = useState<OrderConfirmationData[]>(() => {
    try {
      const saved = localStorage.getItem('careplus_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveOrder = (newOrder: OrderConfirmationData) => {
    // Save to local state and localStorage
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.orderNumber !== newOrder.orderNumber);
      const updated = [newOrder, ...filtered];
      try {
        localStorage.setItem('careplus_orders', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save order history', e);
      }
      return updated;
    });

    // Also persist directly to Neon Postgres
    api.saveOrder(newOrder).catch((err) => {
      console.warn('Could not sync order to Neon Postgres:', err);
    });
  };

  const lookupOrder = (orderNumber: string, postcodeOrEmail: string): OrderConfirmationData | null => {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanLookup = postcodeOrEmail.trim().toLowerCase().replace(/\s+/g, '');

    const found = orders.find((o) => {
      const matchNum = o.orderNumber.toUpperCase() === cleanNum;
      const matchEmail = o.customer.email.toLowerCase() === cleanLookup;
      const matchPostcode = o.customer.postcode.toLowerCase().replace(/\s+/g, '') === cleanLookup;
      return matchNum && (matchEmail || matchPostcode);
    });

    return found || null;
  };

  // Account Modal State
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Customer Profile State
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('careplus_customer_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const updateCustomerProfile = (profile: CustomerProfile) => {
    setCustomerProfile(profile);
    try {
      localStorage.setItem('careplus_customer_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  };

  // Wishlist State with localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('careplus_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('careplus_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist]);

  // Quick View Product
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Toast
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = (msg: NotificationState) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr?.id === msg.id ? null : curr));
    }, 4000);
  };

  const dismissNotification = () => setNotification(null);

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedPackSize?: string,
    openDrawer = true
  ) => {
    const chosenPack = selectedPackSize || (product.packSizes && product.packSizes[0]) || 'Standard';
    const itemKey = `${product.id}__${chosenPack}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === itemKey);
      if (existing) {
        return prevCart.map((item) =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: itemKey,
          product,
          quantity,
          selectedPackSize: chosenPack,
        },
      ];
    });

    showNotification({
      id: Math.random().toString(),
      message: `Added ${product.name} to your basket`,
      type: 'cart',
      productName: product.name,
      productImage: product.image,
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const discountAmount = appliedPromo ? cartSubtotal * discountRate : 0;

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const freeDeliveryThreshold = 35.0;
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  // Wishlist toggle
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showNotification({
          id: Math.random().toString(),
          message: `Removed ${product.name} from your saved items`,
          type: 'info',
        });
        return prev.filter((id) => id !== product.id);
      } else {
        showNotification({
          id: Math.random().toString(),
          message: `Saved ${product.name} to your wishlist`,
          type: 'success',
        });
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const wishlistCount = wishlist.length;

  // Quick View
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Execute Search
  const executeSearch = (q: string) => {
    if (!q.trim()) return;
    setSearchQuery(q);
    navigate('search', { q: q.trim() });
  };

  return (
    <ShopContext.Provider
      value={{
        route,
        navigate,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        freeDeliveryThreshold,
        amountNeededForFreeDelivery,
        appliedPromo,
        discountRate,
        discountAmount,
        applyPromoCode,
        removePromoCode,
        orders,
        saveOrder,
        lookupOrder,
        isAccountModalOpen,
        setIsAccountModalOpen,
        customerProfile,
        updateCustomerProfile,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        searchQuery,
        setSearchQuery,
        executeSearch,
        notification,
        dismissNotification,
        products,
        isLoadingProducts,
        refetchProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
