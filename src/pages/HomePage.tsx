import React from 'react';
import { Hero } from '../components/home/Hero';
import { TrustStrip } from '../components/home/TrustStrip';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { EditorialPromo } from '../components/home/EditorialPromo';
import { PopularPicks } from '../components/home/PopularPicks';
import { BrandQualityStory } from '../components/home/BrandQualityStory';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* 1. Hero banner with authentic lifestyle visual */}
      <Hero />

      {/* 2. Trust and benefits strip */}
      <TrustStrip />

      {/* 3. Shop by category image tiles */}
      <CategoryGrid />

      {/* 4. Featured products: Shop Our Favourites */}
      <FeaturedProducts />

      {/* 5. Editorial promotional banner: Small Steps. Better Wellbeing. */}
      <EditorialPromo />

      {/* 6. Best sellers: Popular Picks */}
      <PopularPicks />

      {/* 7. Brand and quality story: Everyday Health Essentials, Made Easier */}
      <BrandQualityStory />

      {/* 8. Newsletter sign-up section */}
      <NewsletterSection />
    </div>
  );
};
