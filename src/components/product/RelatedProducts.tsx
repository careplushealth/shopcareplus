import React from 'react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../shop/ProductCard';
import { useShop } from '../../context/ShopContext';

interface RelatedProductsProps {
  currentProduct: Product;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct }) => {
  const { products } = useShop();
  const catalog = products && products.length > 0 ? products : PRODUCTS;

  // Related items from same category, or same brand, excluding current
  const related = catalog.filter(
    (p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.brand === currentProduct.brand)
  ).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24 pt-12 border-t border-brand-border">
      <div className="mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
          Recommendations
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-charcoal mt-1">
          You May Also Like
        </h2>
        <p className="text-xs text-brand-muted mt-1">
          Complementary health remedies and wellbeing essentials frequently purchased together.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
};
