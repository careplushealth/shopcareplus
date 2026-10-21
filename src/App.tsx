import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { NotificationToast } from './components/common/NotificationToast';
import { AccountModal } from './components/common/AccountModal';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { DeliveryReturnsPage } from './pages/DeliveryReturnsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';
import { AdminPage } from './pages/AdminPage';
import { OrderConfirmationData } from './types';

const AppContent: React.FC = () => {
  const { route, saveOrder } = useShop();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderConfirmationData | null>(() => {
    try {
      const saved = sessionStorage.getItem('careplus_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleOrderComplete = (order: OrderConfirmationData) => {
    setCompletedOrder(order);
    saveOrder(order);
    try {
      sessionStorage.setItem('careplus_last_order', JSON.stringify(order));
    } catch (e) {
      console.error(e);
    }
  };

  const renderCurrentPage = () => {
    switch (route.path) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage onOrderComplete={handleOrderComplete} />;
      case 'order-confirmation':
        return <OrderConfirmationPage orderData={completedOrder} />;
      case 'search':
        return <SearchResultsPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'about':
        return <AboutPage />;
      case 'delivery-returns':
        return <DeliveryReturnsPage />;
      case 'faqs':
        return <FaqPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  if (route.path === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AdminPage />
        <NotificationToast />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-offwhite">
      {/* Top Header & Navigation */}
      <Header onOpenMobileNav={() => setIsMobileNavOpen(true)} />

      {/* Mobile Drawer Menu */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      {/* Main Dynamic Page Content */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Shared UK Footer */}
      <Footer />

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <AccountModal />
      <NotificationToast />
      <CookieConsentBanner />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
};

export default App;
