import React, { useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import { ProductTabs } from '../components/product/ProductTabs';
import { ProductReviews } from '../components/product/ProductReviews';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { ArrowLeft } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { route, navigate, products } = useShop();

  const catalog = products && products.length > 0 ? products : PRODUCTS;

  const product = useMemo(() => {
    const slug = route.params?.slug;
    if (slug) {
      const found = catalog.find((p) => p.slug === slug);
      if (found) return found;
    }
    return catalog[0] || PRODUCTS[0];
  }, [route.params?.slug, catalog]);

  const scrollToReviews = () => {
    const el = document.getElementById('customer-reviews');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hasSale = product.originalPrice && product.originalPrice > product.price;
  const savings = hasSale ? (product.originalPrice! - product.price).toFixed(2) : null;

  return (
    <div className="py-8 bg-brand-offwhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <Breadcrumbs
            items={[
              { label: 'Shop', path: 'shop' },
              {
                label: product.category,
                path: 'shop',
                params: { category: product.category },
              },
              {
                label: product.subcategory,
                path: 'shop',
                params: { category: product.category, subcategory: product.subcategory },
              },
              { label: product.name },
            ]}
          />

          <button
            onClick={() => navigate('shop', { category: product.category })}
            className="text-xs font-semibold text-brand-muted hover:text-brand-primary inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <ArrowLeft size={14} /> Back to {product.category}
          </button>
        </div>

        {/* 2-Column Product Hero */}
        <div className="bg-white rounded-brand-xl p-6 sm:p-10 border border-brand-border shadow-subtle grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Gallery (6 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery
              images={product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : [product.image]}
              productName={product.name}
              hasSale={Boolean(hasSale)}
              savings={savings}
            />
          </div>

          {/* Right Column: Info & Purchasing (6 cols) */}
          <div className="lg:col-span-6">
            <ProductInfo product={product} onScrollToReviews={scrollToReviews} />
          </div>
        </div>

        {/* Product Information Accordions / Tabs */}
        <ProductTabs product={product} />

        {/* Verified Customer Reviews Section */}
        <ProductReviews product={product} />

        {/* Related Product Recommendations */}
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
};
