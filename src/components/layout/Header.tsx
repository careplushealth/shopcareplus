import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { Logo } from '../common/Logo';
import { AnnouncementBar } from './AnnouncementBar';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/categories';
import { PRODUCTS, POPULAR_SEARCH_TERMS } from '../../data/products';

interface HeaderProps {
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav }) => {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsAccountModalOpen,
    navigate,
    route,
    executeSearch,
    products,
  } = useShop();

  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const catalog = products && products.length > 0 ? products : PRODUCTS;

  // Close search dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const searchResults = query.trim()
    ? catalog.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchFocused(false);
      executeSearch(query.trim());
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsSearchFocused(false);
    setQuery('');
    navigate('product', { slug });
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveMegaMenu(null);
    navigate('shop', { category: categoryName });
  };

  const handleSubcategoryClick = (categoryName: string, subcategoryName: string) => {
    setActiveMegaMenu(null);
    navigate('shop', { category: categoryName, subcategory: subcategoryName });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-border shadow-subtle">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={onOpenMobileNav}
              className="p-2 -ml-2 rounded-lg text-brand-charcoal hover:bg-brand-surface focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Central Search Bar (Desktop) */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search vitamins, pain relief, skincare, mobility aids..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full bg-brand-surface/70 hover:bg-brand-surface text-brand-charcoal text-xs sm:text-sm pl-11 pr-24 py-2.5 rounded-full border border-brand-border focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all shadow-inner"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
              >
                Search
              </button>
            </form>

            {/* Live Autocomplete / Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-brand-lg shadow-dropdown border border-brand-border overflow-hidden z-50 p-4">
                {query.trim().length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-brand-borderLight text-xs text-brand-muted">
                      <span>Matching products</span>
                      <button
                        onMouseDown={() => {
                          setIsSearchFocused(false);
                          executeSearch(query);
                        }}
                        className="text-brand-primary font-semibold hover:underline"
                      >
                        View all results &rarr;
                      </button>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onMouseDown={() => handleSelectProduct(product.slug)}
                            className="flex items-center gap-3 p-2 hover:bg-brand-surface rounded-brand cursor-pointer transition-colors"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-11 h-11 object-contain bg-white rounded-md p-1 border border-brand-border/60 mix-blend-multiply shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] uppercase font-bold text-brand-primary tracking-wider">
                                {product.brand}
                              </p>
                              <p className="text-xs font-semibold text-brand-charcoal truncate">
                                {product.name}
                              </p>
                              <p className="text-[11px] text-brand-muted">
                                {product.category}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-brand-dark">
                              £{product.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs text-brand-muted">
                        No products found matching &ldquo;{query}&rdquo;.
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-brand-charcoal mb-2">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {POPULAR_SEARCH_TERMS.map((term) => (
                        <button
                          key={term}
                          onMouseDown={() => {
                            setQuery(term);
                            executeSearch(term);
                            setIsSearchFocused(false);
                          }}
                          className="text-xs bg-brand-surface hover:bg-brand-light text-brand-charcoal hover:text-brand-dark px-3 py-1 rounded-full transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-brand-borderLight">
                      <p className="text-[11px] text-brand-muted flex items-center gap-1.5">
                        <Sparkles size={12} className="text-brand-gold" />
                        <span>Trusted UK pharmacy dispensary & everyday wellbeing</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Account & Order Tracking */}
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className="hidden sm:flex flex-col items-center p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-lg group"
              aria-label="Account and order tracking"
            >
              <User size={20} className="group-hover:scale-105 transition-transform" />
              <span className="text-[10px] font-medium text-brand-muted group-hover:text-brand-primary mt-0.5">
                Account
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('wishlist')}
              className="relative flex flex-col items-center p-2 text-brand-charcoal hover:text-brand-primary transition-colors rounded-lg group"
              aria-label={`Wishlist with ${wishlistCount} saved items`}
            >
              <div className="relative">
                <Heart size={20} className={wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-[10px] font-medium text-brand-muted group-hover:text-brand-primary mt-0.5">
                Saved
              </span>
            </button>

            {/* Basket Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-brand-light hover:bg-brand-surface text-brand-dark px-3 py-2 sm:px-4 sm:py-2.5 rounded-full border border-brand-border transition-colors group"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <div className="relative">
                <ShoppingBag size={19} className="text-brand-primary group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand-dark text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-muted leading-tight">
                  Basket
                </span>
                <span className="text-xs font-bold text-brand-dark leading-tight">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="block md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search vitamins, pain relief, skincare..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-brand-surface text-brand-charcoal text-xs pl-10 pr-20 py-2.5 rounded-full border border-brand-border focus:border-brand-primary focus:bg-white focus:outline-none"
            />
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-dark text-white text-[11px] font-semibold px-3 py-1 rounded-full"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Primary Category Navigation Bar (Desktop) */}
      <nav className="hidden lg:block bg-brand-surface/50 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between text-xs font-semibold text-brand-charcoal tracking-wide">
            {/* Shop All */}
            <li>
              <button
                onClick={() => navigate('shop')}
                className={`py-3.5 px-3 flex items-center gap-1 hover:text-brand-primary transition-colors border-b-2 ${
                  route.path === 'shop' && !route.params?.category
                    ? 'border-brand-primary text-brand-primary font-bold'
                    : 'border-transparent'
                }`}
              >
                Shop All
              </button>
            </li>

            {/* Primary Category Links with Mega Menus */}
            {CATEGORIES.map((cat) => {
              const isCurrent = route.path === 'shop' && route.params?.category === cat.name;
              return (
                <li
                  key={cat.id}
                  className="relative group"
                  onMouseEnter={() => setActiveMegaMenu(cat.id)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`py-3.5 px-3 flex items-center gap-1.5 hover:text-brand-primary transition-colors border-b-2 ${
                      isCurrent
                        ? 'border-brand-primary text-brand-primary font-bold'
                        : 'border-transparent'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronDown size={12} className="text-brand-muted group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMegaMenu === cat.id && (
                    <div className="absolute top-full left-0 w-80 bg-white rounded-b-brand-lg shadow-dropdown border border-brand-border p-4 z-50 animate-fadeIn">
                      <div className="mb-3 pb-2 border-b border-brand-borderLight">
                        <p className="font-display font-semibold text-sm text-brand-dark">
                          {cat.name}
                        </p>
                        <p className="text-[11px] text-brand-muted mt-0.5 line-clamp-2">
                          {cat.description}
                        </p>
                      </div>

                      <div className="space-y-1">
                        {cat.subcategories.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => handleSubcategoryClick(cat.name, sub)}
                            className="w-full text-left text-xs py-1.5 px-2 rounded-md hover:bg-brand-surface text-brand-charcoal hover:text-brand-primary flex items-center justify-between group/sub transition-colors"
                          >
                            <span>{sub}</span>
                            <ArrowRight size={12} className="opacity-0 group-hover/sub:opacity-100 transition-opacity text-brand-primary" />
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-brand-borderLight">
                        <button
                          onClick={() => handleCategoryClick(cat.name)}
                          className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1"
                        >
                          View all in {cat.name} &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}

            {/* Special Offers Tag */}
            <li>
              <button
                onClick={() => navigate('shop', { onSale: 'true' })}
                className="py-3.5 px-3 flex items-center gap-1.5 text-brand-sale hover:text-red-700 font-bold transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-brand-sale animate-pulse" />
                <span>Special Offers</span>
                <span className="bg-brand-saleBg text-brand-sale text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                  Save
                </span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
