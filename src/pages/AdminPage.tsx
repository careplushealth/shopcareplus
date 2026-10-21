import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Package,
  ShoppingBag,
  Mail,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Eye,
  EyeOff,
  Database,
  X,
  Save,
} from 'lucide-react';
import { api, DbHealthStatus } from '../services/api';
import { Product } from '../types';
import { CATEGORIES } from '../data/categories';
import { useShop } from '../context/ShopContext';

// Built-in presets from public/images/products
const IMAGE_PRESETS = [
  { name: 'Panadol Advance', path: '/images/products/panadol-advance.jpg' },
  { name: 'Nurofen Express', path: '/images/products/nurofen-express.jpg' },
  { name: 'Gaviscon Double Action', path: '/images/products/gaviscon-double-action.jpg' },
  { name: 'Rennie Spearmint', path: '/images/products/rennie-spearmint.jpg' },
  { name: 'Imodium Instants', path: '/images/products/imodium-instants.jpg' },
  { name: 'Lemsip Max Cold & Flu', path: '/images/products/lemsip-max.jpg' },
  { name: 'Sudafed Decongestant Spray', path: '/images/products/sudafed-spray.jpg' },
  { name: 'Strepsils Honey & Lemon', path: '/images/products/strepsils-honey-lemon.jpg' },
  { name: 'Benylin Chesty Cough', path: '/images/products/benylin-chesty.jpg' },
  { name: 'Piriteze Allergy Relief', path: '/images/products/piriteze-allergy.jpg' },
  { name: 'Sudocrem Antiseptic', path: '/images/products/sudocrem.jpg' },
  { name: 'E45 Moisturising Cream', path: '/images/products/e45-cream.jpg' },
  { name: 'Savlon Antiseptic Cream', path: '/images/products/savlon.jpg' },
  { name: 'Berocca Orange Effervescent', path: '/images/products/berocca-orange.jpg' },
  { name: 'Voltarol Back & Muscle Pain Gel', path: '/images/products/voltarol-gel.jpg' },
  { name: 'Optrex Refreshing Eye Drops', path: '/images/products/optrex-eye-drops.jpg' },
  { name: 'Braun ThermoScan 7', path: '/images/products/braun-thermometer.jpg' },
  { name: 'Omron X2 Blood Pressure', path: '/images/products/omron-blood-pressure.jpg' },
  { name: 'Wellwoman Multivitamin', path: '/images/products/wellwoman.jpg' },
  { name: 'FreeStyle Libre 2 Sensor', path: '/images/products/freestyle-libre-2.jpg' },
  { name: 'FreeStyle Libre 3 Sensor', path: '/images/products/freestyle-libre-3.jpg' },
];

export const AdminPage: React.FC = () => {
  const { navigate, refetchProducts } = useShop();

  // Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('careplus_admin_token'));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'subscribers' | 'messages' | 'database'>('products');

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [dbHealth, setDbHealth] = useState<DbHealthStatus | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Product Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Product Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Delete Confirmation Modal State
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-verify token on mount
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (currentToken: string) => {
    const res = await api.adminVerify(currentToken);
    if (!res.success) {
      handleLogout();
    } else {
      loadAllAdminData(currentToken);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setAuthError('Please enter the admin password');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    const res = await api.adminLogin(password);
    setAuthLoading(false);

    if (res.success && res.token) {
      localStorage.setItem('careplus_admin_token', res.token);
      setToken(res.token);
      setPassword('');
      loadAllAdminData(res.token);
      showNotification('success', 'Logged in to CarePlus Health Admin Portal');
    } else {
      setAuthError(res.message || 'Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('careplus_admin_token');
    setToken(null);
    setProducts([]);
    setOrders([]);
    setSubscribers([]);
    setMessages([]);
  };

  const loadAllAdminData = async (activeAuthToken: string) => {
    setIsLoadingData(true);
    try {
      const [prodsRes, ordersRes, subsRes, msgsRes, healthRes] = await Promise.all([
        api.adminGetProducts(activeAuthToken),
        api.adminGetOrders(activeAuthToken),
        api.adminGetSubscribers(activeAuthToken),
        api.adminGetMessages(activeAuthToken),
        api.checkHealth(),
      ]);

      if (prodsRes.success && prodsRes.products) {
        setProducts(prodsRes.products);
      }
      if (ordersRes.success && ordersRes.orders) {
        setOrders(ordersRes.orders);
      }
      if (subsRes.success && subsRes.subscribers) {
        setSubscribers(subsRes.subscribers);
      }
      if (msgsRes.success && msgsRes.messages) {
        setMessages(msgsRes.messages);
      }
      setDbHealth(healthRes);
    } catch (err: any) {
      showNotification('error', `Error loading admin data: ${err.message}`);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setModalMode('create');
    setEditingProduct({
      id: `cp-${Date.now().toString(36)}`,
      name: '',
      brand: 'CarePlus Health',
      category: CATEGORIES[0].name,
      subcategory: 'General',
      price: 4.99,
      originalPrice: undefined,
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      stockCount: 50,
      isBestSeller: false,
      isFeatured: false,
      isNew: true,
      image: IMAGE_PRESETS[0].path,
      galleryImages: [IMAGE_PRESETS[0].path],
      shortDescription: '',
      description: '',
      keyFeatures: ['Clinically formulated', 'GPhC regulated quality', 'Fast dispatch across UK'],
      packSizes: ['Standard Pack'],
      dietaryTags: ['UK Approved'],
      dosageUsage: 'Use strictly as directed on the packaging or patient leaflet.',
      warnings: 'Keep out of sight and reach of children. If symptoms persist consult your pharmacist.',
      deliveryInfo: 'Royal Mail Tracked 48 Delivery across the UK.',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (p: Product) => {
    setModalMode('edit');
    setEditingProduct({
      ...p,
      packSizes: p.packSizes || ['Standard Pack'],
      keyFeatures: p.keyFeatures || [],
      galleryImages: p.galleryImages || [p.image],
    });
    setIsModalOpen(true);
  };

  // Save Product (Create or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!editingProduct.name?.trim() || !editingProduct.price) {
      showNotification('error', 'Product name and price are required');
      return;
    }

    setIsSavingProduct(true);
    try {
      if (modalMode === 'create') {
        const res = await api.adminCreateProduct(token, editingProduct);
        if (res.success) {
          showNotification('success', `Product "${editingProduct.name}" created in Neon Postgres!`);
          setIsModalOpen(false);
          await loadAllAdminData(token);
          refetchProducts();
        } else {
          showNotification('error', res.error || 'Failed to create product');
        }
      } else {
        const res = await api.adminUpdateProduct(token, editingProduct.id!, editingProduct);
        if (res.success) {
          showNotification('success', `Product "${editingProduct.name}" updated successfully!`);
          setIsModalOpen(false);
          await loadAllAdminData(token);
          refetchProducts();
        } else {
          showNotification('error', res.error || 'Failed to update product');
        }
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Quick Toggle In-Stock
  const handleToggleStock = async (product: Product) => {
    if (!token) return;
    const newStatus = !product.inStock;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, inStock: newStatus } : p))
    );

    const res = await api.adminUpdateProduct(token, product.id, { inStock: newStatus });
    if (res.success) {
      showNotification('success', `${product.name} is now ${newStatus ? 'In Stock' : 'Out of Stock'}`);
      refetchProducts();
    } else {
      showNotification('error', 'Failed to update stock status');
      loadAllAdminData(token);
    }
  };

  // Quick Stock Count Update
  const handleUpdateStockCount = async (product: Product, delta: number) => {
    if (!token) return;
    const newCount = Math.max(0, (product.stockCount || 0) + delta);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stockCount: newCount, inStock: newCount > 0 } : p))
    );

    await api.adminUpdateProduct(token, product.id, {
      stockCount: newCount,
      inStock: newCount > 0,
    });
    refetchProducts();
  };

  // Confirm Delete Product
  const handleDeleteProduct = async () => {
    if (!token || !deletingProductId) return;
    setIsDeleting(true);
    try {
      const res = await api.adminDeleteProduct(token, deletingProductId);
      if (res.success) {
        showNotification('success', 'Product deleted from Neon database');
        setDeletingProductId(null);
        await loadAllAdminData(token);
        refetchProducts();
      } else {
        showNotification('error', res.error || 'Failed to delete product');
      }
    } catch (err: any) {
      showNotification('error', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderNumber: string, status: string) => {
    if (!token) return;
    setOrders((prev) =>
      prev.map((o) => (o.order_number === orderNumber ? { ...o, status } : o))
    );

    const res = await api.adminUpdateOrderStatus(token, orderNumber, status);
    if (res.success) {
      showNotification('success', `Order ${orderNumber} status changed to ${status}`);
    } else {
      showNotification('error', 'Failed to update order status');
      loadAllAdminData(token);
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);

      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;

      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in_stock' && p.inStock) ||
        (stockFilter === 'out_of_stock' && !p.inStock);

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchQuery, categoryFilter, stockFilter]);

  // =========================================================
  // VIEW 1: AUTHENTICATION LOGIN CARD
  // =========================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              CarePlus Health Admin
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1.5">
              Wilmslow Road Pharmacy Management Portal
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full border border-emerald-300">
              <Database size={13} className="text-emerald-700" />
              <span>Connected to Neon Cloud Postgres</span>
            </div>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-red-100 border border-red-300 text-red-900 text-xs flex items-start gap-2.5 font-medium">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-700" />
              <div>
                <p className="font-bold text-red-950">Authentication failed</p>
                <p className="mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Administrator Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  className="w-full pl-4 pr-11 py-3 text-sm font-medium text-slate-900 bg-white rounded-xl border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 transition-all placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {authLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock size={16} className="text-white" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Protected by TLS encryption &amp; Bearer token authentication
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20">
      {/* Top Admin Navigation Header (Crisp high-contrast dark green) */}
      <header className="bg-[#0f392b] text-white shadow-lg border-b border-emerald-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-sm">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold font-serif tracking-tight text-white">
                  CarePlus Management Portal
                </h1>
                <span className="bg-emerald-800 text-emerald-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-600">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                Wilmslow Road Pharmacy &bull; Manchester &bull; Neon Postgres Production
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View storefront */}
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-bold transition-colors border border-white/20"
            >
              <ExternalLink size={14} />
              <span>View Storefront</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => token && loadAllAdminData(token)}
              disabled={isLoadingData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-bold transition-colors border border-white/20 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={isLoadingData ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-800">
          <nav className="flex space-x-2 sm:space-x-4 pt-2">
            {[
              { id: 'products', label: 'Product Catalog', icon: Package, count: products.length },
              { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, count: orders.length },
              { id: 'subscribers', label: 'Newsletter Subscribers', icon: Mail, count: subscribers.length },
              { id: 'messages', label: 'Contact Inquiries', icon: MessageSquare, count: messages.length },
              { id: 'database', label: 'Neon Database', icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-amber-400 text-white'
                      : 'border-transparent text-emerald-200 hover:text-white hover:border-emerald-600'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {feedback && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div
            className={`p-4 rounded-xl flex items-center justify-between gap-3 text-sm font-semibold shadow-md transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-950 border-2 border-emerald-400'
                : 'bg-red-100 text-red-950 border-2 border-red-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === 'success' ? (
                <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle size={20} className="text-red-700 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-600 hover:text-slate-900">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ========================================================= */}
        {/* TAB 1: PRODUCT CATALOG */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-950 font-serif">
                  Store Product Catalog ({products.length})
                </h2>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Manage live prices, stock levels, categories, images, and NHS/GPhC compliant details stored in Neon Postgres.
                </p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by title, brand, category, slug..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 placeholder-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs font-semibold text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">All Categories ({products.length})</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as any)}
                className="text-xs font-semibold text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              >
                <option value="all">All Stock Statuses</option>
                <option value="in_stock">In Stock Only</option>
                <option value="out_of_stock">Low / Out of Stock</option>
              </select>
            </div>

            {/* Products Table (High-contrast, bold text) */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Product</th>
                      <th className="py-3.5 px-4">Category &amp; Brand</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock Status</th>
                      <th className="py-3.5 px-4">Stock Qty</th>
                      <th className="py-3.5 px-4">Badges</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-600">
                          <Package className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                          <p className="font-bold text-slate-800 text-sm">No products found matching your filter</p>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setCategoryFilter('all');
                              setStockFilter('all');
                            }}
                            className="mt-2 text-emerald-800 underline text-xs font-bold"
                          >
                            Reset filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          {/* Image & Title */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 object-contain bg-white rounded-lg border-2 border-slate-200 p-1 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/images/products/panadol-advance.jpg';
                                }}
                              />
                              <div className="max-w-xs">
                                <p className="font-bold text-slate-950 leading-snug line-clamp-2 text-xs">
                                  {p.name}
                                </p>
                                <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                                  ID: {p.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category & Brand */}
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 block">{p.brand}</span>
                            <span className="text-[11px] font-semibold text-slate-600 block">{p.category}</span>
                            {p.subcategory && (
                              <span className="text-[10px] text-slate-500 block font-medium">
                                &rsaquo; {p.subcategory}
                              </span>
                            )}
                          </td>

                          {/* Price */}
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-slate-950 text-sm">
                              £{Number(p.price).toFixed(2)}
                            </span>
                            {p.originalPrice && (
                              <span className="text-[11px] text-slate-500 line-through block font-medium">
                                £{Number(p.originalPrice).toFixed(2)}
                              </span>
                            )}
                          </td>

                          {/* In Stock Toggle */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] transition-colors cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-950 border border-red-400 hover:bg-red-200'
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  p.inStock ? 'bg-emerald-700' : 'bg-red-700'
                                }`}
                              />
                              <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                            </button>
                          </td>

                          {/* Stock Qty Stepper */}
                          <td className="py-3.5 px-4">
                            <div className="inline-flex items-center rounded-lg border-2 border-slate-300 bg-white">
                              <button
                                onClick={() => handleUpdateStockCount(p, -5)}
                                className="px-2.5 py-1 text-slate-700 hover:bg-slate-200 rounded-l-lg font-bold"
                                title="Decrease by 5"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 font-extrabold text-slate-950 text-xs min-w-[32px] text-center">
                                {p.stockCount ?? 0}
                              </span>
                              <button
                                onClick={() => handleUpdateStockCount(p, 5)}
                                className="px-2.5 py-1 text-slate-700 hover:bg-slate-200 rounded-r-lg font-bold"
                                title="Increase by 5"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* Badges */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {p.isBestSeller && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-950 border border-amber-400 rounded text-[10px] font-bold">
                                  Best Seller
                                </span>
                              )}
                              {p.isFeatured && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-950 border border-purple-400 rounded text-[10px] font-bold">
                                  Featured
                                </span>
                              )}
                              {p.isNew && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-950 border border-blue-400 rounded text-[10px] font-bold">
                                  New
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-2 text-slate-700 hover:text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors border border-slate-300 cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => setDeletingProductId(p.id)}
                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-colors border border-red-200 cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CUSTOMER ORDERS */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950 font-serif">
                  Customer Orders ({orders.length})
                </h2>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Orders placed through checkout and stored in Neon Postgres. Update dispatch and delivery statuses in real-time.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4">Order #</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Delivery</th>
                      <th className="py-3.5 px-4">Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-600">
                          <ShoppingBag className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                          <p className="font-bold text-slate-800 text-sm">No orders recorded yet in Neon Postgres</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">
                            Complete a test checkout on the storefront to see live orders here!
                          </p>
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => {
                        let parsedItems: any[] = [];
                        try {
                          parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : o.items || [];
                        } catch {}

                        return (
                          <tr key={o.id || o.order_number} className="hover:bg-slate-50">
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-bold text-slate-950 block">{o.order_number}</span>
                              {o.payment_intent_id && (
                                <span
                                  className="text-[9px] font-mono text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 mt-1 inline-block font-semibold"
                                  title={`Stripe ID: ${o.payment_intent_id}`}
                                >
                                  Stripe: {o.payment_intent_id.slice(0, 12)}...
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 font-medium">
                              {o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB') : 'Today'}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-950">{o.customer_name || 'Customer'}</p>
                              <p className="text-slate-600 text-[11px] font-medium">{o.customer_email}</p>
                              {o.customer_phone && (
                                <p className="text-slate-500 text-[10px] font-mono">{o.customer_phone}</p>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="text-slate-900 font-medium">{o.delivery_method || 'Royal Mail'}</p>
                              <p className="text-slate-600 text-[11px] font-mono font-semibold">{o.postcode}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-950">
                                {parsedItems.length} item(s)
                              </span>
                              <div className="text-[10px] text-slate-600 font-medium max-w-xs truncate">
                                {parsedItems.map((item) => `${item.quantity}x ${item.product?.name || item.name || 'Item'}`).join(', ')}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-slate-950 text-sm">
                              £{Number(o.total || 0).toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={o.status || 'confirmed'}
                                onChange={(e) => handleUpdateOrderStatus(o.order_number, e.target.value)}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border-2 focus:outline-none cursor-pointer ${
                                  o.status === 'delivered'
                                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                                    : o.status === 'dispatched'
                                    ? 'bg-blue-100 text-blue-950 border-blue-400'
                                    : o.status === 'cancelled'
                                    ? 'bg-red-100 text-red-950 border-red-400'
                                    : 'bg-amber-100 text-amber-950 border-amber-400'
                                }`}
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="dispatched">Dispatched</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: NEWSLETTER SUBSCRIBERS */}
        {/* ========================================================= */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950 font-serif">
                  Newsletter Subscribers ({subscribers.length})
                </h2>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  Customers who subscribed to CarePlus wellbeing news, health advice, and VIP discounts.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Subscribed Date</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-600">
                        <Mail className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                        <p className="font-bold text-slate-800">No newsletter subscribers recorded yet</p>
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((s, index) => (
                      <tr key={s.id || s.email} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 text-slate-500 font-bold">{index + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-950">{s.email}</td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {s.created_at ? new Date(s.created_at).toLocaleString('en-GB') : 'Recent'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(s.email);
                              showNotification('success', `Copied ${s.email} to clipboard!`);
                            }}
                            className="text-emerald-800 hover:text-emerald-950 underline font-bold text-xs"
                          >
                            Copy Email
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CONTACT MESSAGES */}
        {/* ========================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950 font-serif">
                Contact Form Messages &amp; Enquiries ({messages.length})
              </h2>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Direct pharmacy customer inquiries sent from the Contact page.
              </p>
            </div>

            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-slate-200 text-slate-600">
                  <MessageSquare className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                  <p className="font-bold text-slate-800">No customer inquiries yet</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                      <div>
                        <span className="font-extrabold text-slate-950 text-sm">{m.name}</span>
                        <span className="text-slate-600 text-xs ml-2 font-mono font-medium">&lt;{m.email}&gt;</span>
                        {m.order_number && (
                          <span className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-950 border border-blue-300 rounded text-[11px] font-mono font-bold">
                            Ref: {m.order_number}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-600 font-medium">
                        {m.created_at ? new Date(m.created_at).toLocaleString('en-GB') : 'Just now'}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                        Subject: {m.subject}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                      {m.message}
                    </p>
                    <div className="mt-3.5 flex justify-end">
                      <a
                        href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'CarePlus Inquiry')}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                      >
                        <Mail size={13} />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: NEON DATABASE */}
        {/* ========================================================= */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center font-bold">
                  <Database size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-950 font-serif">
                    Neon Postgres Cloud Connection
                  </h2>
                  <p className="text-xs font-medium text-slate-600">
                    Production serverless database status &amp; connection telemetry.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <span className="text-[11px] uppercase font-bold text-slate-600 block">
                    Connection Status
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        dbHealth?.database === 'connected' ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'
                      }`}
                    />
                    <span className="font-extrabold text-slate-950 capitalize text-sm">
                      {dbHealth?.database || 'Checking...'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <span className="text-[11px] uppercase font-bold text-slate-600 block">
                    Neon Branch
                  </span>
                  <p className="font-mono font-extrabold text-slate-950 text-sm mt-1">
                    {dbHealth?.neonBranch || 'production'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <span className="text-[11px] uppercase font-bold text-slate-600 block">
                    PostgreSQL Version
                  </span>
                  <p className="font-mono text-xs font-bold text-slate-800 mt-1 truncate" title={dbHealth?.version}>
                    {dbHealth?.version ? dbHealth.version.split(' ')[1] : '17.4 (Postgres)'}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-emerald-100 border-2 border-emerald-300 text-xs text-emerald-950">
                <p className="font-bold flex items-center gap-2 text-sm text-emerald-950">
                  <CheckCircle2 size={18} className="text-emerald-800" />
                  Neon Serverless Architecture Active
                </p>
                <p className="mt-1 text-emerald-900 leading-relaxed font-medium">
                  Queries are issued via `@neondatabase/serverless` HTTP pooling driver. All products, orders, subscribers, and inquiries persist safely across deployments and client sessions.
                </p>
              </div>

              {/* Stripe Gateway Card in Admin */}
              <div className="mt-6 p-5 rounded-2xl bg-white border-2 border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                      S
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Stripe Payment Gateway</h3>
                      <p className="text-xs text-slate-500 font-medium">Accept UK Debit/Credit Cards, Apple Pay &amp; Google Pay</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('checkout')}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
                  >
                    <span>Go to Checkout to Connect</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Stripe Elements is wired to the checkout. Set <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono font-bold">STRIPE_SECRET_KEY</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono font-bold">VITE_STRIPE_PUBLISHABLE_KEY</code> in <code className="font-mono text-slate-800 font-bold">.env.local</code> to activate live or test processing.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border-2 border-slate-300 overflow-hidden text-slate-900">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b-2 border-slate-200 flex items-center justify-between bg-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-950 font-serif">
                  {modalMode === 'create' ? 'Add New Product to Store' : `Edit Product: ${editingProduct.name}`}
                </h3>
                <p className="text-xs font-medium text-slate-600 mt-0.5">
                  Fill in the details below. All changes will be saved to the Neon Postgres database.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
              {/* Product Name & Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                    placeholder="e.g. Panadol Advance 500mg Tablets"
                    className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    required
                    placeholder="e.g. Panadol, Nurofen, E45"
                    className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || CATEGORIES[0].name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-900 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={editingProduct.subcategory || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    placeholder="e.g. Pain Relief, Eye Care"
                    className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Price, Original Price, Stock Count */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Selling Price (£) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.10"
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-950 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Original Price (£) (Optional RRP)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.originalPrice ?? ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    placeholder="Leave empty if not on sale"
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-950 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stockCount ?? 50}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockCount: parseInt(e.target.value) || 0,
                        inStock: (parseInt(e.target.value) || 0) > 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold text-slate-950 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Toggles: In Stock, Best Seller, Featured, New */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-100 p-4 rounded-xl border-2 border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-xs">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isBestSeller)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                  />
                  <span>Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-xs">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isNew)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNew: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                  />
                  <span>New Item</span>
                </label>
              </div>

              {/* Product Image Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                  Product Image URL or Preset
                </label>

                <div className="flex gap-3 items-center mb-3">
                  <img
                    src={editingProduct.image || IMAGE_PRESETS[0].path}
                    alt="Preview"
                    className="w-16 h-16 object-contain bg-white rounded-xl border-2 border-slate-300 p-1 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/products/panadol-advance.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={editingProduct.image || ''}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          image: e.target.value,
                          galleryImages: [e.target.value],
                        })
                      }
                      placeholder="e.g. /images/products/panadol-advance.jpg or https://..."
                      className="w-full px-3.5 py-2.5 text-xs font-mono font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    <p className="text-[11px] text-slate-600 font-medium mt-1">
                      Choose a high-resolution local pharmacy preset below or paste an image URL.
                    </p>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-100 rounded-xl border border-slate-300">
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() =>
                        setEditingProduct({
                          ...editingProduct,
                          image: preset.path,
                          galleryImages: [preset.path],
                        })
                      }
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-bold transition-all cursor-pointer ${
                        editingProduct.image === preset.path
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                          : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short & Full Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                  Short Summary / Subtitle
                </label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  placeholder="One sentence description shown on product cards"
                  className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                  Full Clinical &amp; Product Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detailed healthcare and usage information..."
                  className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              {/* Clinical Dosage & Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Dosage &amp; Usage Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.dosageUsage || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dosageUsage: e.target.value })}
                    placeholder="e.g. Adults: Take 1-2 tablets every 4 to 6 hours..."
                    className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1.5">
                    Warnings &amp; Contraindications
                  </label>
                  <textarea
                    rows={2}
                    value={editingProduct.warnings || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, warnings: e.target.value })}
                    placeholder="e.g. Do not exceed the stated dose. Contains paracetamol..."
                    className="w-full px-3.5 py-2.5 text-xs font-medium text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingProduct ? (
                    <>
                      <RefreshCw size={14} className="animate-spin text-white" />
                      <span>Saving to Neon...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} className="text-white" />
                      <span>{modalMode === 'create' ? 'Create Product' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-slate-300">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-300">
              <Trash2 size={24} />
            </div>
            <h4 className="text-lg font-bold text-slate-950 font-serif">
              Delete Product?
            </h4>
            <p className="text-xs font-medium text-slate-600 mt-2">
              Are you sure you want to permanently delete this product from Neon Postgres? This cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl border-2 border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isDeleting ? <RefreshCw size={13} className="animate-spin" /> : null}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
