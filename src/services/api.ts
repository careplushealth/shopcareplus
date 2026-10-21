import { OrderConfirmationData, Product } from '../types';

export interface DbHealthStatus {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  databaseUrlConfigured: boolean;
  time?: string;
  version?: string;
  neonBranch?: string;
  error?: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  role?: string;
  pharmacy?: string;
  neonBranch?: string;
  message?: string;
  error?: string;
}

export interface StripeConfigResponse {
  configured: boolean;
  publishableKey?: string;
  currency?: string;
  error?: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  orderNumber?: string;
  amount?: number;
  currency?: string;
  needsConfig?: boolean;
  message?: string;
  error?: string;
}

async function safeFetchJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }
  const text = await res.text();
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('API route not found (404). Please ensure serverless functions are deployed on Vercel.');
    }
    throw new Error(`Server returned HTTP ${res.status}: ${text.slice(0, 100)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Server returned an unexpected non-JSON response.');
  }
}

export const api = {
  // Check health and connection to Neon Postgres
  async checkHealth(): Promise<DbHealthStatus> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        status: 'error',
        database: 'disconnected',
        databaseUrlConfigured: false,
        error: err.message || 'Failed to connect to /api/health',
      };
    }
  },

  // Public products list from Neon Postgres
  async getPublicProducts(): Promise<{ success: boolean; products?: Product[]; error?: string }> {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Save order to Neon Postgres
  async saveOrder(order: OrderConfirmationData): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.warn('Network error saving order to Neon Postgres:', err);
      return { success: false, error: err.message };
    }
  },

  // Lookup order from Neon Postgres
  async lookupOrder(orderNumber: string, lookupParam: string): Promise<OrderConfirmationData | null> {
    try {
      const q = new URLSearchParams({
        orderNumber: orderNumber.trim(),
        lookup: lookupParam.trim(),
      }).toString();
      const res = await fetch(`/api/orders?${q}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.order || null;
    } catch (err) {
      console.warn('Network error looking up order from Neon Postgres:', err);
      return null;
    }
  },

  // Subscribe to newsletter in Neon Postgres
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // Send contact inquiry to Neon Postgres
  async sendContactMessage(data: {
    name: string;
    email: string;
    orderNumber?: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  // ==========================================
  // STRIPE PAYMENT INTEGRATION
  // ==========================================

  // Check if Stripe is configured and retrieve publishable key
  async getStripeConfig(): Promise<StripeConfigResponse> {
    try {
      const res = await fetch('/api/stripe-config');
      if (!res.ok) return { configured: false };
      return await res.json();
    } catch (err: any) {
      return { configured: false, error: err.message };
    }
  },

  // Save Stripe API keys directly into .env.local
  async saveStripeConfig(keys: { secretKey: string; publishableKey: string }): Promise<{
    success: boolean;
    configured?: boolean;
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/stripe-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keys),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Create a Stripe PaymentIntent securely on server
  async createPaymentIntent(payload: {
    items: any[];
    deliveryMethod: string;
    customer: any;
    promoCode?: string | null;
  }): Promise<PaymentIntentResponse> {
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // ==========================================
  // ADMIN PORTAL METHODS (SECURE)
  // ==========================================

  // Admin Login with password
  async adminLogin(password: string): Promise<AdminLoginResponse> {
    try {
      return await safeFetchJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
    } catch (err: any) {
      return { success: false, message: err.message || 'Login request failed' };
    }
  },

  // Verify stored session token
  async adminVerify(token: string): Promise<{ success: boolean; authenticated?: boolean }> {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { success: false };
      return await res.json();
    } catch {
      return { success: false };
    }
  },

  // Admin: Get all products
  async adminGetProducts(token: string): Promise<{ success: boolean; products?: Product[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Admin: Create new product
  async adminCreateProduct(token: string, product: Partial<Product>): Promise<{ success: boolean; message?: string; id?: string; error?: string }> {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Admin: Update existing product
  async adminUpdateProduct(token: string, id: string, product: Partial<Product>): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Admin: Delete product
  async adminDeleteProduct(token: string, id: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Admin: Get orders
  async adminGetOrders(token: string): Promise<{ success: boolean; orders?: any[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Admin: Update order status
  async adminUpdateOrderStatus(token: string, orderNumber: string, status: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Admin: Get subscribers
  async adminGetSubscribers(token: string): Promise<{ success: boolean; subscribers?: any[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/subscribers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Admin: Get messages
  async adminGetMessages(token: string): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
